const express = require('express');
// Use mergeParams to access responseId if nested under /api/responses/
const router = express.Router({ mergeParams: true });
const db = require('../config/db');

const ADMIN_ROLE = 1;

// Middleware to check if the user can access/review the specified response
// Access allowed if: User is Admin OR User is assigned to the interview associated with the response
async function checkReviewPermission(req, res, next) {
    const { responseId } = req.params;
    const userId = req.user.id;
    const userRoleId = req.user.role_id;
    const organization_id = req.user.organization_id;

    if (!responseId) {
        return res.status(400).json({ message: 'Response ID is missing.' });
    }

    try {
        // 1. Get the invitation_id and interview_id associated with the response
        const [responses] = await db.query(
            `SELECT r.invitation_id, i.interview_id 
             FROM responses r
             JOIN invitations inv ON r.invitation_id = inv.id
             JOIN interviews i ON inv.interview_id = i.id
             WHERE r.id = ? AND i.organization_id = ?`,
            [responseId, organization_id]
        );

        if (responses.length === 0) {
            return res.status(404).json({ message: 'Response not found or access denied.' });
        }
        const { interview_id } = responses[0];

        // 2. Check if user is an Admin
        if (userRoleId === ADMIN_ROLE) {
            req.interviewId = interview_id; // Pass interviewId for later use if needed
            return next(); // Admins have access
        }

        // 3. If not Admin, check if user is assigned to the interview
        const [assignments] = await db.query(
            'SELECT id FROM interview_assignments WHERE interview_id = ? AND user_id = ?',
            [interview_id, userId]
        );

        if (assignments.length > 0) {
            req.interviewId = interview_id; // Pass interviewId
            return next(); // User has access
        }

        // If none of the conditions are met, deny access
        return res.status(403).json({ message: 'Access denied.' });

    } catch (error) {
        console.error('Error checking review permission:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = router;
