import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import the CSS file for custom styles

const DashboardF = () => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
  const [entries, setEntries] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState('');
  const [showNutrientOptions, setShowNutrientOptions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch food journal data for the logged-in user
    const fetchFoodJournalData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getFoodJournal', {
          params: { userId }
        });
        setEntries(response.data);
      } catch (err) {
        console.error('Error fetching food journal data:', err);
        setError('Failed to fetch food journal data. Please try again later.');
      }
    };

    fetchFoodJournalData();
  }, [userId]);

  const suggestions = {
    carbs: "Aim for complex carbohydrates like whole grains and vegetables instead of simple carbs.",
    fats: "Focus on healthy fats such as those from nuts, seeds, and avocados.",
    proteins: "Include a variety of protein sources, including lean meats, beans, and legumes."
  };

  const chartData = entries.map((entry, index) => ({
    day: index + 1,
    carbs: entry.carbs,
    fats: entry.fats,
    proteins: entry.proteins
  }));

  const filteredData = selectedNutrient ? entries.filter(entry => entry[selectedNutrient] > 0) : [];

  const handleNutrientSelection = (nutrient) => {
    setSelectedNutrient(nutrient);
    setShowNutrientOptions(false);
  };

  const handleCardClick = () => {
    setShowNutrientOptions(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Food Journal Analysis</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {entries.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="carbs" stroke="#8884d8" />
              <Line type="monotone" dataKey="fats" stroke="#82ca9d" />
              <Line type="monotone" dataKey="proteins" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>

          <div className="d-flex justify-content-center mt-4">
            <div className="card-container text-center">
              {!showNutrientOptions ? (
                <div className="card mb-3 shadow border-primary card-square" onClick={handleCardClick}>
                  <div className="card-body">
                    <h5 className="card-title">Track Your Nutrients...</h5>
                    <p className="card-text">Select a nutrient to see more details.</p>
                  </div>
                </div>
              ) : (
                <div className="card mb-3 shadow border-primary card-square">
                  <div className="card-body">
                    <h5 className="card-title">Choose a Nutrient</h5>
                    <div className="btn-group-vertical">
                      <button className="btn btn-primary mb-2" onClick={() => handleNutrientSelection('carbs')}>Carbs</button>
                      <button className="btn btn-primary mb-2" onClick={() => handleNutrientSelection('fats')}>Fats</button>
                      <button className="btn btn-primary" onClick={() => handleNutrientSelection('proteins')}>Proteins</button>
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
                  <h3 className="text-center">Analysis of {selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1)} Intake</h3>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Amount (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((entry, index) => (
                        <tr key={index}>
                          <td>Day {index + 1}</td>
                          <td>{entry[selectedNutrient]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-center">
                    <h4>Suggestion</h4>
                    <p>{suggestions[selectedNutrient]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">No food data available.</p>
      )}
    </div>
  );
};

export default DashboardF;