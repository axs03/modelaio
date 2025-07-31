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
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg ${isAI ? 'bg-blue-600' : 'bg-gray-600'}`}>
        {isAI ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`max-w-xl p-4 rounded-lg shadow-md ${isAI ? 'bg-gray-800/60 backdrop-blur-sm text-gray-200 border border-white/10' : 'bg-blue-600 text-white'}`}>
        <p className="leading-relaxed">{message.text}</p>
        <p className={`text-xs mt-2 text-right ${isAI ? 'text-gray-400' : 'text-blue-200'}`}>{message.timestamp}</p>
      </div>
    </div>
  );
};

export default ChatMessage;