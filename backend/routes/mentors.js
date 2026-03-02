const express = require('express');
const router = express.Router();
const mentorService = require('../services/mentorService');

// GET mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await mentorService.getAllMentors();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD mentor
router.post('/', async (req, res) => {
  try {
    const mentor = await mentorService.addMentor(req.body);
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;