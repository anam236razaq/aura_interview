const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs').promises; 
const FormData = require('form-data');
const axios = require('axios');
const crypto = require('crypto');
const fsSync = require('fs'); 

// GET /api/users - List users within the admin's organization (Admin only)
router.get('/', authMiddleware, checkRole([1, 2, 3]), async (req, res) => {
  const organization_id = req.user.organization_id;
  const { page = 1, limit = 10, search, status, type } = req.query;

  let query = `
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE users.organization_id = ?`;
  let params = [organization_id];

  // Search logic
  if (search) {
    query += ` AND (
      users.email LIKE ? OR 
      users.first_name LIKE ? OR 
      users.last_name LIKE ? OR 
      roles.name LIKE ?
    )`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if(status){
    query+= ` AND users.status = ?`;
    params.push(status)
  }

  if(type){
    query+= ` AND roles.name = ?`;
    params.push(type)
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Total count
    const [countResult] = await db.query(`SELECT COUNT(*) as total ${query}`, params);
    const total = countResult[0].total;

    // Paginated data
    const [users] = await db.query(
    `SELECT 
        users.id, 
        users.email, 
        users.first_name, 
        users.last_name, 
        users.role_id, 
        roles.name AS role_name,
        users.status
        ${query}
        ORDER BY users.created_at DESC 
        LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      users,
      total,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

//Update the status
router.put('/:id/status', authMiddleware, checkRole([1]), async(req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    try{
        await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        res.json({message: 'Status updated successfully'})
    }catch(error){
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Error updating user status.' });
    }
})

// POST /api/users/invite - Invite/Create a new user within the organization (Admin only)
router.post('/invite', authMiddleware, checkRole([1]), async (req, res) => {
    const { email, first_name, last_name, role_id } = req.body;
    const organization_id = req.user.organization_id;

    // Validate input
    if (!email || !first_name || !last_name || !role_id) {
        return res.status(400).json({ message: 'Email, first name, last name, and role ID are required.' });
    }
    // Ensure admin isn't trying to create another admin or invalid role through this route
    if (parseInt(role_id) === 1) { 
        return res.status(400).json({ message: `Admin cannot invite another admin.` });
    }

    // TODO: Implement a proper invitation flow (e.g., generate temporary password/token, send email)
    // For now, we'll create the user directly with a placeholder password or require password setup later.
    const temporaryPassword = 'Password123!'; // Placeholder - DO NOT use in production!

    try {
        // Check if email already exists in the org or globally (depending on policy)
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        // Hash the temporary password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(temporaryPassword, salt);

        const profileImage = `${req.protocol}://${req.get('host')}/uploads/profileImg_temp/default_profile.jpg`;

        // Insert the new user
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, password_hash, first_name, last_name, role_id, organization_id, profileImage]
        );

        // Exclude password hash from response
        const newUser = { id: result.insertId, email, first_name, last_name, role_id, organization_id, profileImage };

        // TODO: Trigger email sending logic here

        res.status(201).json({ message: 'User created successfully (invitation pending)', user: newUser });

    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ message: 'Error creating user.' });
    }
});

