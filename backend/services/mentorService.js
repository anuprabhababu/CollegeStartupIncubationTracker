const pool = require('../config/db');

async function getAllMentors() {
  const result = await pool.query('SELECT * FROM mentors');
  return result.rows;
}

async function addMentor(mentor) {
  const { mentor_name, expertise_area, email, contact_number } = mentor;

  const result = await pool.query(
    `INSERT INTO mentors 
     (mentor_name, expertise_area, email, contact_number)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [mentor_name, expertise_area, email, contact_number]
  );

  return result.rows[0];
}

module.exports = {
  getAllMentors,
  addMentor
};