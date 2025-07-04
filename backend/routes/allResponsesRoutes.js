const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/all-responses-org
router.get('/', authMiddleware, async (req, res) => {
  const organization_id = req.user.organization_id;
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Optional search clause
    const searchClause = search ? `AND i.title LIKE ?` : '';
    const searchParams = search ? [`%${search}%`] : [];

    // Count total distinct CVs involved in any interview in the org
    const [countResult] = await db.query(
        `SELECT COUNT(DISTINCT r.cv_id) AS total
        FROM responses r
        JOIN interviews i ON r.interview_id = i.id
        JOIN cvs cv ON r.cv_id = cv.id
        LEFT JOIN interview_shortlisted sc ON sc.cv_id = r.cv_id AND sc.interview_id = r.interview_id
        WHERE i.organization_id = ? AND sc.shortlisted = 1
        ${searchClause}`,
        [organization_id, ...searchParams]);
        
    const total = countResult[0].total;

    // Fetch paginated CVs
    const [cvRows] = await db.query(
      `SELECT DISTINCT r.cv_id, cv.personal_info, i.title AS interview_title, i.id AS interview_id,
        sc.shortlisted
       FROM responses r
       JOIN interviews i ON r.interview_id = i.id
       JOIN cvs cv ON r.cv_id = cv.id
       LEFT JOIN interview_shortlisted sc ON sc.cv_id = r.cv_id AND sc.interview_id = r.interview_id
       WHERE i.organization_id = ? AND sc.shortlisted = 1
       ${searchClause}
       ORDER BY r.cv_id
       LIMIT ? OFFSET ?`,
      [organization_id, ...searchParams, parseInt(limit), offset]
    );

    if (cvRows.length === 0) {
      return res.json({
        candidates: [],
        page: parseInt(page),
        limit: parseInt(limit),
        total
      });
    }

    // Group candidates without responses
    const candidates = cvRows.map(row => {
      const personalInfo = JSON.parse(row.personal_info || '{}');
      return {
        cvId: row.cv_id,
        name: personalInfo.name || 'N/A',
        email: personalInfo.email || 'N/A',
        interviewTitle: row.interview_title,
        interviewId: row.interview_id,
        shortlisted: row.shortlisted === 1
      };
    });

    res.json({
      candidates,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    console.error('Error fetching org-wide responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

module.exports = router;
