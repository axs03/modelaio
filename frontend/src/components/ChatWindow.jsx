import React, { useState, useRef, useEffect } from 'react';
import MultiModelResponse from './MultiModelResponse';
import { SendIcon, UserIcon, BotIcon } from './Icons';
import { getModelResponse, getSimilarityScores } from '../services/api';

const TypingIndicator = () => (
    <div className="flex items-start gap-4 animate-fade-in">
        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 shadow-lg bg-purple-600">
            <BotIcon />
        </div>
        <div className="max-w-xl p-4 rounded-lg shadow-md bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/10">
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
        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 shadow-lg bg-gray-400 dark:bg-gray-600">
            <UserIcon />
        </div>
        <div className="max-w-xl p-4 rounded-lg shadow-md bg-purple-600 text-white">
            <p className="leading-relaxed">{message.text}</p>
            <p className="text-xs mt-2 text-right text-purple-200">{message.timestamp}</p>
        </div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="flex items-start gap-4 animate-fade-in">
        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 shadow-lg bg-red-600">
            <BotIcon />
        </div>
        <div className="max-w-xl p-4 rounded-lg shadow-md bg-red-100 dark:bg-red-900/30 backdrop-blur-sm text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700">
            <p className="leading-relaxed">{message.text}</p>
            <p className="text-xs mt-2 text-right opacity-70">{message.timestamp}</p>
        </div>
    </div>
);

const ChatWindow = ({ enabledModelsCount, enabledModelNames, baselineModelName, messages, setMessages, setSidebarView, settings }) => {
    const [input, setInput] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const chatEndRef = useRef(null);
    
    // Check if there's a loading message (ensure messages is an array)
    const isLoading = Array.isArray(messages) && messages.some(msg => msg.isLoading === true);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || enabledModelsCount < 2) return;
        
        // Store the user input BEFORE clearing it
        const userPrompt = input;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        const userMessage = { id: Date.now(), text: userPrompt, sender: 'user', timestamp };
        const loadingMessageId = Date.now() + 1;

        // Create loading message with skeleton loaders
        const loadingMessage = {
            id: loadingMessageId,
            sender: 'ai',
            type: 'multi-model',
            timestamp: timestamp,
            summary: `Waiting for ${enabledModelsCount} AI model${enabledModelsCount > 1 ? 's' : ''} to respond...`,
            overallSimilarity: 0,
            baselineModel: baselineModelName,
            isLoading: true,
            responses: enabledModelNames.map(name => ({
                model: name, // Use display name for consistency
                response: '',
                similarity: 0
            }))
        };

        setMessages(prevMessages => {
            const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
            return [...currentMessages, userMessage, loadingMessage];
        });
        setInput('');

        try {
            // Get responses from all enabled models
            const responsePromises = enabledModelNames.map(modelName => 
                getModelResponse(
                    settings[modelName].backendModelName, 
                    settings[modelName].apiKey, 
                    userPrompt
                )
            );

            const responses = await Promise.all(responsePromises);

            // Prepare data for similarity score calculation
            const modelResponsesForSimilarity = responses.map(resp => ({
                model_name: resp.model_name,
                content: resp.response
            }));

            // Get similarity scores
            const baselineIdx = enabledModelNames.indexOf(baselineModelName);
            const similarityData = await getSimilarityScores(baselineIdx, modelResponsesForSimilarity);

            // Calculate overall similarity (average of all similarity scores)
            const overallSimilarity = Math.round(
                (similarityData.content.reduce((acc, item) => acc + item.similarity_score, 0) / 
                similarityData.content.length) * 100
            );

            // Create a map of backend model names to display names
            const backendToDisplayName = {};
            enabledModelNames.forEach(displayName => {
                backendToDisplayName[settings[displayName].backendModelName] = displayName;
            });

            // Update the loading message with actual data
            const multiModelResponse = {
                id: loadingMessageId,
                sender: 'ai',
                type: 'multi-model',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                summary: `${enabledModelsCount} AI model${enabledModelsCount > 1 ? 's have' : ' has'} responded to your question. You can view their responses and similarity scores below.`,
                overallSimilarity: overallSimilarity,
                baselineModel: baselineModelName,
                isLoading: false,
                responses: responses.map((resp) => {
                    const displayName = backendToDisplayName[resp.model_name] || resp.model_name;
                    const similarityItem = similarityData.content.find(s => s.model_name === resp.model_name);
                    return {
                        model: displayName, // Use display name for consistency with loading state
                        response: resp.response,
                        similarity: Math.round((similarityItem?.similarity_score || 0) * 100)
                    };
                })
            };

            // Update messages by replacing the loading message
            setMessages(prevMessages => 
                prevMessages.map(msg => msg.id === loadingMessageId ? multiModelResponse : msg)
            );
        } catch (error) {
            console.error('Error getting responses:', error);
            
            // Replace loading message with error message
            const errorMessage = {
                id: loadingMessageId,
                sender: 'ai',
                type: 'error',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                text: `Error: ${error.message}. Please check your API keys in settings and ensure the backend server is running.`
            };
            
            setMessages(prevMessages => 
                prevMessages.map(msg => msg.id === loadingMessageId ? errorMessage : msg)
            );
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isLoading || enabledModelsCount < 2 || !baselineModelName) {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 5000);
            } else {
                handleSend();
            }
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-gray-200/50 dark:bg-black/10 backdrop-blur-lg">
            <header className="p-6 border-b border-gray-300 dark:border-white/10 flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Chat</h1>
                {enabledModelsCount > 0 && (
                    <span className="text-sm bg-purple-600/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                        {enabledModelsCount} model{enabledModelsCount > 1 && 's'} enabled
                    </span>
                )}
                {baselineModelName && (
                    <span className="text-sm bg-purple-600/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                        Baseline Model: {baselineModelName}
                    </span>
                )}
            </header>
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {Array.isArray(messages) && messages.map((msg) => {
                    if (msg.sender === 'user') {
                        return <UserMessage key={msg.id} message={msg} />;
                    }
                    if (msg.type === 'multi-model') {
                        return <MultiModelResponse key={msg.id} message={msg} />;
                    }
                    if (msg.type === 'error') {
                        return <ErrorMessage key={msg.id} message={msg} />;
                    }
                    return null;
                })}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-6 bg-white/80 dark:bg-gray-800/50 border-t border-gray-300 dark:border-white/10">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={enabledModelsCount > 0 ? "Type your message here..." : "Enable a model in settings to start chatting"}
                        className="flex-1 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg py-3 px-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isLoading || enabledModelsCount === 0}
                    />
                    <div className="relative group">
                        <button
                            onClick={handleSend}
                            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                            disabled={isLoading || enabledModelsCount < 2 || !baselineModelName}
                        >
                            <SendIcon />
                        </button>
                        <div className={`absolute bottom-full right-0 mb-2 mr-2 w-64 px-3 py-1.5 text-sm text-white bg-gray-800 dark:bg-gray-900 border border-gray-300 dark:border-white/10 rounded-md transition-opacity duration-1200 ${showTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
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