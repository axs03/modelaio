/*
================================================================================
| FILE: src/components/ChatWindow.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState, useRef, useEffect } from 'react';
import MultiModelResponse from './MultiModelResponse';
import { SendIcon, UserIcon, BotIcon } from './Icons';

const TypingIndicator = () => (
    <div className="flex items-start gap-4 animate-fade-in">
        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg bg-purple-600">
            <BotIcon />
        </div>
        <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-800/60 backdrop-blur-sm text-gray-200 border border-white/10">
            <div className="flex items-center justify-center space-x-1 h-6">
                <span className="dot animate-dot-bounce"></span>
                <span className="dot animate-dot-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="dot animate-dot-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    </div>
);

const UserMessage = ({ message }) => (
    <div className="flex items-start gap-4 flex-row-reverse">
        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg bg-gray-600">
            <UserIcon />
        </div>
        <div className="max-w-xl p-4 rounded-lg shadow-md bg-purple-600 text-white">
            <p className="leading-relaxed">{message.text}</p>
            <p className="text-xs mt-2 text-right text-purple-200">{message.timestamp}</p>
        </div>
    </div>
);


const ChatWindow = ({ enabledModelsCount, enabledModelNames, baselineModelName, messages, setMessages, setSidebarView }) => {
    const [input, setInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); // NEW state for tooltip visibility
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAiTyping]);

    const handleSend = () => {
        if (input.trim() === '' || enabledModelsCount < 2) return;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        const userMessage = { id: Date.now(), text: input, sender: 'user', timestamp };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsAiTyping(true);

        setTimeout(() => {
            const multiModelResponse = {
                id: Date.now() + 1,
                sender: 'ai',
                type: 'multi-model',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                summary: `${enabledModelsCount} AI model${enabledModelsCount > 1 ? 's have' : ' has'} responded to your question. You can view their responses and similarity scores below.`,
                overallSimilarity: 71,
                baselineModel: baselineModelName,
                responses: enabledModelNames.map(name => ({
                    model: name,
                    response: `${name}'s response to: "${userMessage.text}". This is a placeholder answer with some detail.`,
                    similarity: Math.floor(Math.random() * (95 - 60 + 1) + 60)
                }))
            };

            setIsAiTyping(false);
            setMessages([...messages, userMessage, multiModelResponse]);
        }, 2500);
    };

    // --- UPDATED: Logic to show tooltip on Enter press ---
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isAiTyping || enabledModelsCount < 2 || !baselineModelName) {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 5000); // 5 seconds
            } else {
                handleSend();
            }
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-black/10 backdrop-blur-lg">
            <header className="p-6 border-b border-white/10 flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Chat</h1>
                {enabledModelsCount > 0 && (
                    <span className="text-sm bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full">
                        {enabledModelsCount} model{enabledModelsCount > 1 && 's'} enabled
                    </span>
                )}
                {baselineModelName && (
                    <span className="text-sm bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full">
                        Baseline Model: {baselineModelName}
                    </span>
                )}
            </header>
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {messages.map((msg) => {
                    if (msg.sender === 'user') {
                        return <UserMessage key={msg.id} message={msg} />;
                    }
                    if (msg.type === 'multi-model') {
                        return <MultiModelResponse key={msg.id} message={msg} />;
                    }
                    return null;
                })}
                {isAiTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-6 bg-gray-800/50 border-t border-white/10">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={enabledModelsCount > 0 ? "Type your message here..." : "Enable a model in settings to start chatting"}
                        className="flex-1 bg-gray-900/50 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isAiTyping || enabledModelsCount === 0}
                    />
                    <div className="relative group">
                        <button
                            onClick={handleSend}
                            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            disabled={isAiTyping || enabledModelsCount < 2 || !baselineModelName}
                        >
                            <SendIcon />
                        </button>
                        <div className={`absolute bottom-full right-0 mb-2 mr-2 w-64 px-3 py-1.5 text-sm text-white bg-gray-900 border border-white/10 rounded-md transition-opacity duration-1200 ${showTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                            }`}
                        >
                            Make sure you have a baseline model selected along with two or more models. You can navigate to the <button onClick={() => setSidebarView('settings')} className="text-purple-400 underline hover:text-purple-300">settings</button> menu.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatWindow;
