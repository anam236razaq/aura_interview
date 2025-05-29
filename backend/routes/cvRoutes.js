const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import the database connection pool
const checkRole = require('../middleware/roleMiddleware'); // Import role checker
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Use promise-based fs
const axios = require('axios');
const FormData = require('form-data'); // To send multipart/form-data

const ADMIN_ROLE = 1;
const USER_ROLE = 2;

// --- Multer Configuration for CV Uploads ---
const cvUploadDir = path.join(__dirname, '../uploads/cv_temp'); // Use a temporary sub-directory

// Ensure cv_temp directory exists
fs.mkdir(cvUploadDir, { recursive: true }).catch(console.error);

const cvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, cvUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const cvFileFilter = (req, file, cb) => {
  // Accept only PDF and DOCX
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const uploadCv = multer({ storage: cvStorage, fileFilter: cvFileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB limit

// POST /api/cv/upload - Upload CV, send to N8N (Admin only)
router.post('/upload', checkRole([ADMIN_ROLE]), uploadCv.single('cvFile'), async (req, res) => {
    const organization_id = req.user.organization_id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'CV file (cvFile) is required.' });
    } 

    const n8nWebhookUrl = 'https://social.keydevsdemo.com/webhook/0bc2284e-f2c2-427f-b11e-78fa8fad4aea';
    const formData = new FormData();
    let fileStream;

    try {
        // Create a readable stream for the uploaded file
        fileStream = require('fs').createReadStream(file.path);
        formData.append('file', fileStream, file.originalname); // N8N expects the field name 'file' for binary data

        console.log(`Sending CV to N8N: ${file.originalname}, org ${organization_id}`);
        console.log(`N8N URL: ${n8nWebhookUrl}`);

        // Send the file to N8N and wait for the response
        const n8nResponse = await axios.post(n8nWebhookUrl, formData, {
            headers: {
                ...formData.getHeaders(), // Set correct Content-Type for multipart/form-data
                // Add any required N8N authentication headers here if needed
            },
        });

        console.log('N8N response status:', n8nResponse.status);
        console.log('N8N response data:', JSON.stringify(n8nResponse.data));

        const cvDataArray = n8nResponse.data;

        if (!Array.isArray(cvDataArray)) {
            console.error('Invalid data format: Expected an array.');
            return res.status(400).json({ message: 'Invalid data format: Expected an array.' });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            for (const cvData of cvDataArray) {
                // 1. Insert into cvs table
                const personalInfo = cvData.personal_info || {};
                const cvInsertResult = await connection.query(
                    'INSERT INTO cvs (organization_id, file_path, personal_info, score) VALUES (?, ?, ?, ?)',
                    [parseInt(organization_id), file.originalname, JSON.stringify(personalInfo), null] // Score is initially null
                );
                const cvId = cvInsertResult[0].insertId;

                // 2. Insert Employment History into cvs_experience
                if (cvData.employment_history && Array.isArray(cvData.employment_history)) {
                    for (const exp of cvData.employment_history) {
                        await connection.query(
                            'INSERT INTO cvs_experience (cv_id, position, company, duration, responsibilities, location) VALUES (?, ?, ?, ?, ?, ?)',
                            [cvId, exp.position, exp.company, exp.duration, JSON.stringify(exp.responsibilities || []), exp.location]
                        );
                    }
                }

                // 3. Insert Education into cvs_education
                if (cvData.education && Array.isArray(cvData.education)) {
                    for (const edu of cvData.education) {
                        // Map 'degree' from JSON to 'qualification' in DB
                        await connection.query(
                            'INSERT INTO cvs_education (cv_id, institution, start_year, end_year, qualification, major, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [cvId, edu.institution, edu.start_year, edu.end_year, edu.degree, edu.major, edu.gpa]
                        );
                    }
                }

                // 4. Insert Projects into cvs_projects
                if (cvData.projects && Array.isArray(cvData.projects)) {
                    for (const proj of cvData.projects) {
                        await connection.query(
                            'INSERT INTO cvs_projects (cv_id, name, year, description, technologies, url) VALUES (?, ?, ?, ?, ?, ?)',
                            [cvId, proj.name, proj.year, proj.description, JSON.stringify(proj.technologies || []), proj.url]
                        );
                    }
                }

                // 5. Insert Volunteering into cvs_volunteer
                if (cvData.volunteering && Array.isArray(cvData.volunteering)) {
                    for (const vol of cvData.volunteering) {
                        await connection.query(
                            'INSERT INTO cvs_volunteer (cv_id, activity, location, date, description, organization) VALUES (?, ?, ?, ?, ?, ?)',
                            [cvId, vol.activity, vol.location, vol.date, vol.description, vol.organization]
                        );
                    }
                }

                // 6. Insert Skills into cvs_skills
                if (cvData.skills && Array.isArray(cvData.skills)) {
                    for (const skill of cvData.skills) {
                        await connection.query(
                            'INSERT INTO cvs_skills (cv_id, skill, level) VALUES (?, ?, ?)',
                            [cvId, skill.skill, skill.level]
                        );
                    }
                }

                // 7. Insert Achievements into cvs_achievements
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

                // 8. Insert Certifications into cvs_certifications
                if (cvData.certifications && Array.isArray(cvData.certifications)) {
                    for (const cert of cvData.certifications) {
                        await connection.query(
                            'INSERT INTO cvs_certifications (cv_id, certification_name, issuing_organization, issue_date, expiration_date) VALUES (?, ?, ?, ?, ?)',
                            [cvId, cert.certification_name, cert.issuing_organization, cert.issue_date, cert.expiration_date]
                        );
                    }
                }

                // 9. Insert Publications into cvs_publications
                if (cvData.publications && Array.isArray(cvData.publications)) {
                    for (const pub of cvData.publications) {
                        await connection.query(
                            'INSERT INTO cvs_publications (cv_id, title, journal, publication_date, url) VALUES (?, ?, ?, ?, ?)',
                            [cvId, pub.title, pub.journal, pub.publication_date, pub.url]
                        );
                    }
                }

                // 10. Insert References into cvs_references
                if (cvData.references && Array.isArray(cvData.references)) {
                    for (const ref of cvData.references) {
                        await connection.query(
                            'INSERT INTO cvs_references (cv_id, name, position, contact_info) VALUES (?, ?, ?, ?)',
                            [cvId, ref.name, ref.position, ref.contact_info]
                        );
                    }
                }

                // 11. Insert Extra Info (Languages, Tools, Methodologies) into cvs_extra
                const programmingLanguages = cvData.programming_languages || {};
                const foreignLanguages = cvData.foreign_languages || [];
                await connection.query(
                    'INSERT INTO cvs_extra (cv_id, programming_languages, foreign_languages) VALUES (?, ?, ?)',
                    [cvId, JSON.stringify(programmingLanguages), JSON.stringify(foreignLanguages)]
                );
            }

            await connection.commit(); // Commit transaction
            console.log('Successfully processed and stored CV data for org:', organization_id);
            res.status(200).json({ message: 'CV data processed successfully' });

        } catch (error) {
            await connection.rollback(); // Rollback transaction on error
            console.error('Error processing webhook data:', error);
            res.status(500).json({ message: 'Error processing CV data', error: error.message });
        } finally {
            connection.release(); // Release connection back to the pool
        }

    } catch (error) {
        console.error('Error sending CV to N8N:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error sending CV for processing.', error: error.message });
    } finally {
        // Ensure the file stream is closed if it was opened
        if (fileStream && !fileStream.closed) {
            fileStream.close();
        }
        // Clean up the temporary file regardless of success or failure
        await fs.unlink(file.path).catch(err => console.error(`Error deleting temp CV file ${file.path}:`, err));
    }
});

