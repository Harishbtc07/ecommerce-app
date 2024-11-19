import React, { useState } from 'react';
import '../App.css'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === '') return;

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);

    // Send the message to the backend
    try {
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: data.reply },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, I couldn’t understand that.' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'An error occurred. Please try again later.' },
      ]);
    }

    setUserInput(''); // Clear input field after sending
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Customer Support Chatbot</h3>
      </div>
      <div className="chatbot-body">
        {messages.length === 0 ? (
          <p>Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="chatbot-footer">
        <form onSubmit={handleMessageSubmit}>
          <input
            type="text"
            placeholder="Ask me anything..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
