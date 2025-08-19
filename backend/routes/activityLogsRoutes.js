const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// GET /activity-logs
router.get('/', authMiddleware, checkRole([4]), async (req, res) => {
    const { page = 1, limit = 10, search, start_date, end_date } = req.query;

    let query = `
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    WHERE 1=1
    `;
    let params = [];

    // Search filter
    if (search) {
    query += ` AND (
        al.action LIKE ? OR
        al.description LIKE ? OR
        u.first_name LIKE ? OR
        u.last_name LIKE ?
    )`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Date range filter
    if (start_date) {
        query += ` AND al.created_at >= ?`;
        params.push(start_date);
    }

    if (end_date) {
        query += ` AND al.created_at <= ?`;
        params.push(end_date);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
        // Get total count
        const [countResult] = await db.query(`SELECT COUNT(*) as total ${query}`, params);
        const total = countResult[0].total;

    const [logs] = await db.query(
        `SELECT al.*, u.first_name, u.last_name ${query}
        ORDER BY al.created_at DESC
        LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
    );

    res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        logs
    });

  } catch (err) {
    console.error('Get activity logs error:', err);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

// DELETE /activity-logs/:id
router.delete('/:id', authMiddleware, checkRole([4]), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM activity_logs WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.json({ message: 'Activity log deleted successfully' });
  } catch (err) {
    console.error('Delete activity log error:', err);
    res.status(500).json({ message: 'Error deleting activity log' });
  }
});


module.exports = router;