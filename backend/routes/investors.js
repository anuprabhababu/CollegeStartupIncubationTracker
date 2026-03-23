const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all investors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM investors");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching investors:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;