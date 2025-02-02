const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock database
let moodEntries = [];

// Endpoint to log mood
app.post('/mood', (req, res) => {
    const { mood, notes, date } = req.body;
    moodEntries.push({ mood, notes, date });
    res.status(201).json({ message: 'Mood logged successfully!' });
});

// Endpoint to get all mood entries
app.get('/moods', (req, res) => {
    res.json(moodEntries);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});