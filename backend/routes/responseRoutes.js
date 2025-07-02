const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const checkRole = require('../middleware/roleMiddleware'); // Import role checker
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const reviewRoutes = require('./reviewRoutes'); // Import review routes


// --- Multer Configuration for File Uploads ---

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional - adjust as needed for video/file types)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/') || 
    file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Initialize multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware to check if the user can access responses for a given invitation
// Access allowed if: User is Admin OR User is assigned to the interview
async function checkResponseAccess(req, res, next) {
    const { invitationId } = req.params;
    const userId = req.user.id;
    const userRoleId = req.user.role_id;
    const organization_id = req.user.organization_id;

    try {
        // 1. Verify the invitation exists and belongs to the user's organization
        const [invitations] = await db.query('SELECT id, interview_id FROM invitations WHERE id = ? AND organization_id = ?', [invitationId, organization_id]);
        if (invitations.length === 0) {
            return res.status(404).json({ message: 'Invitation not found or access denied.' });
        }
        const interviewId = invitations[0].interview_id;

        // 2. Check if user is an Admin
        if (userRoleId === 1) {
            return next(); // Admins have access
        }

        // 3. If not Admin, check if user is assigned to the interview
        const [assignments] = await db.query(
            'SELECT id FROM interview_assignments WHERE interview_id = ? AND user_id = ?',
            [interviewId, userId]
        );

        if (assignments.length > 0) {
            return next(); // Assigned user has access
        }

        // 4. If none of the above, deny access
        return res.status(403).json({ message: 'Forbidden: You do not have permission to view these responses.' });

    } catch (error) {
        console.error('Error checking response access:', error);
        return res.status(500).json({ message: 'Error verifying response access.' });
    }
}

// --- API Endpoint for Fetching Responses ---

// GET /api/responses/invitation/:invitationId - Get all responses for a specific public invitation
router.get('/invitation/:invitationId', async (req, res) => {
    const { invitationId } = req.params;
    // Access already verified by checkResponseAccess middleware
    console.log('Fetching responses for invitation:', invitationId);
    try {
        // Fetch the responses
        const [interviewRows] = await db.query(
            `SELECT
                id, organization_id, job_id, user_id, title, token,
                description, status, expiry_date, created_at, updated_at
             FROM interviews
             WHERE token = ?
             LIMIT 1`,
            [invitationId]
          );
          
          if (!interviewRows.length) {
            return res.status(404).json({ error: 'Interview not found' });
          }
          
          const interview = interviewRows[0];
          
          const [questionRows] = await db.query(
            `SELECT
                id as id,
                interview_id,
                text as text,
                type as type,
                time_limit,
                retake,
                \`order\` as question_order,
                created_at,
                updated_at
             FROM questions
             WHERE interview_id = ?
             ORDER BY \`order\` ASC`,
            [interview.id]
          );
          
          // Return interview + questions
          res.json({
            interview,
            questions: questionRows
          });
          
        // ... existing response processing ...
        // res.json(questions);
    } catch (error) {
        console.error('Error fetching responses for invitation:', error);
        res.status(500).json({ message: 'Error fetching responses' });
    }
});

// GET /api/responses/private/invitation/:invitationId - Get all responses for a specific private invitation
router.get('/private/invitation/:invitationId', async (req, res) => {
    const { invitationId } = req.params;
    // Access already verified by checkResponseAccess middleware
    console.log('Fetching responses for invitation:', invitationId);

    try {

        const [invitationRows] = await db.query(
            `SELECT * FROM invitations WHERE token = ? LIMIT 1`,
            [invitationId]
        );

        if (!invitationRows.length) {
            return res.status(404).json({ error: 'Invitation not found' });
        }

        const invitation = invitationRows[0];

        // Fetch the responses
        const [interviewRows] = await db.query(
            `SELECT
                id, organization_id, job_id, user_id, title, token,
                description, status, expiry_date, created_at, updated_at
             FROM interviews
             WHERE id = ?
             LIMIT 1`,
            [invitation.interview_id]
          );
          
          if (!interviewRows.length) {
            return res.status(404).json({ error: 'Interview not found' });
          }
          
          const interview = interviewRows[0];
          
          const [questionRows] = await db.query(
            `SELECT
                id as id,
                interview_id,
                text as text,
                type as type,
                time_limit,
                retake,
                \`order\` as question_order,
                created_at,
                updated_at
             FROM questions
             WHERE interview_id = ?
             ORDER BY \`order\` ASC`,
            [interview.id]
          );
          
          // Return interview + questions
          res.json({
            interview,
            questions: questionRows
          });
          
        // ... existing response processing ...
        // res.json(questions);
    } catch (error) {
        console.error('Error fetching responses for invitation:', error);
        res.status(500).json({ message: 'Error fetching responses' });
    }
});

