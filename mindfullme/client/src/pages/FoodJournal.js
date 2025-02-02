import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import the CSS file for custom styles

const FoodJournal = () => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
  const [entries, setEntries] = useState(Array(30).fill({ hadJunk: false, carbs: 0, fats: 0, proteins: 0 }));
  const [isFrozen, setIsFrozen] = useState(Array(30).fill(false));
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    // Fetch food journal data for the logged-in user
    const fetchFoodJournalData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getFoodJournal', {
          params: { userId }
        });
        const journalData = response.data;
        const newEntries = Array(30).fill({ hadJunk: false, carbs: 0, fats: 0, proteins: 0 });
        const newIsFrozen = Array(30).fill(false);

        journalData.forEach(entry => {
          const index = entry.day - 1;
          newEntries[index] = {
            hadJunk: entry.had_junk,
            carbs: entry.carbs,
            fats: entry.fats,
            proteins: entry.proteins
          };
          newIsFrozen[index] = entry.is_frozen;
        });

        setEntries(newEntries);
        setIsFrozen(newIsFrozen);

        // Determine the current day based on the `is_frozen` status
        const now = new Date().getTime();
        let dayIndex = 0;
        for (let i = 0; i < newIsFrozen.length; i++) {
          if (!newIsFrozen[i]) {
            break;
          }
          dayIndex = i + 1;
        }
        setCurrentDay(dayIndex);

      } catch (err) {
        console.error('Error fetching food journal data:', err);
      }
    };

    fetchFoodJournalData();
  }, [userId]);

  const handleInputChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const handleSave = async (index) => {
    const newIsFrozen = [...isFrozen];
    newIsFrozen[index] = true;
    setIsFrozen(newIsFrozen);

    try {
      const entry = entries[index];
      await axios.post('http://localhost:5000/saveFoodJournal', {
        userId,
        day: index + 1,
        hadJunk: entry.hadJunk,
        carbs: entry.carbs,
        fats: entry.fats,
        proteins: entry.proteins
      });

      // Update local storage
      localStorage.setItem('entries', JSON.stringify(entries));
      localStorage.setItem('isFrozen', JSON.stringify(newIsFrozen));

      setCurrentDay(index + 1);
    } catch (err) {
      console.error('Error saving food journal entry:', err);
      alert('Failed to save food journal entry. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Food Journal</h2>
      <div className="text-center mb-4">
        <Link to="/dashboardF" className="btn btn-primary">View Dashboard</Link>
      </div>
      <div className="row">
        {Array.from({ length: 30 }, (_, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className={`card ${index <= currentDay ? 'card-bg-enabled' : 'card-bg-disabled'} shadow`} style={{ backgroundColor: isFrozen[index] ? 'green' : 'white' }}>
              <div className="card-body">
                <h5 className="card-title">Day {index + 1}</h5>
                {index <= currentDay ? (
                  <>
                    <div className="form-group">
                      <label className="d-inline mr-2">Had Junk Food?</label>
                      <div className="d-inline">
                        <label className="radio-inline mr-2">
                          <input
                            type="radio"
                            name={`hadJunk-${index}`}
                            value="true"
                            checked={entries[index].hadJunk === true}
                            onChange={(e) => handleInputChange(index, 'hadJunk', true)}
                            disabled={isFrozen[index]}
                          /> Yes
                        </label>
                        <label className="radio-inline">
                          <input
                            type="radio"
                            name={`hadJunk-${index}`}
                            value="false"
                            checked={entries[index].hadJunk === false}
                            onChange={(e) => handleInputChange(index, 'hadJunk', false)}
                            disabled={isFrozen[index]}
                          /> No
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="d-inline mr-2">Carbs (g)</label>
                      <input
                        type="number"
                        className="form-control d-inline w-50"
                        value={entries[index].carbs}
                        onChange={(e) => handleInputChange(index, 'carbs', parseInt(e.target.value))}
                        disabled={isFrozen[index]}
                      />
                    </div>
                    <div className="form-group">
                      <label className="d-inline mr-2">Fats (g)</label>
                      <input
                        type="number"
                        className="form-control d-inline w-50"
                        value={entries[index].fats}
                        onChange={(e) => handleInputChange(index, 'fats', parseInt(e.target.value))}
                        disabled={isFrozen[index]}
                      />
                    </div>
                    <div className="form-group">
                      <label className="d-inline mr-2">Proteins (g)</label>
                      <input
                        type="number"
                        className="form-control d-inline w-50"
                        value={entries[index].proteins}
                        onChange={(e) => handleInputChange(index, 'proteins', parseInt(e.target.value))}
                        disabled={isFrozen[index]}
                      />
                    </div>
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

export default FoodJournal;