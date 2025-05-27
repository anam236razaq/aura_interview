const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const bcrypt = require('bcryptjs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const FormData = require('form-data');

const USER_ROLE = 2; // Assuming User role ID is 2

// GET /api/users - List users within the admin's organization (Admin only)
router.get('/', authMiddleware, checkRole([1]), async (req, res) => {
    const organization_id = req.user.organization_id;
    try {
        const [users] = await db.query(
            `SELECT 
                users.id, 
                users.email, 
                users.first_name, 
                users.last_name, 
                users.role_id, 
                roles.name AS role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.organization_id = ?`,
            [organization_id]
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users.' });
    }
});


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

        // Insert the new user
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password_hash, first_name, last_name, role_id, organization_id]
        );

        // Exclude password hash from response
        const newUser = { id: result.insertId, email, first_name, last_name, role_id, organization_id };

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

// POST /api/candidates/upload - Upload candidate info and CV
router.post('/upload', fileUpload(), async (req, res) => {
    const { fullName, email, phoneNumber, invitationToken } = req.body;
    const cvFile = req.files && req.files.cvFile;

    if (!fullName || !email || !phoneNumber || !cvFile || !invitationToken) {
        return res.status(400).json({ message: 'Please provide all required information and a CV file.' });
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
        const fileName = `${Date.now()}-${cvFile.name}`;
        const filePath = path.join(__dirname, '../uploads/cv_temp', fileName);

        await cvFile.mv(filePath);

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
        const finalName = fullName;
        const finalEmail = email;
        const finalPhoneNumber = phoneNumber;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 7. Create a new CV record in the database
        const [result] = await connection.query(
            'INSERT INTO cvs (organization_id, job_id, file_path, personal_info) VALUES (?, ?, ?, ?)',
            [organizationId, jobId, fileName, JSON.stringify({fullName: finalName, email: finalEmail, phoneNumber: finalPhoneNumber})]
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

// TODO: Add PUT /api/users/:id for updating user details (e.g., name, role - maybe restrict role changes)

module.exports = router;
 