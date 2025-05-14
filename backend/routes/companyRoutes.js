const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/companies - List all companies for the organization (All authenticated users)
router.get('/', async (req, res) => {
    const organization_id = req.user.organization_id;
    try {
        const [companies] = await db.query('SELECT * FROM companies WHERE organization_id = ? ORDER BY created_at DESC', [organization_id]);
        res.json(companies);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching company list.' });
    }
});

module.exports = router;
