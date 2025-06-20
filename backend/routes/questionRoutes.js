const express = require('express');
// Use mergeParams to access interviewId from the parent router
const router = express.Router({ mergeParams: true });
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware'); // Import role checker

// Middleware to check if the interview (from parent route) belongs to the user's organization
// This assumes the route is nested under /interviews/:interviewId
async function checkInterviewOwnership(req, res, next) {
    const { interviewId } = req.params;
    const organization_id = req.user.organization_id;
    if (!interviewId) {
        // This shouldn't happen if routes are set up correctly, but good practice
        return res.status(400).json({ message: 'Interview ID is missing.' });
    }
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

// Apply the ownership check middleware to routes that depend on :interviewId
// GET /api/interviews/:interviewId/questions - Get all questions for a specific interview
router.get('/', checkInterviewOwnership, async (req, res) => {
  const { interviewId } = req.params;
  // Ownership already checked

  try {
    const [questions] = await db.query('SELECT * FROM questions WHERE interview_id = ? ORDER BY `order` ASC', [interviewId]);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// POST /api/interviews/:interviewId/questions - Add a new question to an interview (Admin only)
router.post('/', checkInterviewOwnership, checkRole([1,2,3]), async (req, res) => {
  const { interviewId } = req.params;
  const { text, type, time_limit, order } = req.body;
  // Ownership already checked

  if (!text || !type) {
    return res.status(400).json({ message: 'Text and type are required for a question' });
  }

  // Basic validation for type enum
  const validTypes = ['video', 'text', 'file', 'audio', 'multiple_choice'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: `Invalid question type: ${type}` });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO questions (interview_id, text, type, time_limit, `order`) VALUES (?, ?, ?, ?, ?)',
      [interviewId, text, type, time_limit, order]
    );
    res.status(201).json({ id: result.insertId, interview_id: parseInt(interviewId), text, type, time_limit, order });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// --- Routes for individual questions (accessed via /api/questions/:id) ---
// These need a different check: verify the question's interview_id belongs to the user's org.

async function checkQuestionOwnership(req, res, next) {
    const { id } = req.params; // Question ID
    const organization_id = req.user.organization_id;
    try {
        const [questions] = await db.query(
            `SELECT q.id 
             FROM questions q 
             JOIN interviews i ON q.interview_id = i.id 
             WHERE q.id = ? AND i.organization_id = ?`,
            [id, organization_id]
        );
        if (questions.length === 0) {
            return res.status(404).json({ message: 'Question not found or access denied.' });
        }
        next();
    } catch (error) {
        console.error('Error checking question ownership:', error);
        return res.status(500).json({ message: 'Error verifying question access.' });
    }
}

// GET /api/questions/:id - Get a specific question by its ID
router.get('/:id', checkQuestionOwnership, async (req, res) => {
    const { id } = req.params;
    // Ownership checked
    try {
        const [questions] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
        if (questions.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(questions[0]);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});

// PUT /api/questions/:id - Update a specific question (Admin only)
router.put('/:id', checkQuestionOwnership, checkRole([1]), async (req, res) => {
  const { id } = req.params;
  const { text, type, time_limit, order } = req.body;
  // Ownership checked

  // Basic validation for type enum if provided
  if (type) {
      const validTypes = ['video', 'text', 'file', 'audio', 'multiple_choice'];
      if (!validTypes.includes(type)) {
          return res.status(400).json({ message: `Invalid question type: ${type}` });
      }
  }

  try {
    // Check if question exists
    const [existing] = await db.query('SELECT id FROM questions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Build update query dynamically
    let query = 'UPDATE questions SET ';
    const params = [];
    if (text !== undefined) { query += 'text = ?, '; params.push(text); }
    if (type !== undefined) { query += 'type = ?, '; params.push(type); }
    if (time_limit !== undefined) { query += 'time_limit = ?, '; params.push(time_limit); }
    if (order !== undefined) { query += '`order` = ?, '; params.push(order); }

    if (params.length === 0) {
        return res.status(400).json({ message: 'No update fields provided' });
    }

    query = query.slice(0, -2); // Remove trailing comma and space
    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found or no changes made' });
    }

    // Fetch updated question
    const [updatedQuestions] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
    res.json(updatedQuestions[0]);

  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// DELETE /api/questions/:id - Delete a specific question (Admin only)
router.delete('/:id', checkQuestionOwnership, checkRole([1]), async (req, res) => {
  const { id } = req.params;
  // Ownership checked

  try {
    // Add cascading delete or handle related records (responses) if necessary
    const [result] = await db.query('DELETE FROM questions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error('Error deleting question:', error);
    // Handle foreign key constraint errors if cascading delete is not set up
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router;
