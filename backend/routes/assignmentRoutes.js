const express = require('express');
// Use mergeParams to access interviewId from the parent router
const router = express.Router({ mergeParams: true });
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware'); // Import role checker

const ADMIN_ROLE = 1;

// Middleware to check if the interview belongs to the user's organization
async function checkInterviewOwnership(req, res, next) {
    const { interviewId } = req.params;
    const organization_id = req.user.organization_id;
    try {
        const [interviews] = await db.query('SELECT id FROM interviews WHERE id = ? AND organization_id = ?', [interviewId, organization_id]);
        if (interviews.length === 0) {
            return res.status(404).json({ message: 'Interview not found or access denied.' });
        }
        next(); // Interview belongs to the organization, proceed
    } catch (error) {
        console.error('Error checking interview ownership:', error);
        return res.status(500).json({ message: 'Error verifying interview access.' });
    }
}

// Apply the ownership check middleware to all routes in this file
router.use(checkInterviewOwnership);

// POST /api/interviews/:interviewId/assignments - Assign a user to an interview (Admin only)
router.post('/', checkRole([ADMIN_ROLE]), async (req, res) => {
  const { interviewId } = req.params;
  const { userId } = req.body;
  // Ownership already checked by middleware
  // TODO: Validate userId exists within the same organization?

  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  try {
    // Check if assignment already exists
    const [existing] = await db.query('SELECT id FROM interview_assignments WHERE interview_id = ? AND user_id = ?', [interviewId, userId]);
    if (existing.length > 0) {
        return res.status(409).json({ message: 'User is already assigned to this interview.' });
    }

    const [result] = await db.query(
      'INSERT INTO interview_assignments (interview_id, user_id) VALUES (?, ?)',
      [interviewId, userId]
    );
    res.status(201).json({ id: result.insertId, interview_id: parseInt(interviewId), user_id: userId });
  } catch (error) {
    console.error('Error assigning user to interview:', error);
    // Handle potential foreign key constraint errors (if interviewId or userId doesn't exist)
    res.status(500).json({ message: 'Error assigning user' });
  }
});

// GET /api/interviews/:interviewId/assignments - List users assigned to an interview (Allowed for all authenticated users)
router.get('/', async (req, res) => {
    const { interviewId } = req.params;
    // Ownership already checked by middleware

    try {
        const [assignments] = await db.query(
            `SELECT ia.id, ia.user_id, u.email, u.first_name, u.last_name 
             FROM interview_assignments ia
             JOIN users u ON ia.user_id = u.id
             WHERE ia.interview_id = ?`,
             [interviewId]
            );
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching interview assignments:', error);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// DELETE /api/interviews/:interviewId/assignments/:userId - Unassign a user from an interview (Admin only)
router.delete('/:userId', checkRole([ADMIN_ROLE]), async (req, res) => {
    const { interviewId, userId } = req.params;
    // Ownership already checked by middleware

    try {
        const [result] = await db.query('DELETE FROM interview_assignments WHERE interview_id = ? AND user_id = ?', [interviewId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }

        res.status(204).send(); // No content on successful deletion
    } catch (error) {
        console.error('Error unassigning user:', error);
        res.status(500).json({ message: 'Error unassigning user' });
    }
});

module.exports = router;
