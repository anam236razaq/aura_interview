const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises; 
const { v4: uuidv4 } = require('uuid');
const questionRoutes = require('./questionRoutes'); // Import question routes
const invitationRoutes = require('./invitationRoutes'); // Import invitation routes
const assignmentRoutes = require('./assignmentRoutes'); // Import assignment routes
const checkRole = require('../middleware/roleMiddleware'); // Import role checker
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const invitationQueue = require('../Queues/invitationQueue');

// GET /api/interviews - Get all interviews for the logged-in user's organization
router.get('/', async (req, res) => {
  const organization_id = req.user.organization_id;
  const { type, page = 1, limit = 10, search, status } = req.query; // Defaults: page 1, 10 items per page
  const now = new Date();

  let query = 'FROM interviews WHERE organization_id = ?';
  let params = [organization_id];

  if(status){
    query += ' AND status = ?';
    params.push(status);
  }

  if (type === 'upcoming') {
    query += ' AND expiry_date > ?';
    params.push(now);
  } else if (type === 'expired') {
    query += ' AND expiry_date <= ?';
    params.push(now);
  }

  //Search Logic
  if(search){
    query+= ' AND (title LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Pagination logic
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [countResult] = await db.query(`SELECT COUNT(*) as total ${query}`, params);
    const total = countResult[0].total;

    const [interviews] = await db.query(
        `SELECT * ${query} ORDER BY expiry_date DESC LIMIT ? OFFSET ?`, 
        [...params, parseInt(limit), offset]
    );
    
    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      interviews,
      total,
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
});


// GET /api/interviews/:id - Get a specific interview (ensure it belongs to the user's org)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
   
    const organization_id = req.user.organization_id; // Get org ID from authenticated user
    try {
        const [interviews] = await db.query('SELECT * FROM interviews WHERE id = ? AND organization_id = ?', [id, organization_id]);
        if (interviews.length === 0) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        const interview = interviews[0];

        // Fetch questions for the interview
        const [questions] = await db.query('SELECT * FROM questions WHERE interview_id = ? ORDER BY `order` ASC', [id]);

        // Add questions to the interview object
        interview.questions = questions;

         // Fetch job details for the interview
         const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND organization_id = ?', [interview.job_id, organization_id]);

         if (jobs.length > 0) {
            interview.job = jobs[0];
         }

        res.json(interview);
    } catch (error) {
        console.error('Error fetching interview:', error);
        res.status(500).json({ message: 'Error fetching interview' });
    }
});

// POST /api/interviews - Create a new interview (uses user's org ID) - Only Admins
router.post('/', checkRole([1, 2]), async (req, res) => {
    let { title, description, userId, jobId, companyId, introVideo, outroVideo, candidateIds, reviewers, expiry_date, questions, newUser, newJob } = req.body;
    const organization_id = req.user.organization_id; // Get org ID from authenticated user

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    // if user does not exist, create a new one
    if(!userId && newUser){
        const {first_name, last_name, email, password, role_id} = newUser;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'New user info is incomplete.' });
        }

        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

         // Hash the temporary password
         const salt = await bcrypt.genSalt(10);
         const password_hash = await bcrypt.hash(password, salt);
 
         // Insert the new user
         const [userResult] = await db.query(
             'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id) VALUES (?, ?, ?, ?, ?, ?)',
             [email, password_hash, first_name, last_name, role_id, organization_id]
         );

         userId = userResult.insertId;
    }

    //if job does not exist, create a new one
    if(!jobId && newJob){
        const { title, description, location, salary_range, application_deadline } = newJob;

        if (!title) {
            return res.status(400).json({ message: 'Job title is required.' });
        }

        const [jobResult] = await db.query(
            'INSERT INTO jobs (organization_id, title, description, location, salary_range, application_deadline) VALUES (?, ?, ?, ?, ?, ?)',
            [organization_id, title, description, location, salary_range, application_deadline]
        );

        jobId = jobResult.insertId;
    }

    try {
        const sharedUUID = uuidv4();
        const [result] = await db.query(
            'INSERT INTO interviews (organization_id, title, description, user_id, job_id, company_id,  expiry_date, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [organization_id, title, description, userId, jobId, companyId, expiry_date, sharedUUID]
        );
        const interviewId = result.insertId;

        // Insert questions into the questions table
        if (questions && Array.isArray(questions)) {
            for (const question of questions) {
                const { text, type, time_limit, order } = question;
                await db.query(
                    'INSERT INTO questions (interview_id, text, type, time_limit, `order`) VALUES (?, ?, ?, ?, ?)',
                    [interviewId, text, type, time_limit, order]
                );
            }
        }

        // Insert assigned reviewers into interview_assignments table
        if (reviewers && Array.isArray(reviewers)) {
            for (const reviewerId of reviewers) {
                await db.query(
                    'INSERT INTO interview_assignments (interview_id, user_id) VALUES (?, ?)',
                    [interviewId, reviewerId]
                );
            }
        }

        // Insert selected candidates into invitations table
         if (candidateIds && Array.isArray(candidateIds)) {
             for (const candidateId of candidateIds) {
                 // Generate a unique token for each candidate
                 const token = uuidv4();
                 // Fetch candidate details from cvs table
                 const [cvsData] = await db.query('SELECT personal_info FROM cvs WHERE id = ?', [candidateId.candidateId]);
                 if (cvsData.length > 0) {
                    const personal_info = JSON.parse(cvsData[0].personal_info);
                    const { email, fullName } = personal_info;
                    
                    let first_name ='';
                    let last_name ='';

                    if(fullName){
                        const nameParts = fullName.trim().split(' ');
                        first_name = nameParts[0];
                        last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
                    }

                     await db.query(
                        'INSERT INTO invitations (interview_id, cvs_id, email, first_name, last_name, token, organization_id, intro_video, outro_video) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [interviewId, candidateId.candidateId, email, first_name, last_name, token, organization_id, introVideo, outroVideo]
                     );
                 }
             }
         }

        res.status(201).json({ id: interviewId, organization_id, title, description, userId, jobId, candidateIds, reviewers, expiry_date, questions, companyId, introVideo, outroVideo });
    } catch (error) {
        console.error('Error creating interview:', error);
        res.status(500).json({ message: 'Error creating interview' });
    }
});

