const express = require('express');
const router = express.Router();
const pool = require('../config/db');


/* SEND REQUEST (student) */
router.post('/', async (req, res) => {

const { startup_id, mentor_id } = req.body;

try {

/* CHECK EXISTING REQUEST */
const existing = await pool.query(
`SELECT * FROM mentor_requests 
 WHERE startup_id=$1 AND mentor_id=$2`,
[startup_id, mentor_id]
);

if(existing.rows.length > 0){
return res.status(400).json({ message: "Request already sent" });
}

/* INSERT ONLY IF NOT EXISTS */
await pool.query(
`INSERT INTO mentor_requests (startup_id, mentor_id, status)
 VALUES ($1,$2,'Pending')`,
[startup_id, mentor_id]
);

res.json({ message: "Request sent successfully" });

} catch (err) {

console.log(err);

if(err.code === '23505'){
return res.status(400).json({ message: "Request already sent" });
}

res.status(500).json({ message: "Server error" });

}

});


/* GET REQUESTS FOR MENTOR */
router.get('/:mentor_id', async (req, res) => {

  const { mentor_id } = req.params;

  try {

    const result = await pool.query(
      `SELECT r.*, s.startup_name
       FROM mentor_requests r
       JOIN startups s ON r.startup_id = s.startup_id
       WHERE r.mentor_id = $1`,
      [mentor_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ✅ ACCEPT REQUEST */
router.post('/accept', async (req, res) => {

  const { request_id, startup_id, mentor_id } = req.body;

  try {

    // Update request
    await pool.query(
      `UPDATE mentor_requests
       SET status = 'Accepted'
       WHERE request_id = $1`,
      [request_id]
    );

    // Insert into startup_mentor
    await pool.query(
      `INSERT INTO startup_mentor (startup_id, mentor_id)
       VALUES ($1, $2)`,
      [startup_id, mentor_id]
    );

    res.json({ message: "Request accepted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }

});


/* ❌ REJECT REQUEST */
router.post('/reject', async (req, res) => {

  const { request_id } = req.body;

  try {

    await pool.query(
      `UPDATE mentor_requests
       SET status = 'Rejected'
       WHERE request_id = $1`,
      [request_id]
    );

    res.json({ message: "Request rejected" });

  } catch (err) {

if(err.code === '23505'){
return res.status(400).json({ error: "Request already sent" });
}

res.status(500).json({ error: "Request already sent" });

}

});


module.exports = router;