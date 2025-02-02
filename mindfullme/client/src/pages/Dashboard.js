import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
  const [moodData, setMoodData] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [error, setError] = useState('');
  const [showMoodOptions, setShowMoodOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getMoodData', {
          params: { userId }
        });
        console.log('Fetched mood data:', response.data); // Log data for debugging
        setMoodData(response.data);
      } catch (error) {
        console.error('Error fetching mood data:', error);
        setError('Failed to fetch mood data. Please try again later.');
      }
    };
    fetchData();
  }, [userId]);

  const suggestions = {
    happy: "Keep doing what makes you happy! Try to maintain a balance and enjoy the little things.",
    sad: "Consider talking to a friend or a therapist about what's bothering you. Engage in activities that you enjoy to lift your mood.",
    neutral: "Try to engage in activities that bring you joy or relaxation. Keep a positive outlook.",
    excited: "Channel your excitement into productive activities. Share your excitement with friends and family.",
    anxious: "Practice relaxation techniques such as deep breathing, meditation, or yoga. Break down tasks into smaller steps to manage stress better."
  };

  const moodMapping = {
    happy: 5,
    excited: 4,
    neutral: 3,
    sad: 2,
    anxious: 1
  };

  const chartData = moodData.map(entry => ({
    ...entry,
    moodValue: moodMapping[entry.mood]
  }));

  const filteredData = selectedMood ? moodData.filter(entry => entry.mood === selectedMood) : [];

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    setShowMoodOptions(false);
  };

  const handleCardClick = () => {
    setShowMoodOptions(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Mood Analysis</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {moodData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis 
                domain={[1, 5]}  // Ensure the Y-axis covers the range of mood values
                ticks={[1, 2, 3, 4, 5]}  // Display ticks for each mood value
                tickFormatter={(value) => {
                  // Format the Y-axis labels to show mood names
                  const moodNames = {
                    1: 'Anxious',
                    2: 'Sad',
                    3: 'Neutral',
                    4: 'Excited',
                    5: 'Happy'
                  };
                  return moodNames[value];
                }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moodValue" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="d-flex justify-content-center mt-4">
            <div className="card-container text-center">
              {!showMoodOptions ? (
                <div className="card mb-3 shadow border-primary card-square" onClick={handleCardClick}>
                  <div className="card-body" >
                    <h5 className="card-title">Track Yourself by clicking me..!</h5>
                    <p className="card-text">Select a mood to see more details.</p>
                  </div>
                </div>
              ) : (
                <div className="card mb-3 shadow border-primary card-square">
                  <div className="card-body">
                    <h5 className="card-title">Choose a Mood</h5>
                    <div className="btn-group-vertical">
                      <button className="btn btn-primary mb-2" onClick={() => handleMoodSelection('happy')}>Happy</button>
                      <button className="btn btn-primary mb-2" onClick={() => handleMoodSelection('sad')}>Sad</button>
                      <button className="btn btn-primary mb-2" onClick={() => handleMoodSelection('neutral')}>Neutral</button>
                      <button className="btn btn-primary mb-2" onClick={() => handleMoodSelection('excited')}>Excited</button>
                      <button className="btn btn-primary" onClick={() => handleMoodSelection('anxious')}>Anxious</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              {filteredData.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-center">Analysis of {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Days</h3>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((entry, index) => (
                        <tr key={index}>
                          <td>Day {entry.day}</td>
                          <td>{entry.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-center">
                    <h4>Suggestion</h4>
                    <p>{suggestions[selectedMood]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">No mood data available.</p>
      )}
    </div>
  );
};

export default Dashboard;