// PUT /api/interviews/:id - Update an existing interview (ensure it belongs to the user's org) - Only Admins
router.put('/:id', checkRole([1, 2]), async (req, res) => {
  const { id } = req.params;
  const { title, description, expiry_date, questions } = req.body;
  const organization_id = req.user.organization_id; // Get org ID from authenticated user

  if (!title && !description && !expiry_date && !questions) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  try {
    // Check if interview exists and belongs to the organization
    const [existing] = await db.query('SELECT id FROM interviews WHERE id = ? AND organization_id = ?', [id, organization_id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Interview not found or access denied' });
    }

    // Build the update query dynamically
    let query = 'UPDATE interviews SET ';
    const params = [];
    if (title) {
      query += 'title = ?, ';
      params.push(title);
    }
    if (description) {
      query += 'description = ?, ';
      params.push(description);
    }
    if (expiry_date) {
      query += 'expiry_date = ?, ';
      params.push(expiry_date);
    }

    if(params.length > 0) {
    query = query.slice(0, -2); // Remove trailing comma and space
    query += ' WHERE id = ? AND organization_id = ?';
    params.push(id, organization_id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      // Should not happen due to the check above, but good practice
      return res.status(404).json({ message: 'Interview not found' });
    }
    }

    // Update questions
    if (questions && Array.isArray(questions)) {
      // Delete existing questions
      await db.query('DELETE FROM questions WHERE interview_id = ?', [id]);

      // Insert new questions
      for (const question of questions) {
        const { text, type, time_limit, order } = question;
        await db.query(
          'INSERT INTO questions (interview_id, text, type, time_limit, `order`) VALUES (?, ?, ?, ?, ?)',
          [id, text, type, time_limit, order]
        );
      }
    }

    // Fetch the updated interview data
    const [updatedInterviews] = await db.query('SELECT * FROM interviews WHERE id = ?', [id]);
    res.json(updatedInterviews[0]);

  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({ message: 'Error updating interview' });
  }
});

// DELETE /api/interviews/:id - Delete an interview (ensure it belongs to the user's org) - Only Admins
router.delete('/:id', checkRole([1, 2]), async (req, res) => {
  const { id } = req.params;
  const organization_id = req.user.organization_id; // Get org ID from authenticated user

  try {
    // Add cascading delete or handle related records (questions, invitations, etc.) if necessary
    const [result] = await db.query('DELETE FROM interviews WHERE id = ? AND organization_id = ?', [id, organization_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interview not found or access denied' });
    }

    res.json({message: 'Interview Deleted Successfully'}); // No content on successful deletion
  } catch (error) {
    console.error('Error deleting interview:', error);
    // Handle foreign key constraint errors if cascading delete is not set up
    res.status(500).json({ message: 'Error deleting interview' });
  }
});

// PATCH /api/interviews/:id/status - Update only the status of an interview
router.patch('/:id/status', checkRole([1, 2]), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const organization_id = req.user.organization_id;

    // Basic validation (add more specific status checks if needed)
    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }
    const allowedStatuses = ['draft', 'active', 'completed', 'archived'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE interviews SET status = ? WHERE id = ? AND organization_id = ?',
            [status, id, organization_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Interview not found or you do not have permission to update it.' });
        }

        //If status is set to 'active', process unsent invitations
        if(status === 'active'){
            const [invitations] = await db.query( 'SELECT * FROM invitations WHERE interview_id = ? AND status = "unsent"',
            [interviewId]);

            for(const invite of invitations){
                await db.query('UPDATE invitations SET status = "sent" WHERE id = ?', [invite.id]);
                await invitationQueue.add('sendEmail', {
                    email: invite.email,
                    token: invite.token,
                    first_name: invite.first_name,
                    last_name: invite.last_name,
                    message: invite.message,
                })
            }
        }

        res.json({ message: 'Interview status updated successfully.', status: status });
    } catch (error) {
        console.error('Error updating interview status:', error);
        res.status(500).json({ message: 'Error updating interview status' });
    }
});

