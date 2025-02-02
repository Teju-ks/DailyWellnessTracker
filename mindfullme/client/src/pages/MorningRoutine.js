import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import the CSS file for custom styles

const MorningRoutine = () => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
  const [tasks, setTasks] = useState(Array(30).fill([])); // Array of arrays for each day's tasks
  const [currentDay, setCurrentDay] = useState(0); // Track the current day
  const [isFrozen, setIsFrozen] = useState(Array(30).fill(false)); // Array to track if each day's tasks are frozen

  useEffect(() => {
    // Fetch morning routine data for the logged-in user
    const fetchMorningRoutineData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getMorningRoutine', {
          params: { userId }
        });
        const routineData = response.data;

        const newTasks = Array(30).fill([]).map((_, dayIndex) => {
          const dayTasks = routineData.filter(task => task.day === dayIndex + 1);
          return dayTasks.map(task => ({ text: task.text, completed: task.completed }));
        });

        const newIsFrozen = Array(30).fill(false).map((_, dayIndex) => {
          return routineData.some(task => task.day === dayIndex + 1 && task.is_frozen);
        });

        setTasks(newTasks);
        setIsFrozen(newIsFrozen);

        // Determine the current day based on the `is_frozen` status
        let dayIndex = 0;
        for (let i = 0; i < newIsFrozen.length; i++) {
          if (!newIsFrozen[i]) {
            break;
          }
          dayIndex = i + 1;
        }
        setCurrentDay(dayIndex);

      } catch (err) {
        console.error('Error fetching morning routine data:', err);
      }
    };

    fetchMorningRoutineData();
  }, [userId]);

  const handleTextChange = (dayIndex, taskIndex, text) => {
    const newTasks = [...tasks];
    newTasks[dayIndex][taskIndex] = { ...newTasks[dayIndex][taskIndex], text };
    setTasks(newTasks);
  };

  const handleCompletionToggle = (dayIndex, taskIndex) => {
    const newTasks = [...tasks];
    newTasks[dayIndex][taskIndex] = { ...newTasks[dayIndex][taskIndex], completed: !newTasks[dayIndex][taskIndex].completed };
    setTasks(newTasks);
  };

  const addTask = (dayIndex) => {
    const newTasks = [...tasks];
    newTasks[dayIndex] = [...newTasks[dayIndex], { text: '', completed: false }];
    setTasks(newTasks);
  };

  const handleSave = async (dayIndex) => {
    const newIsFrozen = [...isFrozen];
    newIsFrozen[dayIndex] = true;
    setIsFrozen(newIsFrozen);

    try {
      await axios.post('http://localhost:5000/saveMorningRoutine', {
        userId,
        day: dayIndex + 1,
        tasks: tasks[dayIndex]
      });

      // Update local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('isFrozen', JSON.stringify(newIsFrozen));

      alert('Morning routine saved successfully');
      setCurrentDay(dayIndex + 1);
    } catch (err) {
      console.error('Error saving morning routine tasks:', err);
      alert('Failed to save morning routine tasks. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Good Morning! Here's Your Morning Routine</h2>
      <div className="list-group">
        {Array.from({ length: 30 }, (_, dayIndex) => (
          <div key={dayIndex} className="list-group-item">
            <h5 className="mb-3">Day {dayIndex + 1}</h5>
            {tasks[dayIndex].map((task, taskIndex) => (
              <div key={taskIndex} className="d-flex justify-content-between align-items-center mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="What did you do this morning?"
                  value={task.text}
                  onChange={(e) => handleTextChange(dayIndex, taskIndex, e.target.value)}
                  disabled={isFrozen[dayIndex]}
                  maxLength={150}
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                />
                <div className="form-check ml-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`completed-${dayIndex}-${taskIndex}`}
                    checked={task.completed}
                    onChange={() => handleCompletionToggle(dayIndex, taskIndex)}
                    disabled={isFrozen[dayIndex]}
                  />
                  <label className="form-check-label">
                    Completed
                  </label>
                </div>
              </div>
            ))}
            <button className="btn btn-secondary mb-2" onClick={() => addTask(dayIndex)} disabled={isFrozen[dayIndex]}>
              Add Task
            </button>
            <button className="btn btn-primary" onClick={() => handleSave(dayIndex)} disabled={isFrozen[dayIndex]}>
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MorningRoutine;