import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import the CSS file for custom styles

const StudyTracker = () => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
  const [contents, setContents] = useState(Array(30).fill('')); // Array to store study content for each day
  const [studyTimes, setStudyTimes] = useState(Array(30).fill('')); // Array to store study times for each day
  const [isFrozen, setIsFrozen] = useState(Array(30).fill(false)); // Array to track if each day's content is frozen
  const [timer, setTimer] = useState(''); // Timer input
  const [timeLeft, setTimeLeft] = useState(null); // Time left for the countdown timer
  const timerRef = useRef(null);

  useEffect(() => {
    // Fetch study content and times for the logged-in user
    const fetchStudyData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getStudyContent', {
          params: { userId }
        });
        const studyData = response.data;

        const newContents = Array(30).fill('').map((_, dayIndex) => {
          const dayContent = studyData.find(content => content.day === dayIndex + 1);
          return dayContent ? dayContent.content : '';
        });

        const newStudyTimes = Array(30).fill('').map((_, dayIndex) => {
          const dayTime = studyData.find(content => content.day === dayIndex + 1);
          return dayTime ? dayTime.study_time : '';
        });

        const newIsFrozen = Array(30).fill(false).map((_, dayIndex) => {
          return studyData.some(content => content.day === dayIndex + 1 && content.is_frozen);
        });

        setContents(newContents);
        setStudyTimes(newStudyTimes);
        setIsFrozen(newIsFrozen);
      } catch (err) {
        console.error('Error fetching study content:', err);
      }
    };

    fetchStudyData();
  }, [userId]);

  const handleContentChange = (dayIndex, content) => {
    const newContents = [...contents];
    newContents[dayIndex] = content;
    setContents(newContents);
  };

  const handleStudyTimeChange = (dayIndex, time) => {
    const newStudyTimes = [...studyTimes];
    newStudyTimes[dayIndex] = time;
    setStudyTimes(newStudyTimes);
  };

  const handleSave = async (dayIndex) => {
    const newIsFrozen = [...isFrozen];
    newIsFrozen[dayIndex] = true;
    setIsFrozen(newIsFrozen);

    try {
      await axios.post('http://localhost:5000/saveStudyContent', {
        userId,
        day: dayIndex + 1,
        content: contents[dayIndex],
        study_time: studyTimes[dayIndex],
        is_frozen: true
      });

      // Update local storage
      localStorage.setItem('contents', JSON.stringify(contents));
      localStorage.setItem('studyTimes', JSON.stringify(studyTimes));
      localStorage.setItem('isFrozen', JSON.stringify(newIsFrozen));

      alert('Study content and time saved successfully');
    } catch (err) {
      console.error('Error saving study content and time:', err);
      alert('Failed to save study content and time. Please try again.');
    }
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const startTimer = () => {
    const [hours, minutes] = timer.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    if (targetTime > now) {
      setTimeLeft(targetTime.getTime() - now.getTime());
    } else {
      alert('Please set a future time.');
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000);
      }, 1000);
    } else if (timeLeft === 0) {
      alert('Time is up!');
      setTimeLeft(null);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Study Tracker</h2>
      <div className="mb-4">
        <input
          type="time"
          className="form-control d-inline w-auto mr-2"
          value={timer}
          onChange={handleTimerChange}
        />
        <button className="btn btn-primary" onClick={startTimer}>
          Start Timer
        </button>
        {timeLeft !== null && <div className="mt-2">Time Left: {formatTimeLeft()}</div>}
      </div>
      <div className="list-group">
        {Array.from({ length: 30 }, (_, dayIndex) => (
          <div key={dayIndex} className="list-group-item">
            <h5 className="mb-3">Day {dayIndex + 1}</h5>
            <textarea
              className="form-control mb-3"
              placeholder="What did you study today?"
              value={contents[dayIndex]}
              onChange={(e) => handleContentChange(dayIndex, e.target.value)}
              disabled={isFrozen[dayIndex]}
              rows={3}
            />
            <input
              type="time"
              className="form-control mb-3"
              value={studyTimes[dayIndex]}
              onChange={(e) => handleStudyTimeChange(dayIndex, e.target.value)}
              disabled={isFrozen[dayIndex]}
            />
            <button className="btn btn-primary mr-2" onClick={() => handleSave(dayIndex)} disabled={isFrozen[dayIndex]}>
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyTracker;
