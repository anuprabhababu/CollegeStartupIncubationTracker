const express = require('express');
const router = express.Router();
const startupService = require('../services/startupService');

// GET all startups
router.get('/', async (req, res) => {
  try {
    const startups = await startupService.getAllStartups();
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new startup
router.post('/', async (req, res) => {
  try {
    const newStartup = await startupService.addStartup(req.body);
    res.status(201).json(newStartup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;