import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const SocialDetox = () => {
  const [challenges, setChallenges] = useState(Array(30).fill(false));
  const [journalEntries, setJournalEntries] = useState(Array(30).fill(''));
  
  const handleChallengeToggle = (index) => {
    const newChallenges = [...challenges];
    newChallenges[index] = !newChallenges[index];
    setChallenges(newChallenges);
  };

  const handleJournalChange = (index, text) => {
    const newEntries = [...journalEntries];
    newEntries[index] = text;
    setJournalEntries(newEntries);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Social Detox</h2>

      <div className="mb-4">
        <h4>Introduction</h4>
        <p>Taking a break from social media can help reduce stress, improve mental health, and increase productivity. Join us for a 30-day social detox challenge!</p>
      </div>

      <div className="mb-4">
        <h4>Daily Challenges</h4>
        <div className="list-group">
          {Array.from({ length: 30 }, (_, index) => (
            <div key={index} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <span>Day {index + 1}</span>
                <input
                  type="checkbox"
                  checked={challenges[index]}
                  onChange={() => handleChallengeToggle(index)}
                />
              </div>
              <textarea
                className="form-control mt-2"
                placeholder="Journal your experience..."
                value={journalEntries[index]}
                onChange={(e) => handleJournalChange(index, e.target.value)}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4>Inspirational Quotes</h4>
        <p>"Disconnect to reconnect." – Unknown</p>
        <p>"Almost everything will work again if you unplug it for a few minutes, including you." – Anne Lamott</p>
      </div>

      <div className="mb-4">
        <h4>Meditation and Relaxation</h4>
        <p><a href="https://www.youtube.com/watch?v=inpok4MKVLM" target="_blank" rel="noopener noreferrer">Guided Meditation</a></p>
      </div>

      <div className="mb-4">
        <h4>Resource Library</h4>
        <p><a href="https://www.goodreads.com/book/show/25346443-how-to-break-up-with-your-phone" target="_blank" rel="noopener noreferrer">How to Break Up with Your Phone</a></p>
      </div>
    </div>
  );
};

export default SocialDetox;
