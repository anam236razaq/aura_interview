const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer();

//GET /subscriptions
router.get('/', authMiddleware, checkRole([1, 4]), async(req, res) => {
    try{
        const [rows] = await db.query(
        'SELECT * FROM subscriptions ORDER BY price ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Get subscriptions error:', err);
        res.status(500).json({ message: 'Error fetching subscriptions' });
    }
})

//POST /subscriptions
router.post('/', authMiddleware, checkRole([4]),  upload.none(), async (req, res) => {
  const { title, description, price, duration_months,  max_cvs = null, max_interviews = null, 
        max_users = null,  max_processed_cvs = 0, no_of_companies = 0, no_of_conducted_interviews = 0  } = req.body;

  try {
    const [result] = await db.query(
        `INSERT INTO subscriptions (title, description, price, duration_months, max_cvs, max_interviews, 
          max_users, max_processed_cvs, no_of_companies, no_of_conducted_interviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, price, duration_months, max_cvs, max_interviews, max_users, 
          max_processed_cvs, no_of_companies, no_of_conducted_interviews]
    );

     // Log activity
    await db.query(
      `INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)`,
      [req.user.id,'Create Subscription', `Subscription "${title}" created`
      ]);

    res.status(201).json({ message: 'Subscription created', id: result.insertId });
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ message: 'Error creating subscription' });
  }
});

//UPDATE /subscriptions
router.put('/:id', authMiddleware, checkRole([4]),  upload.none(),  async (req, res) => {
    const { title, description, price, duration_months, max_cvs = null,  max_interviews = null, 
        max_users = null,  max_processed_cvs = 0, no_of_companies = 0, no_of_conducted_interviews = 0 } = req.body;
    try {
        const [result] = await db.query(`UPDATE subscriptions 
        SET title = ?, description = ?, price = ?, duration_months = ?,
        max_cvs = ?, max_interviews = ?, max_users = ?,
        max_processed_cvs = ?, no_of_companies = ?, no_of_conducted_interviews = ?
        WHERE id = ?`, [title, description, price, duration_months, max_cvs, max_interviews, max_users, 
          max_processed_cvs, no_of_companies, no_of_conducted_interviews, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

         // Log activity
        await db.query(
          `INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)`,
          [req.user.id,'Update Subscription', `Subscription "${title}" updated`]);

        res.json({ message: 'Subscription updated successfully' });
  } catch (err) {
    console.error('Update subscription error:', err);
    res.status(500).json({ message: 'Error updating subscription' });
  }
});

// DELETE /subscriptions
router.delete('/:id', authMiddleware, checkRole([4]), async (req, res) => {
  try {
    // Step 1: Get subscription title
    const [subscriptionRows] = await db.query(
      'SELECT title FROM subscriptions WHERE id = ?',
      [req.params.id]
    );

    if (subscriptionRows.length === 0) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const subscriptionTitle = subscriptionRows[0].title;

    // Step 2: Delete subscription
    await db.query('DELETE FROM subscriptions WHERE id = ?', [req.params.id]);

    // Step 3: Log activity
    await db.query(
      `INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)`,
      [req.user.id, 'Delete Subscription', `Subscription "${subscriptionTitle}" deleted`]
    );

    res.json({ message: `Subscription "${subscriptionTitle}" deleted successfully` });
  } catch (err) {
    console.error('Delete subscription error:', err);
    res.status(500).json({ message: 'Error deleting subscription' });
  }
});

module.exports = router;