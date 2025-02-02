import React, { useState, useEffect } from 'react';
import './style.css'; // Import the CSS file for custom styles

const beautyTips = [
  "Drink plenty of water to stay hydrated.",
  "Always remove your makeup before going to bed.",
  "Use sunscreen every day to protect your skin.",
  "Exfoliate your skin regularly to remove dead skin cells.",
  "Get enough sleep to keep your skin looking fresh.",
  "Eat a balanced diet rich in fruits and vegetables.",
  "Moisturize your skin daily to keep it soft and supple.",
  "Exercise regularly to improve blood circulation.",
  "Avoid smoking and excessive alcohol consumption.",
  "Use a gentle cleanser to wash your face."
];

const ScratchCard = () => {
  const [scratched, setScratched] = useState(Array(30).fill(false));
  const [tips, setTips] = useState(Array(30).fill(''));
  const [followed, setFollowed] = useState(Array(30).fill(null));
  const [enableFollowed, setEnableFollowed] = useState(Array(30).fill(false));

  const handleScratch = (index) => {
    const newScratched = [...scratched];
    const newTips = [...tips];
    newScratched[index] = true;
    newTips[index] = beautyTips[Math.floor(Math.random() * beautyTips.length)];
    setScratched(newScratched);
    setTips(newTips);

    // Enable the follow-up question after 5 minutes
    setTimeout(() => {
      const newEnableFollowed = [...enableFollowed];
      newEnableFollowed[index] = true;
      setEnableFollowed(newEnableFollowed);
    }, 300000); // 5 minutes in milliseconds
  };

  const handleFollowedChange = (index, value) => {
    const newFollowed = [...followed];
    newFollowed[index] = value;
    setFollowed(newFollowed);
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Scratch to Reveal Your Beauty Tip</h2>
      <div className="row">
        {Array.from({ length: 30 }, (_, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div 
              className={`card ${scratched[index] ? 'revealed' : 'hidden'}`} 
              onClick={() => handleScratch(index)}
            >
              <div className="card-body">
                {scratched[index] ? (
                  <>
                    <p className="card-text">{tips[index]}</p>
                    {enableFollowed[index] && (
                      <div className="follow-up">
                        <p>Did you follow the tip?</p>
                        <button 
                          className={`btn ${followed[index] === true ? 'btn-success' : 'btn-outline-success'}`} 
                          onClick={() => handleFollowedChange(index, true)}
                        >
                          Yes
                        </button>
                        <button 
                          className={`btn ${followed[index] === false ? 'btn-danger' : 'btn-outline-danger'}`} 
                          onClick={() => handleFollowedChange(index, false)}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="card-text">Scratch to reveal today's tip!</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScratchCard;