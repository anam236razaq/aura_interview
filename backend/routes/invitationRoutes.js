const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get interviewId if nested
const db = require('../config/db');
const crypto = require('crypto');
const checkRole = require('../middleware/roleMiddleware'); // Import role checker

// Middleware to check if the interview (from parent route) belongs to the user's organization
// Applied only to routes that manage invitations (POST /, GET /)
async function checkInterviewOwnership(req, res, next) {
    const { interviewId } = req.params;
    const organization_id = req.user.organization_id;
    console.log(organization_id);
    if (!interviewId) {
        console.error('Interview ID is missing in the request parameters.');
        return res.status(400).json({ message: 'Interview ID is missing.' });
    }
    console.log('Checking interview ownership with interviewId:', interviewId, 'and organization_id:', organization_id);
    try {
        const [interviews] = await db.query('SELECT id FROM interviews WHERE id = ? AND organization_id = ?', [interviewId, organization_id]);
        if (interviews.length === 0) {
            console.warn('No interview found for interviewId:', interviewId, 'and organization_id:', organization_id);
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }
        next(); // Interview belongs to the organization, proceed
    } catch (error) {
        console.error('Error checking interview ownership:', error);
        return res.status(500).json({ message: 'Error verifying interview access.' });
    }
}

// POST /api/interviews/:interviewId/invitations - Create a new invitation (Admin only)
router.post('/', checkInterviewOwnership, checkRole([1]), async (req, res) => {
  const { interviewId } = req.params;
  const { email, first_name, last_name, message, expires_at } = req.body;
  const organization_id = req.user.organization_id; // Use org ID from user

  if (!email || !interviewId) {
    return res.status(400).json({ message: 'Email and interviewId are required' });
  }

  // Generate a unique token
  const token = crypto.randomBytes(32).toString('hex');

  try {
    // Ownership already checked by middleware
    const [result] = await db.query(
      'INSERT INTO invitations (organization_id, interview_id, email, first_name, last_name, message, status, token, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [organization_id, interviewId, email, first_name, last_name, message, 'sent', token, expires_at]
    );

    // TODO: Send email to the candidate with the invitation link (e.g., /interview/{token})

    res.status(201).json({ 
        id: result.insertId, 
        interview_id: parseInt(interviewId), 
        email, 
        token, // Return token for reference (maybe not in production)
        status: 'sent' 
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ message: 'Error creating invitation' });
  }
});

// GET /api/interviews/:interviewId/invitations - List invitations for an interview
router.get('/', checkInterviewOwnership, async (req, res) => {
    const { interviewId } = req.params;
    // Ownership already checked by middleware
    try {
        const [invitations] = await db.query('SELECT id, email, first_name, last_name, status, created_at, expires_at FROM invitations WHERE interview_id = ?', [interviewId]);
        res.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ message: 'Error fetching invitations' });
    }
});

// --- Routes for candidates accessing via token (mounted separately) ---

// GET /api/invitations/:token - Get invitation/interview details by token
router.get('/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const [invitations] = await db.query(
            `SELECT 
                i.id as invitation_id, i.status as invitation_status, i.expires_at, 
                inv.id as interview_id, inv.title as interview_title, inv.description as interview_description,
                q.id as question_id, q.text as question_text, q.type as question_type, q.time_limit, q.order
             FROM invitations i
             JOIN interviews inv ON i.interview_id = inv.id
             LEFT JOIN questions q ON inv.id = q.interview_id
             WHERE i.token = ? AND (i.expires_at IS NULL OR i.expires_at > NOW()) AND i.status NOT IN ('completed', 'canceled')
             ORDER BY q.order ASC`,
            [token]
        );

        if (invitations.length === 0) {
            // Could be expired, completed, canceled, or invalid token
            return res.status(404).json({ message: 'Invitation not found, expired, or already completed.' });
        }

        // Structure the response
        const response = {
            invitation_id: invitations[0].invitation_id,
            invitation_status: invitations[0].invitation_status,
            expires_at: invitations[0].expires_at,
            interview: {
                id: invitations[0].interview_id,
                title: invitations[0].interview_title,
                description: invitations[0].interview_description,
                questions: []
            }
        };

        // Aggregate questions (if any)
        invitations.forEach(row => {
            if (row.question_id) { // Check if there are questions
                response.interview.questions.push({
                    id: row.question_id,
                    text: row.question_text,
                    type: row.question_type,
                    time_limit: row.time_limit,
                    order: row.order
                });
            }
        });

        // TODO: Potentially update invitation status to 'viewed' if it's 'sent'

        res.json(response);
    } catch (error) {
        console.error('Error fetching invitation by token:', error);
        res.status(500).json({ message: 'Error fetching invitation details' });
    }
});

module.exports = router;