// GET /api/interviews/:id/invitation-token - Generates or retrieves an invitation token for the interview
router.get('/:id/invitation-token', authMiddleware,  async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the interview exists
        const [interview] = await db.query('SELECT id FROM interviews WHERE id = ?', [id]);
        if (!interview.length) {
            return res.status(404).json({ message: 'Interview not found.' });
        }

        // 1. Check if an invitation token already exists for the interview
        const [existingInvitations] = await db.query('SELECT token FROM interviews WHERE id = ?', [id]);

        if (existingInvitations.length > 0) {
            // 2. If an invitation token already exists, return the existing token
            return res.json({ token: existingInvitations[0].token });
        } else {
            // 3. If an invitation token does not exist, generate a new token and save it to the database
            let token;
            let tokenExists = true;
            // Ensure token is unique
            while (tokenExists) {
                token = uuidv4();
                const [existingToken] = await db.query('SELECT token FROM interviews WHERE token = ?', [token]);
                tokenExists = existingToken.length > 0;
            }

            // Save the new token to the database using UPDATE
            await db.query('UPDATE interviews SET token = ? WHERE id = ?', [token, id]);

            // 4. Return the invitation token
            return res.json({ token: token });
        }
    } catch (error) {
        console.error('Error generating invitation token:', error);
        res.status(500).json({ message: 'Error generating invitation token.' });
    }
});

