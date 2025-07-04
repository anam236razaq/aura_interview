const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

//GET /api/dashboard/stats Getting dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
    const organization_id  = req.user.organization_id;

    try{
        // 1. Interviews
        const [intervRows] = await db.query(
        'SELECT COUNT(*) AS total_interviews FROM interviews WHERE organization_id = ?',
        [organization_id]);
        const total_interviews = intervRows[0].total_interviews;

        const [draftRows] = await db.query(
        'SELECT COUNT(*) AS draft_interviews FROM interviews WHERE status="draft" AND organization_id = ?',
        [organization_id]);
        const draft_interviews = draftRows[0].draft_interviews;

        const [activeRows] = await db.query(
        'SELECT COUNT(*) AS active_interviews FROM interviews WHERE status="active" AND organization_id = ?',
        [organization_id]);
        const active_interviews = activeRows[0].active_interviews;

        const [completedRows] = await db.query(
        'SELECT COUNT(*) AS completed_interviews FROM interviews WHERE status="completed" AND organization_id = ?',
        [organization_id]);
        const completed_interviews = completedRows[0].completed_interviews;

        const [expiredRows] = await db.query(
        'SELECT COUNT(*) AS expired_interviews FROM interviews WHERE expiry_date < NOW() AND organization_id = ?',
        [organization_id]);
        const expired_interviews = expiredRows[0].expired_interviews;

        const [upcomingRows] = await db.query(
        'SELECT COUNT(*) AS upcoming_interviews FROM interviews WHERE expiry_date > NOW() AND organization_id = ?',
        [organization_id]);
        const upcoming_interviews = upcomingRows[0].upcoming_interviews;

        // 2. Candidates (CVs)
        const [candRows] = await db.query(
        'SELECT COUNT(*) AS total_candidates FROM cvs WHERE organization_id = ?',
        [organization_id]);
        const total_candidates = candRows[0].total_candidates;

        const [shortRows] = await db.query(
        'SELECT COUNT(*) AS shortlisted_candidates FROM cvs_shortlist WHERE shortlisted="yes" AND organization_id = ?',
        [organization_id]);
        const shortlisted_candidates = shortRows[0].shortlisted_candidates;

        // 3. Questions & Responses
        const [qRows] = await db.query(`SELECT COUNT(*) AS total_questions FROM questions
        WHERE interview_id IN (SELECT id FROM interviews WHERE organization_id = ?)`,
        [organization_id]);
        const total_questions = qRows[0].total_questions;

        const [rRows] = await db.query(`SELECT COUNT(*) AS total_responses FROM responses
        WHERE interview_id IN (SELECT id FROM interviews WHERE organization_id = ?)`,
        [organization_id]);
        const total_responses = rRows[0].total_responses;

        // 4. Users
        const [userRows] = await db.query(
        'SELECT COUNT(*) AS total_users FROM users WHERE organization_id = ?',
        [organization_id]);
        const total_users = userRows[0].total_users;

        const [actUserRows] = await db.query(
        'SELECT COUNT(*) AS active_users FROM users WHERE status="active" AND organization_id = ?',
        [organization_id]);
        const active_users = actUserRows[0].active_users;

        const response = {total_interviews, draft_interviews, active_interviews, completed_interviews,
        expired_interviews, upcoming_interviews, total_candidates, shortlisted_candidates, total_questions,
        total_responses, total_users, active_users}

        res.status(200).json(response);
    }catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
})

//GET /api/dashboard/stats/last-30-days getting interviews per day of last 30 days
router.get('/stats/last-30-days', async (req, res) => {
  const organization_id = req.user.organization_id;

  const query = `
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM interviews
    WHERE organization_id = ? AND DATE(created_at) >= NOW() - INTERVAL 30 DAY
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  try {
    const [results] = await db.query(query, [organization_id]);

    // Fill in missing dates (optional)
    const today = new Date();
    const stats = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const found = results.find(r => {
        const resultDate = new Date(r.date).toISOString().split('T')[0];
        return resultDate === dateStr}
      );
      stats.push({
        date: dateStr,
        count: found ? found.count : 0,
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

//GET /api/dashboard/latest-entries  getting latest interviews, candidates, users and questions
router.get('/latest-entries', authMiddleware, async(req, res) => {
    const organization_id  = req.user.organization_id;

    try{
        const latestInterviews = await db.query(`SELECT * FROM interviews WHERE organization_id = ?
        ORDER BY created_at DESC LIMIT 5`, [organization_id]).then(r => r[0]);

        const latestCandidates = await db.query(`SELECT id, status, created_at, file_path,   
        JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.name')) AS name,
        JSON_UNQUOTE(JSON_EXTRACT(personal_info, '$.email')) AS email FROM cvs WHERE organization_id = ?
        ORDER BY created_at DESC LIMIT 5`, [organization_id]).then(r => r[0]);

        const latestUsers = await db.query(`SELECT u.id, u.first_name, u.last_name, u.profile_image,
        u.created_at, u.status, r.name AS role_name FROM users u JOIN roles r 
        ON u.role_id = r.id WHERE u.organization_id = ?
        ORDER BY u.created_at DESC LIMIT 5`, 
        [organization_id]).then(r => r[0]);

        const latestQuestions = await db.query(`SELECT q.* FROM questions q
        JOIN interviews i ON q.interview_id = i.id
        WHERE i.organization_id = ?
        ORDER BY q.created_at DESC LIMIT 5`,
        [organization_id]).then(r => r[0]);

        res.json({latestInterviews, latestCandidates, latestUsers, latestQuestions});
    }catch (err) {
    console.error('Error fetching latest entries:', err);
    res.status(500).json({ error: 'Failed to fetch latest entries' });
  }
})

module.exports = router;

