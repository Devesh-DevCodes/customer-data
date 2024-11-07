require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS based on the FRONTEND_URL and ALLOWED_ORIGINS from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const frontendUrl = process.env.FRONTEND_URL; // Frontend URL from .env

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from the frontend URL or any of the allowed origins
    if (allowedOrigins.includes(origin) || origin === frontendUrl || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  }
}));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API route to get customer data
app.get('/api/customers', (req, res) => {
  const query = 'SELECT * FROM Customer';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
