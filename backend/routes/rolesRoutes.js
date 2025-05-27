const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/roles - List all roles
router.get('/', async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM roles',);
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Error fetching roles.' });
    }
});

module.exports = router;