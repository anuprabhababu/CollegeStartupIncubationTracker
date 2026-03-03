require('dotenv').config();
const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ Connection Error", err));

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});