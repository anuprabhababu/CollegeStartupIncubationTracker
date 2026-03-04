const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');


// ================= REGISTER =================
router.post('/register', async (req, res) => {

  const { name, email, password } = req.body;

  try {

    if(!name || !email || !password){
      return res.status(400).json({error:"All fields required"});
    }

    const existing = await pool.query(
      "SELECT * FROM students WHERE email=$1",
      [email]
    );

    if(existing.rows.length > 0){
      return res.status(400).json({error:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await pool.query(
      "INSERT INTO students(name,email,password) VALUES($1,$2,$3)",
      [name,email,hashedPassword]
    );

    res.json({message:"Registration successful"});

  } catch(err){
    console.log("REGISTER ERROR:",err);
    res.status(500).json({error:"Server error"});
  }

});


// ================= LOGIN =================
router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try{

    const result = await pool.query(
      "SELECT * FROM students WHERE email=$1",
      [email]
    );

    if(result.rows.length === 0){
      return res.status(400).json({error:"User not found"});
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password,user.password);

    if(!validPassword){
      return res.status(400).json({error:"Invalid password"});
    }

    res.json({
      message:"Login successful",
      user:{
        id:user.student_id,
        name:user.name,
        email:user.email
      }
    });

  } catch(err){
    console.log("LOGIN ERROR:",err);
    res.status(500).json({error:"Server error"});
  }

});

module.exports = router;