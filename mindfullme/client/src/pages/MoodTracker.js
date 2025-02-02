import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const MoodTracker = () => {
  const userId = localStorage.getItem('userId'); 
  const [moods, setMoods] = useState(Array(30).fill(''));
  const [texts, setTexts] = useState(Array(30).fill(''));
  const [isFrozen, setIsFrozen] = useState(Array(30).fill(false));
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getMoodData', {
          params: { userId }
        });
        const moodData = response.data;
        const newMoods = Array(30).fill('');
        const newTexts = Array(30).fill('');
        const newIsFrozen = Array(30).fill(false);

        moodData.forEach(entry => {
          const index = entry.day - 1;
          newMoods[index] = entry.mood;
          newTexts[index] = entry.text;
          newIsFrozen[index] = entry.is_frozen;
        });

        setMoods(newMoods);
        setTexts(newTexts);
        setIsFrozen(newIsFrozen);

        const now = new Date().getTime();
        let dayIndex = 0;
        for (let i = 0; i < newIsFrozen.length; i++) {
          if (!newIsFrozen[i] || now - new Date(newTexts[i].timestamp).getTime() < 24 * 60 * 60 * 1000) {
            break;
          }
          dayIndex = i + 1;
        }
        setCurrentDay(dayIndex);

      } catch (err) {
        console.error('Error fetching mood data:', err);
      }
    };

    fetchMoodData();
  }, [userId]);

  const handleMoodChange = (index, mood) => {
    const newMoods = [...moods];
    newMoods[index] = mood;
    setMoods(newMoods);
  };

  const handleTextChange = (index, text) => {
    const newTexts = [...texts];
    newTexts[index] = text;
    setTexts(newTexts);
  };

  const handleSave = async (index) => {
    const newIsFrozen = [...isFrozen];
    newIsFrozen[index] = true;
    setIsFrozen(newIsFrozen);

    try {
      await axios.post('http://localhost:5000/saveMood', {
        userId,
        day: index + 1,
        mood: moods[index],
        text: texts[index]
      });

      localStorage.setItem('moods', JSON.stringify(moods));
      localStorage.setItem('texts', JSON.stringify(texts));
      localStorage.setItem('isFrozen', JSON.stringify(newIsFrozen));

      setCurrentDay(index + 1);
    } catch (err) {
      console.error('Error saving mood and text:', err);
      alert('Failed to save mood and text. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mood Tracker</h2>
      <Link to="/dashboard" className="btn btn-secondary mb-3">View Dashboard</Link>
      <div className="row">
        {Array.from({ length: 30 }, (_, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className={`card ${index <= currentDay ? 'card-bg-enabled' : 'card-bg-disabled'} shadow`} style={{ backgroundColor: isFrozen[index] ? 'green' : 'white' }}>
              <div className="card-body">
                <h5 className="card-title">Day {index + 1}</h5>
                {index <= currentDay ? (
                  <>
                    <select
                      className="form-control mb-2"
                      value={moods[index]}
                      onChange={(e) => handleMoodChange(index, e.target.value)}
                      disabled={isFrozen[index]}
                    >
                      <option value="">Select your mood</option>
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="neutral">Neutral</option>
                      <option value="excited">Excited</option>
                      <option value="anxious">Anxious</option>
                    </select>
                    <textarea
                      className="form-control mb-2"
                      placeholder="Write about your day (30 words)"
                      value={texts[index]}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      disabled={isFrozen[index]}
                      maxLength={150}
                    />
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleSave(index)}
                      disabled={isFrozen[index]}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <p className="text-muted">This card will unlock in 24 hours</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
