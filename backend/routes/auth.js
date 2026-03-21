const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');


// ================= REGISTER =================
router.post('/register', async (req, res) => {


const { name, email, password, role, dept, year, mobile, contact_number, expertise_area  } = req.body;

try {

if(!name || !email || !password || !role){
return res.status(400).json({error:"All fields required"});
}

/* Check if email exists in BOTH tables */

const studentCheck = await pool.query(
"SELECT * FROM students WHERE email=$1",
[email]
);

const mentorCheck = await pool.query(
"SELECT * FROM mentors WHERE email=$1",
[email]
);

if(studentCheck.rows.length > 0 || mentorCheck.rows.length > 0){
return res.status(400).json({error:"User already exists"});
}

const hashedPassword = await bcrypt.hash(password,10);


/* INSERT BASED ON ROLE */

if(role === "student"){

await pool.query(

  `INSERT INTO students(name, email, password, department, year_of_study, contact_number)
   VALUES($1,$2,$3,$4,$5,$6)`,
  [name, email, hashedPassword, dept, year, mobile]
);

}

else if(role === "mentor"){

await pool.query(

  `INSERT INTO mentors(mentor_name, email, password, contact_number, expertise_area)
   VALUES($1,$2,$3,$4,$5)`,
  [name, email, hashedPassword, contact_number, expertise_area]
);

}

res.json({message:"Registration successful"});

} catch(err){
console.log("REGISTER ERROR:", err);
res.status(500).json({error:"Server error"});
}

});


// ================= LOGIN =================
router.post('/login', async (req, res) => {

const { email, password } = req.body;

try{

/* CHECK STUDENTS FIRST */

let result = await pool.query(
"SELECT * FROM students WHERE email=$1",
[email]
);

if(result.rows.length > 0){

const user = result.rows[0];

const validPassword = await bcrypt.compare(password,user.password);

if(validPassword){
return res.json({
message:"Login successful",
user:{
id:user.student_id,
name:user.name,
email:user.email,
role:"student"
}
});
}

}


/* CHECK MENTORS */

result = await pool.query(
"SELECT * FROM mentors WHERE email=$1",
[email]
);

if(result.rows.length > 0){

const user = result.rows[0];

const validPassword = await bcrypt.compare(password,user.password);

if(validPassword){
return res.json({
message:"Login successful",
user:{
id:user.mentor_id,
name:user.mentor_name,
email:user.email,
role:"mentor"
}
});
}

}

return res.status(400).json({error:"Invalid email or password"});

}catch(err){
console.log("LOGIN ERROR:", err);
res.status(500).json({error:"Server error"});
}

});


// ================= GET PROFILE =================
router.get('/profile/:id', async (req, res) => {

const { id } = req.params;

try{

const result = await pool.query(
`SELECT student_id,name,email,department,year_of_study,contact_number
FROM students WHERE student_id=$1`,
[id]
);

res.json(result.rows[0]);

}catch(err){
console.log(err);
res.status(500).json({error:err.message});
}

});


// ================= UPDATE PROFILE =================
router.post('/profile', async (req, res) => {

const { student_id,name,department,year_of_study,contact_number } = req.body;

try{

await pool.query(
`UPDATE students
SET name=$1,
department=$2,
year_of_study=$3,
contact_number=$4
WHERE student_id=$5`,
[name,department,year_of_study,contact_number,student_id]
);

res.json({message:"Profile updated successfully"});

}catch(err){
console.log(err);
res.status(500).json({error:err.message});
}

});

module.exports = router;