// POST /api/cv/webhook - Receives processed CV data from N8N
router.post('/webhook', async (req, res) => {
  console.log('Received webhook data:', JSON.stringify(req.body, null, 2));
  const cvDataArray = req.body;
  const { organization_id, file_path } = req.query; // Example: Get IDs from query params

  // Basic validation: Check if it's an array
  if (!Array.isArray(cvDataArray)) {
    console.error('Invalid data format: Expected an array.');
    return res.status(400).json({ message: 'Invalid data format: Expected an array.' });
  }

  if (!organization_id || !file_path) {
    return res.status(400).json({ message: 'organization_id, and file_path are required (e.g., in query params) for webhook processing.' });
  }

  const connection = await db.getConnection(); // Get connection from pool

  try {
    await connection.beginTransaction(); // Start transaction

    for (const cvData of cvDataArray) {
      // 1. Insert into cvs table
      const personalInfo = cvData.personal_info || {};
      const cvInsertResult = await connection.query(
        'INSERT INTO cvs (organization_id, file_path, personal_info, score) VALUES (?, ?, ?, ?, ?)',
        [parseInt(organization_id), file_path, JSON.stringify(personalInfo), null] // Score is initially null
      );
      const cvId = cvInsertResult[0].insertId;

      // 2. Insert Employment History into cvs_experience
      if (cvData.employment_history && Array.isArray(cvData.employment_history)) {
        for (const exp of cvData.employment_history) {
          await connection.query(
            'INSERT INTO cvs_experience (cv_id, position, company, duration, responsibilities, location) VALUES (?, ?, ?, ?, ?, ?)',
            [cvId, exp.position, exp.company, exp.duration, JSON.stringify(exp.responsibilities || []), exp.location]
          );
        }
      }

      // 3. Insert Education into cvs_education
      if (cvData.education && Array.isArray(cvData.education)) {
        for (const edu of cvData.education) {
          // Map 'degree' from JSON to 'qualification' in DB
          await connection.query(
            'INSERT INTO cvs_education (cv_id, institution, start_year, end_year, qualification, major, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [cvId, edu.institution, edu.start_year, edu.end_year, edu.degree, edu.major, edu.gpa]
          );
        }
      }

      // 4. Insert Projects into cvs_projects
      if (cvData.projects && Array.isArray(cvData.projects)) {
        for (const proj of cvData.projects) {
          await connection.query(
            'INSERT INTO cvs_projects (cv_id, name, year, description, technologies, url) VALUES (?, ?, ?, ?, ?, ?)',
            [cvId, proj.name, proj.year, proj.description, JSON.stringify(proj.technologies || []), proj.url]
          );
        }
      }

      // 5. Insert Volunteering into cvs_volunteer
      if (cvData.volunteering && Array.isArray(cvData.volunteering)) {
        for (const vol of cvData.volunteering) {
          await connection.query(
            'INSERT INTO cvs_volunteer (cv_id, activity, location, date, description, organization) VALUES (?, ?, ?, ?, ?, ?)',
            [cvId, vol.activity, vol.location, vol.date, vol.description, vol.organization]
          );
        }
      }

      // 6. Insert Skills into cvs_skills
      if (cvData.skills && Array.isArray(cvData.skills)) {
        for (const skill of cvData.skills) {
          await connection.query(
            'INSERT INTO cvs_skills (cv_id, skill, level) VALUES (?, ?, ?)',
            [cvId, skill.skill, skill.level]
          );
        }
      }

      // 7. Insert Achievements into cvs_achievements
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

      // 8. Insert Certifications into cvs_certifications
      if (cvData.certifications && Array.isArray(cvData.certifications)) {
        for (const cert of cvData.certifications) {
          await connection.query(
            'INSERT INTO cvs_certifications (cv_id, certification_name, issuing_organization, issue_date, expiration_date) VALUES (?, ?, ?, ?, ?)',
            [cvId, cert.certification_name, cert.issuing_organization, cert.issue_date, cert.expiration_date]
          );
        }
      }

      // 9. Insert Publications into cvs_publications
      if (cvData.publications && Array.isArray(cvData.publications)) {
        for (const pub of cvData.publications) {
          await connection.query(
            'INSERT INTO cvs_publications (cv_id, title, journal, publication_date, url) VALUES (?, ?, ?, ?, ?)',
            [cvId, pub.title, pub.journal, pub.publication_date, pub.url]
          );
        }
      }

      // 10. Insert References into cvs_references
      if (cvData.references && Array.isArray(cvData.references)) {
        for (const ref of cvData.references) {
          await connection.query(
            'INSERT INTO cvs_references (cv_id, name, position, contact_info) VALUES (?, ?, ?, ?)',
            [cvId, ref.name, ref.position, ref.contact_info]
          );
        }
      }

      // 11. Insert Extra Info (Languages, Tools, Methodologies) into cvs_extra
      const programmingLanguages = cvData.programming_languages || {};
      const foreignLanguages = cvData.foreign_languages || [];
      await connection.query(
        'INSERT INTO cvs_extra (cv_id, programming_languages, foreign_languages) VALUES (?, ?, ?)',
        [cvId, JSON.stringify(programmingLanguages), JSON.stringify(foreignLanguages)]
      );

    }

    await connection.commit(); // Commit transaction
    console.log('Successfully processed and stored CV data for org:', organization_id);
    res.status(200).json({ message: 'CV data processed successfully' });

  } catch (error) {
    await connection.rollback(); // Rollback transaction on error
    console.error('Error processing webhook data:', error);
    res.status(500).json({ message: 'Error processing CV data', error: error.message });
  } finally {
    connection.release(); // Release connection back to the pool
  }
});

