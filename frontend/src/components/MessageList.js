import React from 'react';
export default function MessageList({messages}) {
  return <div className="message-list">
    {messages.map(m => (
      <div key={m.id} className={`message ${m.from==='user'?'message-user':'message-bot'}`}>
        <div className="message-text">{m.text}</div>
      </div>
    ))}
  </div>
}