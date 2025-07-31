/*
================================================================================
| FILE: src/components/ChatMessage.jsx
| DESCRIPTION: Displays a single chat message bubble.
================================================================================
*/
import React from 'react';
import { UserIcon, BotIcon } from './Icons';

const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex items-start gap-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isAI ? 'bg-indigo-600' : 'bg-gray-600'}`}>
        {isAI ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`max-w-xl p-4 rounded-lg shadow-md ${isAI ? 'bg-gray-700 text-gray-200' : 'bg-indigo-600 text-white'}`}>
        <p className="leading-relaxed">{message.text}</p>
        <p className="text-xs text-gray-400 mt-2 text-right">{message.timestamp}</p>
      </div>
    </div>
  );
};

export default ChatMessage;