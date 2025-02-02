const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received signup request:', req.body); // Log request body
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err); // Log database error
        return res.status(500).send(err);
      }
      res.status(201).send('Signup successful');
    });
  } catch (error) {
    console.error('Error during signup process:', error); // Log error
    res.status(500).send(error);
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(400).send('User not found');
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }
    res.status(200).json({
      userId: user.id,
      userName: user.name,
      message: 'Login successful'
    });
  });
});

// Get user by email endpoint
app.get('/api/userByEmail/:email', (req, res) => {
  const userEmail = req.params.email;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      // Do not send the password
    });
  });
});

// Endpoint to save mood and text
app.post('/saveMood', (req, res) => {
  const { userId, day, mood, text } = req.body;
  const sql = 'INSERT INTO mood_entries (user_id, day, mood, text, is_frozen) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE mood = VALUES(mood), text = VALUES(text), is_frozen = VALUES(is_frozen)';
  db.query(sql, [userId, day, mood, text, true], (err, result) => {
    if (err) {
      console.error('Error saving mood and text:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Mood and text saved successfully');
  });
});

// Endpoint to get mood and text for a user
app.get('/getMoodData', (req, res) => {
  const { userId } = req.query;
  const sql = 'SELECT day, mood, text, is_frozen FROM mood_entries WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching mood data:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(results);
  });
});


// Endpoint to save morning routine text
app.post('/saveMorningRoutine', (req, res) => {
  const { userId, day, text } = req.body;
  const sql = 'INSERT INTO morning_routines (user_id, day, text, is_frozen) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE text = VALUES(text), is_frozen = VALUES(is_frozen)';
  db.query(sql, [userId, day, text, true], (err, result) => {
    if (err) {
      console.error('Error saving morning routine text:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Morning routine saved successfully');
  });
});

// Endpoint to get morning routine for a user
app.get('/getMorningRoutine', (req, res) => {
  const { userId } = req.query;
  const sql = 'SELECT day, text, is_frozen FROM morning_routines WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching morning routine data:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(results);
  });
});


// Endpoint to save food journal entry
app.post('/saveFoodJournal', (req, res) => {
  const { userId, day, hadJunk, carbs, fats, proteins } = req.body;
  const sql = 'INSERT INTO food_journal (user_id, day, had_junk, carbs, fats, proteins, is_frozen) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE had_junk = VALUES(had_junk), carbs = VALUES(carbs), fats = V/ALUES(fats), proteins = VALUES(proteins), is_frozen = VALUES(is_frozen)';
  db.query(sql, [userId, day, hadJunk, carbs, fats, proteins, true], (err, result) => {
    if (err) {
      console.error('Error saving food journal entry:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Food journal entry saved successfully');
  });
});

// Endpoint to get food journal entries for a user
app.get('/getFoodJournal', (req, res) => {
  const { userId } = req.query;
  const sql = 'SELECT day, had_junk, carbs, fats, proteins, is_frozen FROM food_journal WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching food journal data:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(results);
  });
});

 



// Endpoint to save study content
app.post('/saveStudyContent', (req, res) => {
  const { userId, day, content, time_set, is_frozen } = req.body;
  console.log('Received data:', req.body); // Log the received data

  const sql = 'INSERT INTO study_entries (user_id, day, content, time_set, is_frozen) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content), time_set = VALUES(time_set), is_frozen = VALUES(is_frozen)';
  db.query(sql, [userId, day, content, time_set, is_frozen], (err, result) => {
    if (err) {
      console.error('Error saving study content and timer:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Study content and timer saved successfully');
  });
});

// Endpoint to get study content for a user
app.get('/getStudyContent', (req, res) => {
  const { userId } = req.query;
  const sql = 'SELECT day, content, is_frozen FROM study_entries WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching study content:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(results);
  });
});



 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});