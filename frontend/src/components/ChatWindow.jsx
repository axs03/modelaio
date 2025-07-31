/*
================================================================================
| FILE: src/components/ChatWindow.jsx
| DESCRIPTION: The main chat area, including messages and the input form.
================================================================================
*/
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { SendIcon } from './Icons';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI assistant MR DORK. How can I help you today?",
            sender: 'ai',
            timestamp: '2:23:50 AM',
        },
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        const userMessage = { id: Date.now(), text: input, sender: 'user', timestamp };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');

        // --- Backend Integration Point ---
        setTimeout(() => {
            const aiResponse = { id: Date.now() + 1, text: `This is a simulated response to: "${userMessage.text}"`, sender: 'ai', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) };
            setMessages((prevMessages) => [...prevMessages, aiResponse]);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col flex-1 bg-black/10 backdrop-blur-lg">
            <header className="p-6 border-b border-white/10">
                <h1 className="text-xl font-semibold text-white">Chat</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-6 bg-gray-800/50 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="w-full bg-gray-900/50 border border-white/10 rounded-lg py-3 pl-4 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatWindow;