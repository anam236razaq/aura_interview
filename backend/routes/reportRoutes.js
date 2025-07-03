const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const organization_id = req.user.organization_id;

  try {
    // Fetch all related stats first
    const [conducted] = await db.query(`
      SELECT interview_id, COUNT(DISTINCT cv_id) AS responded_count
      FROM responses
      GROUP BY interview_id
    `);

    const [shortlistedCounts] = await db.query(`
      SELECT interview_id, COUNT(DISTINCT cv_id) AS shortlisted_count
      FROM interview_shortlisted
      WHERE shortlisted = 1
      GROUP BY interview_id
    `);

    const [privateResponses] = await db.query(`
      SELECT r.interview_id, COUNT(DISTINCT r.cv_id) AS private_responses
      FROM responses r
      JOIN invitations i ON r.interview_id = i.interview_id AND r.cv_id = i.cvs_id
      WHERE i.token IS NOT NULL
      GROUP BY r.interview_id
    `);

    const [publicResponses] = await db.query(`
      SELECT r.interview_id, COUNT(DISTINCT r.cv_id) AS public_responses
      FROM responses r
      JOIN invitations i ON r.interview_id = i.interview_id AND r.cv_id = i.cvs_id
      WHERE i.token IS NULL
      GROUP BY r.interview_id
    `);

    // Count matching interviews for the organization
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM interviews WHERE organization_id = ? AND LOWER(title) LIKE ?`,
      [organization_id, `%${search.toLowerCase()}%`]
    );
    const total = countResult[0].total;

    // Get paginated interviews for the organization
    const [interviews] = await db.query(`
      SELECT i.id AS interview_id, i.title, COUNT(inv.id) AS links_sent
      FROM interviews i
      LEFT JOIN invitations inv ON inv.interview_id = i.id AND inv.token IS NOT NULL
      WHERE i.organization_id = ? AND LOWER(i.title) LIKE ?
      GROUP BY i.id, i.title
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `, [organization_id, `%${search.toLowerCase()}%`, parseInt(limit), offset]);

    // Merge stats
    const merged = interviews.map(interview => {
      const id = interview.interview_id;
      return {
        ...interview,
        responded_count: conducted.find(i => i.interview_id === id)?.responded_count || 0,
        shortlisted_count: shortlistedCounts.find(i => i.interview_id === id)?.shortlisted_count || 0,
        private_responses: privateResponses.find(i => i.interview_id === id)?.private_responses || 0,
        public_responses: publicResponses.find(i => i.interview_id === id)?.public_responses || 0
      };
    });

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      interviews: merged
    });

  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});


module.exports = router;