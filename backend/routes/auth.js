const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// Simple login using email + password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

module.exports = router;