// --- API Endpoint for Submitting Responses ---

// POST /api/responses - Submit a response to a question
// Use upload.single('responseFile') for video/file uploads
router.post('/', upload.single('responseFile'), async (req, res) => {
  const { invitationToken, questionId, responseType, responseText, cvId } = req.body;
  const file = req.file;
  const serverBaseUrl = `${req.protocol}://${req.get('host')}`;


  if (!invitationToken || !questionId || !responseType) {
    return res.status(400).json({ message: 'invitationToken, questionId, and responseType are required.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Validate Invitation Token and get interview ID
    const [Interviews] = await connection.query(
      'SELECT id, status FROM interviews WHERE token = ? AND (expiry_date IS NULL OR expiry_date > NOW()) AND status NOT IN ("completed", "canceled")',
      [invitationToken]
    );

    if (Interviews.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Invalid, expired, or completed Interview token.' });
    }

    const interviewId = Interviews[0].id;

    // 2. Validate that question belongs to this interview
    const [questions] = await connection.query(
      'SELECT type FROM questions WHERE id = ? AND interview_id = ?',
      [questionId, interviewId]
    );

    if (questions.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Question ID does not belong to the specified interview.' });
    }

    const expectedResponseType = questions[0].type;

    // 3. Validate response type
    if (responseType !== expectedResponseType) {
      await connection.rollback();
      return res.status(400).json({ message: `Invalid responseType. Expected '${expectedResponseType}' but received '${responseType}'.` });
    }

    // Check if a response already exists
    const [existingResponses] = await connection.query(
    'SELECT id FROM responses WHERE interview_id = ? AND question_id = ? AND cv_id = ?',
    [interviewId, questionId, cvId]
    );

    if (existingResponses.length > 0) {
    await connection.rollback();
    return res.status(409).json({ message: 'Response already submitted for this question.' });
    }


    // 4. Insert into responses table with 'submitted' status even if response is null
    const [responseResult] = await connection.query(
      'INSERT INTO responses (interview_id, question_id, response_type, cv_id, status) VALUES (?, ?, ?, ?, ?)',
      [interviewId, questionId, responseType, cvId, 'submitted']
    );

    const responseId = responseResult.insertId;

    // 5. Insert response content (if available), or null if skipped
    if (responseType === 'text') {
      await connection.query(
        'INSERT INTO text_responses (response_id, text) VALUES (?, ?)',
        [responseId, responseText?.trim() || null]
      );
    } else if (responseType === 'video') {
      const videoUrl = file ? `${serverBaseUrl}/uploads/${file.filename}` : null;

      await connection.query(
        'INSERT INTO video_responses (response_id, video_url, duration) VALUES (?, ?, ?)',
        [responseId, videoUrl, null]
      );
    } else if (responseType === 'file') {
      const filePathUrl = file ? `${serverBaseUrl}/uploads/${file.filename}` : null;

      await connection.query(
        'INSERT INTO file_responses (response_id, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?)',
        [
          responseId,
          filePathUrl,
          file ? file.originalname : null,
          file ? file.size : null,
          file ? file.mimetype : null
        ]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Response submitted successfully', responseId });

  } catch (error) {
    await connection.rollback();
    console.error('Error submitting response:', error);

    if (req.file) {
      try { fs.unlinkSync(req.file.path); } 
      catch (unlinkErr) { console.error("Error deleting uploaded file after DB error:", unlinkErr); }
    }

    res.status(500).json({ message: 'Error submitting response', error: error.message });
  } finally {
    connection.release();
  }
});

// POST /api/responses/invitation - Submit a response to a question
// Use upload.single('responseFile') for video/file uploads
router.post('/invitation', upload.single('responseFile'), async (req, res) => {
  const { invitationToken, questionId, responseType, responseText} = req.body;
  const file = req.file; // Uploaded file details from multer

  if (!invitationToken || !questionId || !responseType) {
    return res.status(400).json({ message: 'invitationToken, questionId, and responseType are required.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Validate Invitation Token and get invitation ID
    const [Invitations] = await connection.query(
      'SELECT id, interview_id, status FROM invitations WHERE token = ? AND (expires_at IS NULL OR expires_at > NOW()) AND status NOT IN ("completed", "canceled")',
      [invitationToken]
    );

    if (Invitations.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Invalid, expired, or completed Interview token.' });
    }
    const invitation = Invitations[0];
    const interviewId = invitation.interview_id;

    // 2. Validate Question ID belongs to the correct interview
    const [questions] = await connection.query(
      'SELECT type FROM questions WHERE id = ? AND interview_id = ?',
      [questionId, interviewId]
    );

    if (questions.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Question ID does not belong to the specified interview.' });
    }
    const expectedResponseType = questions[0].type; // e.g., 'video', 'text', 'file'

    // 3. Validate responseType matches question type and required data is present
    if (responseType !== expectedResponseType) {
        await connection.rollback();
        return res.status(400).json({ message: `Invalid responseType. Expected '${expectedResponseType}' but received '${responseType}'.` });
    }

    if (responseType === 'text' && !responseText) {
        await connection.rollback();
        return res.status(400).json({ message: 'responseText is required for text responses.' });
    }
    if ((responseType === 'video' || responseType === 'file') && !file) {
        await connection.rollback();
        // Clean up potentially uploaded file if validation fails later (though multer might handle this)
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'A file upload is required for video/file responses.' });
    }

    // 4. Insert into `responses` table
    const [responseResult] = await connection.query(
      'INSERT INTO responses (interview_id, question_id, response_type, status) VALUES (?, ?, ?, ?)',
      [interviewId, questionId, responseType, 'submitted'] // Mark as submitted
    );
    const responseId = responseResult.insertId;

    // 5. Insert into specific response table based on type
    if (responseType === 'text') {
      await connection.query(
        'INSERT INTO text_responses (response_id, text) VALUES (?, ?)',
        [responseId, responseText]
      );
    } else if (responseType === 'video') {
      await connection.query(
        'INSERT INTO video_responses (response_id, video_url, duration) VALUES (?, ?, ?)',
        [responseId, file.path, null] // Store file path, duration might be added later
      );
    } else if (responseType === 'file') {
      await connection.query(
        'INSERT INTO file_responses (response_id, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?)',
        [responseId, file.path, file.originalname, file.size, file.mimetype]
      );
    }
    // TODO: Handle 'audio' and 'multiple_choice' if implemented

    // 6. Update invitation status (optional: could be done after all questions are answered)
    // if (invitation.status === 'sent' || invitation.status === 'viewed') {
    //     await connection.query('UPDATE invitations SET status = ? WHERE id = ?', ['started', invitationId]);
    // }
    // TODO: Add logic to check if this is the last question and update status to 'completed'.

    await connection.commit();
    res.status(201).json({ message: 'Response submitted successfully', responseId: responseId });

  } catch (error) {
    await connection.rollback();
    console.error('Error submitting response:', error);
    // Clean up uploaded file if an error occurred during DB operations
    if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error("Error deleting uploaded file after DB error:", unlinkErr); }
    }
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  } finally {
    connection.release();
  }
});

// --- Nested Routes for Reviews ---

// Mount review routes under /:responseId/reviews, protected by auth middleware
router.use('/:responseId/reviews', authMiddleware, reviewRoutes);

module.exports = router;
