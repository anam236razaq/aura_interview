const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/inquiries
router.post('/',  async (req, res) => {
    const { user_id, organization_id, name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const query = `INSERT INTO inquiries (user_id, organization_id, name, email, message) VALUES (?, ?, ?, ?, ?)`;

    try {const [result] = await db.execute(query, [user_id || null, organization_id || null,
        name, email, message]);

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiryId: result.insertId });
  } catch (error) {
    console.error('Error inserting inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router