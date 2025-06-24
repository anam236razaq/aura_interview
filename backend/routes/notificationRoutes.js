const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [notifications] = await db.query(
      `SELECT 
         n.id,
         n.subject,
         n.message,
         n.is_read,
         n.created_at,
         u.profile_image
       FROM notifications n
       JOIN users u ON n.user_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.patch('/mark-all-read/:userId', async(req, res) => {
    const {userId} = req.params;

    try{
        await db.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
        res.json({ message: 'All notifications marked as read' });

    }catch(error){
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM notifications WHERE id = ?`, [id]);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});


module.exports = router;
