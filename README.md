# MindfullMe

Welcome to MindfullMe, your go-to platform for mindfulness and mental well-being. Our mission is to provide resources, tools, and guidance to help individuals practice mindfulness and achieve a balanced life.

## Features

- **Mindfulness Exercises**: Simple exercises to practice mindfulness in everyday life.
- **Daily Tips**: Tips and advice for incorporating mindfulness into your daily routine.
- **Progress Tracking**: Track your mindfulness practice and progress over time.
- **Social media detoxing**: The user can detox the social media.

## Getting Started

To get started with MindfullMe, follow these steps:

1. **Sign Up**: Create a free account on our website.
2. **Explore**: Browse through our library of guided meditations and mindfulness exercises.
3. **Track Progress**: Use our progress tracking tools to monitor your journey.

This was all about the mindfulle 

## **The database tables:**

1.CREATE DATABASE mindfullme;

2.use mindfullme;

3.CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     
4.CREATE TABLE morning_routines (
    user_id INT NOT NULL,
    day INT NOT NULL,
    text TEXT,
    is_frozen BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, day),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

5.CREATE TABLE mood_entries (
    user_id INT NOT NULL,
    day INT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    text TEXT,
    is_frozen BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, day)
);


(if u encounter any errors in creation of the tables in the databases, make sure you refer the "index.js in the server")








 ## OUTPUT

 **HOME PAGE**

 ![Screenshot 2024-12-31 091609](https://github.com/user-attachments/assets/8a04a167-1508-4362-a91a-925da32a17c8)


**SIGNIN PAGE**

![Screenshot 2024-12-31 092249](https://github.com/user-attachments/assets/c2456a94-c3ae-4c3f-ad5f-e5405af527ad)


**PROFILE OF THE USER**

![Screenshot 2025-01-29 233417](https://github.com/user-attachments/assets/99809d0c-8e23-4fb1-a4f5-dcceb77b17c7)


**TRACKING**

![Screenshot 2024-12-27 224830](https://github.com/user-attachments/assets/7980561d-a0ce-4e47-bc69-40766dc1b943)


**DATABASE EXAMPLE**

![Screenshot 2025-01-07 133347](https://github.com/user-attachments/assets/ad6115c4-19c7-4bb4-911c-af835c359e81)



 