// GET /api/cv - List CVs for the logged-in user's organization
router.get('/', async (req, res) => {
    const organization_id = req.user.organization_id; // Get org ID from authenticated user

    try {
        let query = 'SELECT id, organization_id, file_path, JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.name")) AS name, JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.email")) AS email,  score, created_at FROM cvs WHERE organization_id = ?';
        const params = [organization_id];

        query += ' ORDER BY created_at DESC';

        const [cvs] = await db.query(query, params);
        res.json(cvs);

    } catch (error) {
        console.error('Error fetching CVs:', error);
        res.status(500).json({ message: 'Error fetching CVs' });
    }
});

// GET /api/cv/search
router.get('/search', async (req, res) => {
    const organization_id = req.user.organization_id;
    const search = req.query.search?.trim().toLowerCase();

    if (!search) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const query = `
            SELECT id, organization_id, file_path, 
                  JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.name")) AS name, 
                  JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.email")) AS email,  
                  score, created_at 
            FROM cvs 
            WHERE organization_id = ?
              AND (
                  LOWER(JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.name"))) LIKE ?
                  OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(personal_info, "$.email"))) LIKE ?
              )
            ORDER BY created_at DESC
        `;

        const searchPattern = `%${search}%`;
        const params = [organization_id, searchPattern, searchPattern];

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (error) {
        console.error('Error searching CVs:', error);
        res.status(500).json({ message: 'Error searching CVs' });
    }
});

