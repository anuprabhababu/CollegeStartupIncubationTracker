const pool = require('../config/db');

async function getAllStartups() {
  const result = await pool.query(
    'SELECT * FROM startups ORDER BY startup_id DESC'
  );
  return result.rows;
}

async function addStartup(startup) {
  const { startup_name, domain, idea_description } = startup;

  const result = await pool.query(
    `INSERT INTO startups 
     (startup_name, domain, idea_description, founding_date, current_status, student_id)
     VALUES ($1, $2, $3, NOW(), 'Active', 1)
     RETURNING *`,
    [startup_name, domain, idea_description]
  );

  return result.rows[0];
}

module.exports = {
  getAllStartups,
  addStartup
};