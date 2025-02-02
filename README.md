# MindfullMe

Welcome to MindfullMe, your go-to platform for mindfulness and mental well-being. Our mission is to provide resources, tools, and guidance to help individuals practice mindfulness and achieve a balanced life.

## Features

- **Guided Meditations**: A library of guided meditation sessions for different needs and levels.
- **Mindfulness Exercises**: Simple exercises to practice mindfulness in everyday life.
- **Daily Tips**: Tips and advice for incorporating mindfulness into your daily routine.
- **Progress Tracking**: Track your mindfulness practice and progress over time.

## Getting Started

To get started with MindfullMe, follow these steps:

1. **Sign Up**: Create a free account on our website.
2. **Explore**: Browse through our library of guided meditations and mindfulness exercises.
3. **Track Progress**: Use our progress tracking tools to monitor your journey.

This was all about the mindfulle 

**The database tables:**
CREATE DATABASE mindfullme;
use mindfullme;
 CREATE TABLE users (
    ->     id INT AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(255) NOT NULL,
    ->     email VARCHAR(255) NOT NULL UNIQUE,
    ->     password VARCHAR(255) NOT NULL,
    ->     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -> );
  CREATE TABLE morning_routines (
    user_id INT NOT NULL,
    day INT NOT NULL,
    text TEXT,
    is_frozen BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, day),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE mood_entries (
    user_id INT NOT NULL,
    day INT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    text TEXT,
    is_frozen BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, day)
);


(if u encounter any errors make sure u refer the "index.js in the server")

 
 
