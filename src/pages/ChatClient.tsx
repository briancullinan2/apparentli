import React, { useState, useEffect, useRef } from 'react';

export default function ChatClient() {
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !username.trim()) return;

    const message = {
      user: username,
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    };

    //setMessages(prev => [...prev, message]);
    setInput('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      if (!res.ok) {
        console.error('Failed to send message:', await res.text());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }

    // TODO: Send message to backend here
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') await sendMessage();
  };

  return (
    <div className="chat-container">
      <style>{`
        .chat-container {
          font-family: sans-serif;
          max-width: 600px;
          margin: 20px auto;
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 80vh;
        }
        .chat-header {
          background: #2c3e50;
          color: white;
          padding: 10px 15px;
        }
        .chat-body {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background: #f5f5f5;
        }
        .chat-footer {
          display: flex;
          flex-direction: column;
          padding: 10px;
          border-top: 1px solid #ccc;
          background: #fff;
        }
        .chat-inputs {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
          font-size: 14px;
        }
        button {
          padding: 8px 16px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .message {
          margin-bottom: 10px;
        }
        .message strong {
          color: #2c3e50;
        }
        .timestamp {
          font-size: 0.8em;
          color: #aaa;
          margin-left: 6px;
        }
      `}</style>

      <div className="chat-header">
        <h3>💬 React Chat</h3>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <strong>{msg.user}</strong>:
            <span> {msg.text}</span>
            <span className="timestamp">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <div className="chat-inputs">
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="chat-inputs">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}