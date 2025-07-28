/*
================================================================================
| FILE: src/components/ChatMessage.jsx
| DESCRIPTION: Displays a single chat message bubble.
================================================================================
*/
import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAI ? 'bg-purple-600' : 'bg-gray-500'}`}>
        {isAI ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
      </div>
      <div className={`max-w-lg p-4 rounded-xl ${isAI ? 'bg-[#2a2b2f] rounded-tl-none' : 'bg-blue-600 rounded-br-none'}`}>
        <p className="text-white">{message.text}</p>
        <p className="text-xs text-gray-400 mt-2 text-right">{message.timestamp}</p>
      </div>
    </div>
  );
};

export default ChatMessage;