require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS based on the FRONTEND_URL and ALLOWED_ORIGINS from .env
// const frontendUrl = process.env.FRONTEND_URL; // Frontend URL from .env

// Enable CORS based on the ALLOWED_ORIGINS from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // If no origin is detected (e.g., from Postman or non-browser clients), allow it
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request
    } else {
      console.error('CORS Blocked:', origin);  // Log the blocked origin
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  // Use port from environment : railway connection 
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
  // const query = 'SELECT * FROM Customer';
  const query = 'SELECT * FROM CustomerWithFormattedDate';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

//  API route to get Product :: Railway DB
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM Product';
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
