import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import the CSS file for custom styles and animations

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [username, setUsername] = useState(userName || 'User');
  const [isSmileyMoved, setIsSmileyMoved] = useState(false);
  const [showPartyBlast, setShowPartyBlast] = useState(false);

  const cards = [
    { id: 1, title: 'Mood Tracker', path: '/mood-tracker', description: 'How are you feeling today...?', bgClass: 'card-bg1' },
    { id: 2, title: 'Food Journal', path: '/food-journal', description: 'What did you eat...?', bgClass: 'card-bg2' },
    { id: 3, title: 'Study', path: '/study', description: 'What did you study...?', bgClass: 'card-bg3' },
    { id: 4, title: 'Self Care', path: '/self-care', description: "Today's Tip", bgClass: 'card-bg4' },
    { id: 5, title: 'Morning Routine', path: '/morning-routine', description: 'What did you do this morning...?', bgClass: 'card-bg5' },
    { id: 6, title: 'Social Media Detox', path: '/social-media-detox', description: 'Your Screentime..!', bgClass: 'card-bg6' },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (!userName) {
      axios.get(`http://localhost:5000/api/user/${userId}`)
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }

    const timer = setTimeout(() => {
      setIsSmileyMoved(true);
      setShowPartyBlast(true);
      setTimeout(() => {
        setShowPartyBlast(false);
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [userId, userName]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4" style={{
        margin: '20px',
        marginTop: '10px',
        paddingTop: '100px',
        fontSize: '30px'
      }}>
        Welcome, {username}! Happy to see you again...
        {isSmileyMoved && <span className="smiley-inline">😊</span>}
      </h1>
      {!isSmileyMoved && <div className="smiley">😊</div>}
      <div className="row mt-4">
        {cards.map((card) => (
          <div key={card.id} className="col-12 col-md-4 mb-3">
            <div className={`card shadow ${card.bgClass}`} onClick={() => handleCardClick(card.path)}>
              <div className="overlay"></div>
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}