// GET /api/cv/:id - Get full details for a specific CV (ensure it belongs to user's org)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const organization_id = req.user.organization_id; // Get org ID from authenticated user

    const connection = await db.getConnection();

    try {
        // Fetch main CV data, ensuring it matches the user's organization
        const [cvs] = await connection.query('SELECT * FROM cvs WHERE id = ? AND organization_id = ?', [id, organization_id]);
        if (cvs.length === 0) {
            return res.status(404).json({ message: 'CV not found or access denied' });
        }
        const cvData = cvs[0];

        // Fetch data from related tables in parallel
        const [experience, education, projects, volunteering, skills, achievements, certifications, publications, references, extra, notes] = await Promise.all([
            connection.query('SELECT * FROM cvs_experience WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_education WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_projects WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_volunteer WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_skills WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_achievements WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_certifications WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_publications WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_references WHERE cv_id = ?', [id]),
            connection.query('SELECT * FROM cvs_extra WHERE cv_id = ?', [id]),
            connection.query('SELECT n.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name FROM cvs_internal_notes n JOIN users u ON n.user_id = u.id WHERE n.cv_id = ? ORDER BY n.created_at DESC', [id]) // Include user info for notes
        ]);

        // Combine into a single response object
        const fullCvDetails = {
            ...cvData,
            employment_history: experience[0],
            education: education[0],
            projects: projects[0],
            volunteering: volunteering[0],
            skills: skills[0],
            achievements: achievements[0],
            certifications: certifications[0],
            publications: publications[0],
            references: references[0],
            extra_info: extra[0].length > 0 ? extra[0][0] : {}, // cvs_extra likely has only one row per cv_id
            internal_notes: notes[0]
        };

        res.json(fullCvDetails);

    } catch (error) {
        console.error(`Error fetching CV details for ID ${id}:`, error);
        res.status(500).json({ message: 'Error fetching CV details' });
    } finally {
        connection.release();
    }
});