//Retrives invitation token on the basis of interview_id
router.get('/invitation/:interviewId/:token' ,  async (req, res) => { 
    const { interviewId, token } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT inv.*
             FROM invitations inv
             JOIN interviews i ON i.id = inv.interview_id
             WHERE inv.token = ? AND i.id = ?`,
            [token, interviewId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invalid or unauthorized token.' });
        }

        const invitation = rows[0];

        // Valid token — proceed to show interview screen
        res.status(200).json({
            message: 'Valid invitation',
            interviewId: invitation.interview_id,
            token: invitation.token,
            candidateName: `${invitation.first_name} ${invitation.last_name}`,
        });
    } catch (err) {
        console.error('Error validating invitation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET /api/interviews/:interviewId/all-responses - Get all responses for an interview, grouped by candidate
router.get('/:interviewId/all-responses', async (req, res) => {
    const { interviewId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const organization_id = req.user.organization_id;

    try {
        // 1. Verify interview exists and belongs to the organization
        const [interviews] = await db.query(
            'SELECT id, title FROM interviews WHERE id = ? AND organization_id = ?',
            [interviewId, organization_id]
        );
        if (interviews.length === 0) {
            return res.status(404).json({ message: 'Interview not found or access denied.' });
        }
        const interviewTitle = interviews[0].title;

        //Query with optional search on name/email
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchClause = search
            ? `AND (JSON_UNQUOTE(JSON_EXTRACT(cv.personal_info, '$.name')) LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cv.personal_info, '$.email')) LIKE ?)`
            : '';
        
        const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

        //Count total candidates
        const [countResult] = await db.query(
            `SELECT COUNT(DISTINCT r.cv_id) as total
                FROM responses r
                JOIN cvs cv ON r.cv_id = cv.id
                WHERE r.interview_id = ? 
                ${searchClause}`, [interviewId, ...searchParams]
        )
        const total = countResult[0].total;

         // 3. Get paginated CV IDs
        const [cvRows] = await db.query(
            `SELECT DISTINCT r.cv_id, cv.personal_info
            FROM responses r
            JOIN cvs cv ON r.cv_id = cv.id
            WHERE r.interview_id = ?
            ${searchClause}
            ORDER BY r.cv_id
            LIMIT ? OFFSET ?`,
            [interviewId, ...searchParams, parseInt(limit), offset]
        );

        const cvIds = cvRows.map(row => row.cv_id);
        if (cvIds.length === 0) {
            return res.json({
                interviewTitle,
                candidates: [],
                page: parseInt(page),
                limit: parseInt(limit),
                total
            });
        }

        // 2. Fetch all responses with related data
            const [rows] = await db.query(`
            SELECT 
                r.id as response_id, r.cv_id, r.question_id, r.response_type,
                q.text as question_text,
                cv.personal_info,
                tr.text as text_content,
                vr.video_url as video_content,
                fr.file_path as file_content
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            JOIN cvs cv ON r.cv_id = cv.id
            LEFT JOIN text_responses tr ON r.id = tr.response_id AND r.response_type = 'text'
            LEFT JOIN video_responses vr ON r.id = vr.response_id AND r.response_type = 'video'
            LEFT JOIN file_responses fr ON r.id = fr.response_id AND r.response_type = 'file'
            WHERE r.interview_id = ? AND r.cv_id IN (?)
            ORDER BY r.cv_id, q.order
        `, [interviewId, cvIds]);

        // 3. Group responses by candidate
        const candidatesMap = new Map();
        rows.forEach(row => {
            const cvId = row.cv_id;
            if (!candidatesMap.has(cvId)) {
                const personalInfo = JSON.parse(row.personal_info || '{}');
                candidatesMap.set(cvId, {
                    cvId: cvId,
                    name: personalInfo.name || 'N/A',
                    email: personalInfo.email || 'N/A',
                    responses: []
                });
            }

            let content = null;
            if (row.response_type === 'text') content = row.text_content;
            else if (row.response_type === 'video') content = row.video_content; // Assuming video_url is the path/URL
            else if (row.response_type === 'file') content = row.file_content; // Assuming file_path is the path/URL

            candidatesMap.get(cvId).responses.push({
                questionId: row.question_id,
                questionText: row.question_text,
                type: row.response_type,
                content
            });
        });

        const candidatesArray = Array.from(candidatesMap.values());

        // 4. Return the structured data
        res.json({
            interviewTitle,
            candidates: candidatesArray,
            page: parseInt(page),
            limit: parseInt(limit),
            total,

        });

    } catch (error) {
        console.error('Error fetching all responses for interview:', error);
        res.status(500).json({ message: 'Error fetching responses' });
    }
});

// PUT /api/interviews/bulk-update - Update status for multiple interviews
router.post('/bulk-update', checkRole([1]), async (req, res) => {
    const { ids, status } = req.body;
    const organization_id = req.user.organization_id;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Interview IDs must be provided as a non-empty array.' });
    }
    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }
    const allowedStatuses = ['draft', 'active', 'completed', 'archived'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        // Ensure all IDs are numbers (basic sanitation)
        const numericIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (numericIds.length !== ids.length) {
            return res.status(400).json({ message: 'Invalid interview IDs provided.' });
        }

        // Use IN clause to update multiple rows safely
        const [result] = await db.query(
            'UPDATE interviews SET status = ? WHERE id IN (?) AND organization_id = ?',
            [status, numericIds, organization_id]
        );

        res.json({ message: `Successfully updated status for ${result.affectedRows} interviews.`, affectedRows: result.affectedRows });

    } catch (error) {
        console.error('Error applying bulk interview update:', error);
        res.status(500).json({ message: 'Error applying bulk update' });
    }
});

// --- Multer Configuration for Video Uploads ---
const videoUploadDir = path.join(__dirname, '../uploads/video_temp');

// Ensure video_temp directory exists
fs.mkdir(videoUploadDir, { recursive: true }).catch(console.error);

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, videoUploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const videoFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'video/webm'];
  
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4 and webm are allowed.'), false);
    }
  };

  const uploadVideo = multer({storage: videoStorage, fileFilter: videoFileFilter, limits: { fileSize: 50 * 1024 * 1024 }});

  router.post('/upload', checkRole([1,2]),  uploadVideo.single('videoFile'), async(req, res) => {
    const organization_id = req.user.organization_id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Video file (cvFile) is required.' });
    }

    try {
        res.status(200).json({
            message: 'Video uploaded successfully',
            filename: file.filename,
            path: `/uploads/video_temp/${file.filename}`,
            organization_id: organization_id
        });
      } catch (error) {
        console.error('Error during video upload:', error);
        res.status(500).json({ message: 'Failed to upload video.', error: error.message });
      }
  })

// Nested route for questions related to a specific interview
router.use('/:interviewId/questions', questionRoutes);

// Nested route for invitations related to a specific interview
router.use('/:interviewId/invitations', invitationRoutes);

// Nested route for assignments related to a specific interview
router.use('/:interviewId/assignments', assignmentRoutes); // Mount assignment routes

// Mount the question routes also at the top level for direct access by question ID
router.use('/questions', questionRoutes);

module.exports = router;
