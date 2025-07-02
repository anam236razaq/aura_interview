const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register - Register a new user (likely an Admin for an Organization initially)
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name, company_name /* other org details */ } = req.body;

    if (!email || !password || !company_name) {
        return res.status(400).json({ message: 'Email, password, and company name are required.' });
    }

    // Validation for email format, password strength
        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Enter a valid email'})
        }

        if(password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)){
            return res.status(400).json({message: 'Password must be at least 8 characters long and include an uppercase letter and a number.'})
        }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check if email already exists
        const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'Email already in use.' });
        }

        // Create the organization first (basic example)
        // In a real app, you might have more org details and checks
        const [orgResult] = await connection.query('INSERT INTO organizations (company_name) VALUES (?)', [company_name]);
        const organization_id = orgResult.insertId;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);


        // TODO: Determine the correct role_id (e.g., find or create an 'Admin' role)
        const role_id = 1; // Placeholder for Admin role
        const profileImage = `${req.protocol}://${req.get('host')}/uploads/profileImg_temp/default_profile.jpg`;

        // Insert the new user
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, password_hash, first_name, last_name, role_id, organization_id, profileImage]
        );
        const userId = userResult.insertId;
        await connection.commit();

        // Generate JWT
        const payload = { user: { id: userId, role_id: role_id, organization_id: organization_id, profileImage} };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        res.status(201).json({ token, userId, email, organization_id });

    } catch (error) {
        await connection.rollback();
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    } finally {
        connection.release();
    }
});

// POST /api/auth/login - Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const [users] = await db.query('SELECT id, password_hash, role_id, organization_id, status FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
        }
        const user = users[0];
        
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Wrong password
        }

        // Generate JWT
        const payload = { user: { id: user.id, role_id: user.role_id, organization_id: user.organization_id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        res.json({ token, userId: user.id, email: email, organization_id: user.organization_id,  role_id: user.role_id,});

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Logging out the user
const blacklistedTokens = new Set();

router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Optionally blacklist the token here (e.g., add to Redis or memory)
    blacklistedTokens.add(token);

    // Send success response
    res.status(200).json({ message: 'Logged out successfully' });
}); 

// PUT /api/auth/change-password - Change user password
router.put('/change-password', authMiddleware, async(req, res) => {
    const userId = req.user.id;
    const {old_password, new_password, confirm_password} = req.body;

    if(!old_password || !new_password || !confirm_password){
        return res.status(400).json({ message: 'All password fields are required.' });
    }

    if(new_password !== confirm_password){
        return res.status(400).json({ message: 'New password and confirmation do not match.' });
    }

    try{
         // Fetch user's current password hash
        const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(old_password, rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect.' });
        }

         // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(new_password, salt);

        // Update password
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHashedPassword, userId]);

        res.status(200).json({ message: 'Password updated successfully.' });
    }catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
})


module.exports = router;
