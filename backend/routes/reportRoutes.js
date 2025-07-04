const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const ExcelJS = require('exceljs');

//GET /api/report/stats
router.get('/stats', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
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

    //Date Filtration
    let dateFilterClause = '';
    const baseParams = [organization_id, `%${search.toLowerCase()}%`];

    if(startDate && endDate){
      dateFilterClause= 'AND DATE(i.created_at) BETWEEN ? AND ?';
      baseParams.push(startDate, endDate);
    }

    // Count matching interviews for the organization
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM interviews i WHERE i.organization_id = ? AND LOWER(i.title) LIKE ?${dateFilterClause}`,
      baseParams
    );
    const total = countResult[0].total;

    // Get paginated interviews for the organization
    const dataQueryParams = [...baseParams, parseInt(limit), offset];
    const [interviews] = await db.query(`
      SELECT i.id AS interview_id, i.title, COUNT(inv.id) AS links_sent
      FROM interviews i
      LEFT JOIN invitations inv ON inv.interview_id = i.id AND inv.token IS NOT NULL
      WHERE i.organization_id = ? AND LOWER(i.title) LIKE ?${dateFilterClause}
      GROUP BY i.id, i.title
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `, dataQueryParams);

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

//GET /api/report/stats/export  //export a stats file
router.get('/stats/export', authMiddleware, async(req, res) => {
  const organization_id = req.user.organization_id;
  const { search = '', startDate, endDate } = req.query;

   try {
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

    //Date Filtration
    let dateFilterClause = '';
    const queryParams = [organization_id, `%${search.toLowerCase()}%`];

    if (startDate && endDate) {
      dateFilterClause = ' AND DATE(i.created_at) BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    const [interviews] = await db.query(`
      SELECT i.id AS interview_id, i.title, COUNT(inv.id) AS links_sent
      FROM interviews i
      LEFT JOIN invitations inv ON inv.interview_id = i.id AND inv.token IS NOT NULL
      WHERE i.organization_id = ? AND LOWER(i.title) LIKE ?${dateFilterClause}
      GROUP BY i.id, i.title
      ORDER BY i.created_at DESC
    `, queryParams);

    const merged = interviews.map(interview => {
      const id = interview.interview_id;
      return {
        title: interview.title,
        links_sent: interview.links_sent,
        shortlisted_count: shortlistedCounts.find(i => i.interview_id === id)?.shortlisted_count || 0,
        responded_count: conducted.find(i => i.interview_id === id)?.responded_count || 0,
        private_responses: privateResponses.find(i => i.interview_id === id)?.private_responses || 0,
        public_responses: publicResponses.find(i => i.interview_id === id)?.public_responses || 0
      };
    });

    // Generate Excel using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Interview Stats');

    worksheet.columns =[
      {header: 'Interview Title', key: 'title', width: 30},
      {header: 'Total Invitations Sent', key: 'links_sent', width: 20},
      { header: 'Shortlisted', key: 'shortlisted_count', width: 15 },
      { header: 'Total Responses', key: 'responded_count', width: 20 },
      { header: 'Private Responses', key: 'private_responses', width: 20 },
      { header: 'Public Responses', key: 'public_responses', width: 20 }
    ]

    worksheet.addRows(merged);

    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=interview_stats.xlsx');

    await workbook.xlsx.write(res);
    res.end();

    } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Error exporting stats' });
  }
})

module.exports = router;