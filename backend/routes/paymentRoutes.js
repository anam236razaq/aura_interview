const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// POST - Add a new payment gateway
router.post("/", authMiddleware, checkRole([4]), async (req, res) => {
  try {
    const { name, type, details, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and Type are required" });
    }

    const [result] = await db.query(
      `INSERT INTO payment_gateways (name, type, details, status) VALUES (?, ?, ?, ?)`,
      [name, type, details ? JSON.stringify(details) : null, status || "active"]
    );

    res.status(201).json({ message: "Payment gateway created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get all payment gateways
router.get("/", authMiddleware, checkRole([1,4]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM payment_gateways");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// PATCH - Update a payment gateway
router.patch("/:id", authMiddleware, checkRole([4]), async (req, res) => {
  try {
    const { name, type, details, status } = req.body;

    const [result] = await db.query(
      `UPDATE payment_gateways SET name=?, type=?, details=?, status=? WHERE id=?`,
      [name, type, details ? JSON.stringify(details) : null, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment gateway not found" });
    }

    res.json({ message: "Payment gateway updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete a payment gateway
router.delete("/:id", authMiddleware, checkRole([4]), async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM payment_gateways WHERE id=?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment gateway not found" });
    }

    res.json({ message: "Payment gateway deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;