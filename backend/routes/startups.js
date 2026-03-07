const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/* GET ALL STARTUPS */

router.get('/', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM startups ORDER BY startup_id DESC'
    );

    res.json(result.rows);

  } catch (err) {

    console.log("STARTUP FETCH ERROR:", err);

    res.status(500).json({ error: err.message });

  }

});


/* ADD STARTUP */

router.post('/', async (req, res) => {

  const {
    startup_name,
    domain,
    idea_description,
    founded_date,
    student_id
  } = req.body;

  try {

    await pool.query(

      `INSERT INTO startups
      (startup_name, domain, idea_description, founding_date, current_status, student_id)
      VALUES ($1,$2,$3,$4,'Active',$5)`,

      [
        startup_name,
        domain,
        idea_description,
        founded_date,
        student_id
      ]

    );

    res.json({ message: "Startup added successfully" });

  } catch (err) {

    console.log("STARTUP INSERT ERROR:", err);

    res.status(500).json({ error: err.message });

  }

});

module.exports = router;