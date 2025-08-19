const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 

// --- Multer Configuration for Uploading payment Screenshot ---
const imgUploadDir = path.join(__dirname, '../uploads/payment_temp');

//Ensure Img directory exist
fs.mkdir(imgUploadDir, {recursive: true}).catch(console.error);

// Configure storage
const imgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgUploadDir);
  },
  filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imgFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'), false)
    }
}

const uploadImg = multer({ storage: imgstorage, fileFilter: imgFileFilter, limits: { fileSize: 200 * 1024 }});

//Middleware for Multer Image File Size
const multerImgUpload = (req, res, next) => {
  uploadImg.single('payment_img')(req, res, function(err) {
    if (err instanceof multer.MulterError){

      if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(413).json({message: 'File too large. Max allowed is 200KB.'})
      }

    }else if (err){
      return res.status(400).json({message: err.message})
    }
    next();
})
}

// POST /transactions
router.post('/', authMiddleware, checkRole([1]),  multerImgUpload, async (req, res) => {
    const { subscription_id, gateway_id, note } = req.body;
    const user_id = req.user.id;
    const organization_id = req.user.organization_id;

    try {
        // 1. Validate subscription
        const [subs] = await db.query('SELECT price FROM subscriptions WHERE id = ?', [subscription_id]);

        if (subs.length === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const amount = subs[0].price;

        // 2. Validate payment gateway
        const [gateways] = await db.query(
            'SELECT id, status FROM payment_gateways WHERE id = ?',
            [gateway_id]
        );

        if (gateways.length === 0) {
            return res.status(404).json({ message: 'Payment gateway not found' });
        }

        if (gateways[0].status !== 'active') {
            return res.status(400).json({ message: 'Selected payment gateway is inactive' });
        }

        const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
        const filePath = req.file ? `/uploads/payment_temp/${req.file.filename}` : null;
        const transactionFilePath = filePath ? `${serverBaseUrl}${filePath}` : null;

        if (!transactionFilePath) {
            return res.status(400).json({ message: 'Payment screenshot is required' });
        }

        if (!note) {
            return res.status(400).json({ message: 'Note is required' });
        }

        // 3. Insert into transactions
        const [result] = await db.query(
            `INSERT INTO transactions (user_id, organization_id, subscription_id, gateway_id, amount, file, note, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [user_id, organization_id, subscription_id, gateway_id, amount, transactionFilePath, note]
        );

        res.status(201).json({ 
            message: 'Transaction created, pending approval', 
            transaction_id: result.insertId 
        });
    } catch (err) {
        console.error('Create transaction error:', err);
        res.status(500).json({ message: 'Error creating transaction' });
    }
});

// GET /transactions/pending
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const organization_id = req.user.organization_id;

    const [rows] = await db.query(
      `SELECT t.*, s.title AS subscription_name
       FROM transactions t
       JOIN subscriptions s ON t.subscription_id = s.id
       WHERE t.organization_id = ? AND t.status = 'pending'
       ORDER BY t.payment_date DESC LIMIT 1`,
      [organization_id]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching pending transaction:", err);
    res.status(500).json({ message: "Error fetching pending transaction" });
  }
});


// GET /transactions/current-plan
router.get('/current-plan', authMiddleware, checkRole([1]), async (req, res) => {
  const organization_id = req.user.organization_id;

  try {
    // 1. Get latest active transaction for this organization
    const [rows] = await db.query(`
      SELECT 
        t.id AS transaction_id,
        t.subscription_id,
        t.status,
        t.payment_date AS transaction_date,
        s.title AS subscription_name,
        s.description AS subscription_desc,
        s.price,
        s.duration_months,
        s.max_processed_cvs,
        s.max_cvs,
        s.max_users,
        s.max_interviews,
        s.no_of_companies,
        s.no_of_conducted_interviews
      FROM transactions t
      INNER JOIN subscriptions s ON t.subscription_id = s.id
      WHERE t.organization_id = ? AND t.status = 'approved'
      ORDER BY t.payment_date DESC
      LIMIT 1
    `, [organization_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active subscription found for this organization.' });
    }

    res.json({
      message: 'Current plan retrieved successfully',
      currentPlan: rows[0]
    });
  } catch (err) {
    console.error('Error fetching current plan:', err);
    res.status(500).json({ message: 'Error fetching current plan' });
  }
});


// GET /transactions
router.get('/', authMiddleware, checkRole([4]), async (req, res) => {
    const {page = 1, limit = 10, search } = req.query;

    let baseQuery =`FROM transactions t
                    JOIN subscriptions s ON t.subscription_id = s.id
                    JOIN users u ON t.user_id = u.id
                    JOIN organizations o ON t.organization_id = o.id
                    WHERE 1 = 1`

    let params = [];

    if(search){
      baseQuery+=`  AND (
            s.title LIKE ? OR 
            u.first_name LIKE ? OR 
            u.last_name LIKE ? OR 
            o.company_name LIKE ?
          )`

          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [countResult] = await db.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countResult[0].total; 

    const [transactions] = await db.query(`SELECT t.id, t.status, t.file, t.note, t.payment_date, t.amount, s.title AS subscription_title, 
      u.first_name, u.last_name, o.company_name AS organization_name ${baseQuery}
      ORDER BY t.payment_date DESC  LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset])

    res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        transactions
    });
  
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Approve a transaction
router.patch('/:id/approve', authMiddleware, checkRole([4]), async (req, res) => {
  try {

    // Step 1: Get transaction with user's name
    const [transactionRows] = await db.query(
      `SELECT t.id, t.user_id, CONCAT(u.first_name, ' ', u.last_name) AS user_name
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (transactionRows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactionRows[0];

    // Update status
    const [result] = await db.query(
      `UPDATE transactions SET status = 'approved' WHERE id = ?`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to approve transaction' });
    }

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)`,
      [
        req.user.id,
        'Approve Transaction',
        `Transaction by "${transaction.user_name}" approved`
      ]
    );

    res.json({ message: `Transaction by "${transaction.user_name}" approved successfully` });
  } catch (err) {
    console.error('Approve transaction error:', err);
    res.status(500).json({ message: 'Error approving transaction' });
  }
});


// Delete transaction
router.delete('/:id', authMiddleware, checkRole([4]), async (req, res) => {
  try {
     // Step 1: Get transaction info with user full name
      const [transactionRows] = await db.query(
      `SELECT t.id, t.user_id, CONCAT(u.first_name, ' ', u.last_name) AS user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?`,
      [req.params.id]
    );

    if (transactionRows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactionRows[0];

    // Delete transaction
    await db.query(
      `DELETE FROM transactions WHERE id = ?`,
      [req.params.id]
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)`,
      [
        req.user.id,
        'Delete Transaction',
        `Transaction by "${transaction.user_name}" deleted`
      ]
    );

    res.json({ message: `Transaction by "${transaction.user_name}" deleted successfully` });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

// POST /transactions/cancel
router.post('/cancel', authMiddleware, checkRole([1]), async (req, res) => {
    const organization_id = req.user.organization_id;

    try {
        // 1. Find active subscription transaction ID
        const [currentSub] = await db.query(
            `SELECT id 
             FROM transactions
             WHERE organization_id = ? 
               AND status = 'approved'
             ORDER BY payment_date DESC
             LIMIT 1`,
            [organization_id]
        );

        if (!currentSub.length) {
            return res.status(404).json({ message: 'No active subscription found.' });
        }

        const transaction_id = currentSub[0].id;

        // 2. Cancel the subscription
        await db.query(
            `UPDATE transactions 
             SET status = 'cancelled'
             WHERE id = ?`,
            [transaction_id]
        );

        res.status(200).json({
            message: 'Subscription cancelled successfully.'
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ message: 'Error cancelling subscription.' });
    }
});

module.exports = router;