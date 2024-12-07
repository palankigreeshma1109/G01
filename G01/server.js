const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Import the JWT library
const dotenv = require('dotenv'); // To manage environment variables securely
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Initialize environment variables from .env file (to store secret keys securely)
dotenv.config();

const app = express();
const port = 3000;

// Enable CORS (cross-origin resource sharing)
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Secret key for JWT signing and verification (store this securely, ideally in an environment variable)
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Setup the connection pool to AWS RDS MySQL instance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {azx
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the database!');
  connection.release(); // Release the connection back to the pool
});

// Route to handle registration requests
app.post('/register', async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  if (!firstname || !lastname || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)';
    pool.query(query, [firstname, lastname, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle login requests
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  pool.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Error fetching user from database' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware to authenticate and verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Store user info in the request object
    next(); // Continue to the next middleware or route handler
  });
}

// Function to get user data from the database based on the decoded username from JWT
function getUserData(user) {
  const query = 'SELECT firstname, lastname, username FROM users WHERE username = ?';
  
  return new Promise((resolve, reject) => {
    pool.query(query, [user.username], (err, results) => {
      if (err) {
        reject('Error fetching user data from database');
      } else if (results.length === 0) {
        reject('User not found');
      } else {
        resolve(results[0]); // Return the user data if found
      }
    });
  });
}

// Route to handle user data requests (protected by JWT authentication)
app.get('/user-data', authenticateToken, (req, res) => {
  //console.log('User Data Route Hit:', req.user); // Logs the decoded user info
  getUserData(req.user)
    .then((userData) => {
      res.json(userData); // Return the user data as JSON
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: error }); // Handle any errors that occur
    });
});

// Example of a protected route that requires authentication
app.get('/user-data1', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM healthcare_ai_data LIMIT 10'; // Example query from your existing table
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json({
      username: req.user.username, // Send the username from the JWT payload
      data: results,               // Send the data fetched from the database (can be anything)
    });
  });
});

// Example of a protected route that requires authentication
app.get('/user-data2', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM healthcare_ai_data LIMIT 5'; // Example query from your existing table
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json({
      username: req.user.username, // Send the username from the JWT payload
      data: results,               // Send the data fetched from the database (can be anything)
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});