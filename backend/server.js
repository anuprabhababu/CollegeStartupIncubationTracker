require('dotenv').config();
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const startupsRoutes = require('./routes/startups');
const mentorsRoutes = require('./routes/mentors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

/* 🔥 Serve Frontend Files */
app.use(express.static(path.join(__dirname, '../frontend')));

/* 🔥 API Routes */
app.use('/api/startups', startupsRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/auth', authRoutes);

/* 🔥 Load index.html on root */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});