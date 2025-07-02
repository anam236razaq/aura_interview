const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', async (req, res) => {
  try {
    // 1. Interviews this month
    const interviewsThisMonth = await db.query(`
      SELECT COUNT(*) FROM interviews
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `);


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router