const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// GET /api/candidates - Get all candidates or search candidates by name
router.get('/', authMiddleware, async (req, res) => {
    const { search } = req.query;
    const organization_id = req.user.organization_id;

    try {
        let cvQuery = `SELECT id,  JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.email')) AS email, 
            JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.name')) AS first_name, 
            '' AS last_name  FROM cvs WHERE organization_id = ?`;

        const params = [organization_id];

        if (search) {
            const searchTerm = `%${search}%`;
            cvQuery += ` AND (JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.name')) LIKE ? 
                    OR JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.email')) LIKE ?
                )`;
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

module.exports = router;