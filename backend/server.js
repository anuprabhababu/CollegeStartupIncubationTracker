const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const startupsRoutes = require('./routes/startups');
const mentorsRoutes = require('./routes/mentors');
const requestRoutes = require('./routes/requests');
const investorsRoutes = require('./routes/investors'); // 🔥 added

const pool = require('./config/db');

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve frontend */
app.use(express.static(path.join(__dirname, '../frontend')));

/* API Routes */
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupsRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/investors', investorsRoutes); // 🔥 added

/* Home Page */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* Test Database Connection */
pool.query("SELECT NOW()")
  .then(result => {
    console.log("Database connected:", result.rows[0]);
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});