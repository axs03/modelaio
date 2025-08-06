/*
================================================================================
| FILE: src/components/ChatWindow.jsx
| ACTION: Replace the entire content of this file with the code below.
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
    const [isAiTyping, setIsAiTyping] = useState(false); // NEW state for loading animation
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAiTyping]); // Scroll to bottom when AI starts typing too

    const handleSend = () => {
        if (input.trim() === '') return;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        const userMessage = { id: Date.now(), text: input, sender: 'user', timestamp };

        // Add user message and immediately show the loader
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsAiTyping(true);

        // --- Backend Integration Point ---
        // Simulate a delay for the AI response
        setTimeout(() => {
            const aiResponse = { id: Date.now() + 1, text: `This is a simulated response to: "${userMessage.text}"`, sender: 'ai', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) };

            // Hide the loader and then add the AI's message
            setIsAiTyping(false);
            setMessages((prevMessages) => [...prevMessages, aiResponse]);
        }, 2000); // Increased delay to make animation noticeable
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
                {/* Conditionally render the typing indicator */}
                {isAiTyping && <ChatMessage isTyping={true} />}
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
                        disabled={isAiTyping} // Optionally disable input while AI is typing
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        disabled={isAiTyping} // Optionally disable button while AI is typing
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatWindow;