const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/roles - List all roles
router.get('/', authMiddleware,  async (req, res) => {
    try {
        const roleId = req.user.role_id;

         // Fetch role name from DB
        const [roleResult] = await db.query('SELECT name FROM roles WHERE id = ?', [roleId]);
        if (!roleResult.length) {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        const userRole = roleResult[0].name;
        let query = '';
        let values =[];

        if(userRole === 'superadmin'){
            query = 'SELECT * FROM roles WHERE name  = ?';
            values = ['admin'];
        }else if (['admin', 'hr', 'manager'].includes(userRole)){
             query = 'SELECT * FROM roles WHERE name IN (?, ?)';
            values = ['hr', 'manager'];
        }

        const [roles] = await db.query(query, values);
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Error fetching roles.' });
    }
});

module.exports = router;