// DELETE /api/users/:id - Delete a user within the organization (Admin only)
router.delete('/:id', authMiddleware, checkRole([1]), async (req, res) => {
    const { id } = req.params; // ID of user to delete
    const adminUserId = req.user.id;
    const organization_id = req.user.organization_id;

    if (parseInt(id) === adminUserId) {
        return res.status(400).json({ message: 'Admin cannot delete themselves.' });
    }

    try {
        // Ensure the user being deleted belongs to the admin's organization
        const [result] = await db.query(
            'DELETE FROM users WHERE id = ? AND organization_id = ?',
            [id, organization_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found within your organization or could not be deleted.' });
        }

        // TODO: Consider implications - reassign interviews/assignments?

        res.status(204).send(); // No content

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

// GET /api/users/profile - Get user profile the same organization
router.get('/profile', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const organization_id = req.user.organization_id;

    try {
        const [userRows] = await db.query(`SELECT u.id,  u.email, u.first_name, u.last_name, u.role_id, u.status,
            r.name AS role_name, u.profile_image, u.organization_id, o.company_name AS organization_name, u.created_at
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN organizations o ON u.organization_id = o.id
            WHERE u.id = ? AND u.organization_id = ?`,
            [userId, organization_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found or access denied.' });
        }

        res.status(200).json(userRows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// --- Multer Configuration for Updating profile image ---
const imgUploadDir = path.join(__dirname, '../uploads/profileImg_temp');

//Ensure Img directory exist
fs.mkdir(imgUploadDir, {recursive: true}).catch(console.error);

// Configure storage
const imgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgUploadDir);
  },
  filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imgFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'), false)
    }
}

const uploadImg = multer({ storage: imgstorage, fileFilter: imgFileFilter, limits: { fileSize: 200 * 1024 }});

//Middleware for Multer Image File Size
const multerImgUpload = (req, res, next) => {
  uploadImg.single('profile_image')(req, res, function(err) {
    if (err instanceof multer.MulterError){

      if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(413).json({message: 'File too large. Max allowed is 200KB.'})
      }

    }else if (err){
      return res.status(400).json({message: err.message})
    }
    next();
})
}

// PUT /api/users/profile - Update user profile
router.put('/profile', authMiddleware, multerImgUpload, async (req, res) => {
    const userId = req.user.id;
    const {first_name, last_name, email} = req.body;

    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const imgPath = req.file ? `/uploads/profileImg_temp/${req.file.filename}` : null;
    const profileImagePath = imgPath ? `${serverBaseUrl}${imgPath}` : null;
 
  try {
    const fields = [];
    const values = [];

    if (first_name) {
      fields.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name) {
      fields.push('last_name = ?');
      values.push(last_name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (profileImagePath) {
      fields.push('profile_image = ?');
      values.push(profileImagePath);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    values.push(userId);

    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(updateQuery, values);

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// TODO: Add PUT /api/users/:id for updating user details (e.g., name, role - maybe restrict role changes)
// PUT /api/users/:id - Update a user within the organization (Admin only)
router.put('/:id', authMiddleware, checkRole([1]), async (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, first_name, last_name, role_id } = req.body;
    const organization_id = req.user.organization_id;

    if (!email || !first_name || !last_name || !role_id) {
        return res.status(400).json({ message: 'Email, first name, last name, and role ID are required.' });
    }

    if (parseInt(role_id) === 1) {
        return res.status(400).json({ message: 'Cannot assign admin role through this route.' });
    }

    try {
        // Check if the user exists and belongs to the same organization
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE id = ? AND organization_id = ?',
            [userId, organization_id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({ message: 'User not found or access denied.' });
        }

        // Check if the email is taken by another user
        const [emailUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );
        if (emailUsers.length > 0) {
            return res.status(409).json({ message: 'Email is already used by another user.' });
        }

        // Update the user
        await db.query(
            `UPDATE users SET email = ?, first_name = ?, last_name = ?, role_id = ? 
             WHERE id = ? AND organization_id = ?`,
            [email, first_name, last_name, role_id, userId, organization_id]
        );

        res.status(200).json({ message: 'User updated successfully.' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.' });
    }
});

// GET /api/candidates - Search for candidates (Admin only)
router.get('/candidates', authMiddleware, checkRole([1]), async (req, res) => {
    const { search } = req.query;
    const organization_id = req.user.organization_id;

    try {
        let cvQuery = 'SELECT id, personal_info->>"$.email" as email, personal_info->>"$.name" as first_name, \'\' as last_name FROM cvs WHERE organization_id = ?';
        const params = [organization_id];

        if (search) {
            const searchTerm = `%${search}%`;
            cvQuery += ' AND (personal_info->>"$.name" LIKE ? OR personal_info->>"$.email" LIKE ?)';
            params.push(searchTerm, searchTerm);
        }

        const [cvs] = await db.query(cvQuery, params);

        // Combine the results
        const candidates = [...cvs];

        res.json(candidates);
    } catch (error) {
        console.error('Error searching for candidates:', error);
        res.status(500).json({ message: 'Error searching for candidates.' });
    }
});

//function for ensuring  that there is no dulplicate file
function calculateFileHash(filePath){
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fsSync.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  })
}

// POST /api/candidates/upload - Upload candidate info and CV
router.post('/upload', fileUpload(), async (req, res) => {
    const { name, email, phoneNumber, invitationToken } = req.body;
    const cvFile = req.files && req.files.cvFile;

    if (!name || !email || !phoneNumber || !cvFile || !invitationToken) {
        return res.status(400).json({ message: 'Please provide all required information and a CV file.' });
    }

     // ✅ File size limit check (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (cvFile.size > MAX_SIZE) {
        return res.status(413).json({ message: 'File too large. Max allowed is 5MB.' });
    }

    let connection;

    try {
        // 1. Validate the invitation token and retrieve organizationId and jobId
        const [invitationDetails] = await db.query('SELECT id, organization_id, job_id FROM interviews WHERE token = ?', [invitationToken]);
        if (!invitationDetails.length) {
            return res.status(400).json({ message: 'Invalid invitation token.' });
        }

        const interviewId = invitationDetails[0].id;
        const organizationId = invitationDetails[0].organization_id;
        const jobId = invitationDetails[0].job_id;

        // // Get job id from interviews table
        // const [interviewDetailsFromInterviewTable] = await db.query('SELECT job_id FROM interviews WHERE id = ?', [interviewId]);

        // if (!interviewDetailsFromInterviewTable.length) {
        //     return res.status(400).json({ message: 'Invalid interview id.' });
        // }

        // const jobId = interviewDetailsFromInterviewTable[0].job_id;

        // 2. Check if the interview exists
        // const [interviews] = await db.query('SELECT id FROM interviews WHERE id = ?', [interviewId]);
        // if (!interviews.length) {
        //     return res.status(404).json({ message: 'Interview not found.' });
        // }

        // 3. Save the CV file to the uploads directory
        const cvUploadDir = path.join(__dirname, '../uploads/cv_temp');

        // Ensure cv_temp directory exists
        require('fs').mkdirSync(cvUploadDir, { recursive: true });

        const nameWithoutExt = path.parse(cvFile.name).name.replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
        const uniqueSuffix = Date.now();
        const ext = path.extname(cvFile.name);
        const fileName = `${nameWithoutExt}-${uniqueSuffix}${ext}`;

        const filePath = path.join(cvUploadDir, fileName);
        await cvFile.mv(filePath);

           //for checking duplication of file
        const fileHash = await calculateFileHash(filePath);
        const [existing] = await db.query( 'SELECT id FROM cvs WHERE file_hash = ?',
        [fileHash]);

        if(existing.length > 0){
          fs.unlink(filePath, (err) => {
            if(err) console.error('Error deleting duplicate file:', err)
          });

        return res.status(409).json({message: 'Duplicate CV detected. This file has already been uploaded.' })
        }

        // 4. Send the CV file to n8n for processing
        const n8nWebhookUrl = 'https://social.keydevsdemo.com/webhook/0bc2284e-f2c2-427f-b11e-78fa8fad4aea';
        const n8nFormData = new FormData();
        n8nFormData.append('file', cvFile.data, cvFile.name); // Use cvFile.data and cvFile.name

        let n8nResponse;
        try {
            n8nResponse = await axios.post(n8nWebhookUrl, n8nFormData, {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${n8nFormData._boundary}`, // Set correct Content-Type
                },
            });

            if (n8nResponse.status !== 200) {
                throw new Error(`n8n request failed with status ${n8nResponse.status}`);
            }

        } catch (error) {
            console.error('Error sending CV to n8n:', error);
            return res.status(500).json({ message: 'Error processing CV with n8n.' });
        }

         // 5. Extract relevant information from n8n response
         const cvDataArray = n8nResponse.data;

         if (!Array.isArray(cvDataArray)) {
             console.error('Invalid data format: Expected an array.');
             return res.status(400).json({ message: 'Invalid data format: Expected an array.' });
         }

         // Assuming n8n returns an array of CV data, process the first one
         const cvData = cvDataArray[0];

         const personalInfo = cvData.personal_info || {};
         const n8nName = personalInfo.name;
         const n8nEmail = personalInfo.email;
         const n8nPhoneNumber = personalInfo.phoneNumber;

        // 6. Prioritize user-submitted information over n8n-provided information
        const finalName = name;
        const finalEmail = email;
        const finalPhoneNumber = phoneNumber;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 7. Create a new CV record in the database
        const [result] = await connection.query(
            'INSERT INTO cvs (organization_id, job_id, file_path, personal_info, status, file_hash) VALUES (?, ?, ?, ?, ?, ?)',
            [organizationId, jobId, fileName, JSON.stringify({name: finalName, email: finalEmail, phoneNumber: finalPhoneNumber}), 'processed', fileHash]
        );

        const cvId = result.insertId;

        // 9. Insert Employment History into cvs_experience
        if (cvData.employment_history && Array.isArray(cvData.employment_history)) {
            for (const exp of cvData.employment_history) {
                await connection.query(
                    'INSERT INTO cvs_experience (cv_id, position, company, duration, responsibilities, location) VALUES (?, ?, ?, ?, ?, ?)',
                    [cvId, exp.position, exp.company, exp.duration, JSON.stringify(exp.responsibilities || []), exp.location]
                );
            }
        }

        // 10. Insert Education into cvs_education
        if (cvData.education && Array.isArray(cvData.education)) {
            for (const edu of cvData.education) {
                // Map 'degree' from JSON to 'qualification' in DB
                await connection.query(
                    'INSERT INTO cvs_education (cv_id, institution, start_year, end_year, qualification, major, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [cvId, edu.institution, edu.start_year, edu.end_year, edu.degree, edu.major, edu.gpa]
                );
            }
        }

        // 11. Insert Projects into cvs_projects
        if (cvData.projects && Array.isArray(cvData.projects)) {
            for (const proj of cvData.projects) {
                await connection.query(
                    'INSERT INTO cvs_projects (cv_id, name, year, description, technologies, url) VALUES (?, ?, ?, ?, ?, ?)',
                    [cvId, proj.name, proj.year, proj.description, JSON.stringify(proj.technologies || []), proj.url]
                );
            }
        }

        // 12. Insert Volunteering into cvs_volunteer
        if (cvData.volunteering && Array.isArray(cvData.volunteering)) {
            for (const vol of cvData.volunteering) {
                await connection.query(
                    'INSERT INTO cvs_volunteer (cv_id, activity, location, date, description, organization) VALUES (?, ?, ?, ?, ?, ?)',
                    [cvId, vol.activity, vol.location, vol.date, vol.description, vol.organization]
                );
            }
        }

        // 13. Insert Skills into cvs_skills
        if (cvData.skills && Array.isArray(cvData.skills)) {
            for (const skill of cvData.skills) {
                await connection.query(
                    'INSERT INTO cvs_skills (cv_id, skill, level) VALUES (?, ?, ?)',
                    [cvId, skill.skill, skill.level]
                );
            }
        }

        // 14. Insert Achievements into cvs_achievements
        if (cvData.achievements && Array.isArray(cvData.achievements)) {
            for (const ach of cvData.achievements) {
                // Convert year to a full date string or handle as needed by DB schema
                const achievementDate = ach.achievement_date ? `${ach.achievement_date}-01-01` : null;
                await connection.query(
                    'INSERT INTO cvs_achievements (cv_id, achievement, achievement_date) VALUES (?, ?, ?)',
                    [cvId, ach.achievement, achievementDate]
                );
            }
        }

        // 15. Insert Certifications into cvs_certifications
        if (cvData.certifications && Array.isArray(cvData.certifications)) {
            for (const cert of cvData.certifications) {
                await connection.query(
                    'INSERT INTO cvs_certifications (cv_id, certification_name, issuing_organization, issue_date, expiration_date) VALUES (?, ?, ?, ?, ?)',
                    [cvId, cert.certification_name, cert.issuing_organization, cert.issue_date, cert.expiration_date]
                );
            }
        }

        // 16. Insert Publications into cvs_publications
        if (cvData.publications && Array.isArray(cvData.publications)) {
            for (const pub of cvData.publications) {
                await connection.query(
                    'INSERT INTO cvs_publications (cv_id, title, journal, publication_date, url) VALUES (?, ?, ?, ?, ?)',
                    [cvId, pub.title, pub.journal, pub.publication_date, pub.url]
                );
            }
        }

        // 17. Insert References into cvs_references
        if (cvData.references && Array.isArray(cvData.references)) {
            for (const ref of cvData.references) {
                await connection.query(
                    'INSERT INTO cvs_references (cv_id, name, position, contact_info) VALUES (?, ?, ?, ?)',
                    [cvId, ref.name, ref.position, ref.contact_info]
                );
            }
        }

        // 18. Insert Extra Info (Languages, Tools, Methodologies) into cvs_extra
        const programmingLanguages = cvData.programming_languages || {};
        const foreignLanguages = cvData.foreign_languages || [];
        await connection.query(
            'INSERT INTO cvs_extra (cv_id, programming_languages, foreign_languages) VALUES (?, ?, ?)',
            [cvId, JSON.stringify(programmingLanguages), JSON.stringify(foreignLanguages)]
        );

        // 8. Insert data into the invitation table
        await connection.query(
            'INSERT INTO invitations (interview_id, cvs_id, organization_id, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
            [interviewId, cvId, organizationId, finalEmail, finalName.split(' ')[0], finalName.split(' ')[1] || '']
        );

        await connection.commit();

        res.status(201).json({ message: 'Candidate information and CV uploaded successfully.', cvId: cvId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error uploading candidate information and CV:', error);
        res.status(500).json({ message: 'Error uploading candidate information and CV.' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
 