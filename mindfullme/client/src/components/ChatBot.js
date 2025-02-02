import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      setTimeout(() => {
        const response = getBotResponse(input);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: response, sender: 'bot' }
        ]);
      }, 1000);
    }
  };

  const getBotResponse = (input) => {
    const lowerCaseInput = input.toLowerCase();

    switch (true) {
      case lowerCaseInput.includes('how are you'):
        return "I'm doing great! How about you?";
      case lowerCaseInput.includes('what can you do'):
        return "I can chat with you, provide information, and assist with various tasks.";
      case lowerCaseInput.includes('tell me a joke'):
        return "Why don't scientists trust atoms? Because they make up everything!";
      case lowerCaseInput.includes('thank you'):
        return "You're welcome! Let me know if there's anything else I can help with.";
      case lowerCaseInput.includes('bye'):
        return "Goodbye! Have a great day!";
      default:
        return "I'm just a simple bot. How can I assist you further?";
    }
  };

  return (
    <div className="chatbot-container" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '10px' }}>Docty Bot</h2>
      <div className="chatbot-messages" style={{ flex: 1, marginBottom: '10px', maxHeight: '300px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.sender}`} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right', margin: '5px 0' }}>
            <p style={{
              display: 'inline-block',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: message.sender === 'bot' ? '#e0e0e0' : '#007bff',
              color: message.sender === 'bot' ? '#000' : '#fff',
              margin: 0,
              maxWidth: '75%',
              wordWrap: 'break-word'
            }}>
              {message.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="chatbot-input"
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} className="chatbot-send-button" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', marginLeft: '10px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;