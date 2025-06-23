const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const bcrypt = require('bcryptjs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs').promises; 

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

const uploadImg = multer({ storage: imgstorage, fileFilter: imgFileFilter, limits: { fileSize: 50 * 1024 * 1024 }});

// PUT /api/users/profile - Update user profile
router.put('/profile', authMiddleware, uploadImg.single('profile_image'), async (req, res) => {
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

module.exports = router;
 