// POST /api/cv/:id/notes - Add an internal note to a CV (ensure CV belongs to user's org)
router.post('/:id/notes', async (req, res) => {
    const { id } = req.params; // cv_id
    const { note, parent_note_id } = req.body;
    const user_id = req.user.id; // Get user ID from authenticated user
    const organization_id = req.user.organization_id; // Get org ID

    if (!note) {
        return res.status(400).json({ message: 'Note content is required.' });
    }

    try {
        // Verify CV exists AND belongs to the user's organization
        const [cvs] = await db.query('SELECT id FROM cvs WHERE id = ? AND organization_id = ?', [id, organization_id]);
        if (cvs.length === 0) {
            return res.status(404).json({ message: 'CV not found or access denied.' });
        }

        const [result] = await db.query(
            'INSERT INTO cvs_internal_notes (cv_id, user_id, note, parent_note_id) VALUES (?, ?, ?, ?)',
            [id, user_id, note, parent_note_id || null]
        );

        // Fetch the newly created note with user info
        const [newNote] = await db.query(
            'SELECT n.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name FROM cvs_internal_notes n JOIN users u ON n.user_id = u.id WHERE n.id = ?',
             [result.insertId]
            );

        res.status(201).json(newNote[0]);

    } catch (error) {
        console.error(`Error adding note to CV ${id}:`, error);
        res.status(500).json({ message: 'Error adding internal note' });
    }
});

// DELETE /api/cv/:id endpoint (likely Admin only)
router.delete('/:id', async(req, res) => {
  const {id} = req.params;
  const organization_id = req.user.organization_id;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try{
    //Ensure Cv exists and belongs to organization
    const [cvs] = await connection.query('SELECT * FROM cvs WHERE id = ? AND organization_id = ?', [id, organization_id]);
    
    if(cvs.length === 0){
      await connection.rollback();
      return res.status(404).json({message: 'CV not found or access denied'});
    }

    // Delete from all related tables first (child tables)
    const relatedTables = ['cvs_experience', 'cvs_education', 'cvs_projects',
      'cvs_volunteer', 'cvs_skills', 'cvs_achievements', 'cvs_certifications',
      'cvs_publications', 'cvs_references', 'cvs_extra', 'cvs_internal_notes']

      for(const table of relatedTables){
        await connection.query(`DELETE FROM ${table} WHERE cv_id =?`, [id]);
      }

    // Delete the main CV record
    await  connection.query('DELETE FROM cvs WHERE id = ? AND organization_id = ?', [id, organization_id]);

    await connection.commit();
    res.json({ message: 'CV and related data deleted successfully' });

  }catch(error){
    await connection.rollback();
    res.status(500).json({ message: 'Error deleting CV' });

  }finally{
    connection.release();
  }
})


module.exports = router;
