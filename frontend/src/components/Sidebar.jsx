/*
================================================================================
| FILE: src/components/Sidebar.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState } from 'react';
import { PlusIcon, SettingsIcon, UserIcon, BotIcon, EyeIcon, SaveIcon } from './Icons';
import ToggleSwitch from './ToggleSwitch';

// --- NEW: Configuration object for model-specific settings ---
const modelConfigurations = {
    'OpenAI': {
        apiKeyLabel: 'OpenAI API Key',
        toggles: [
            { id: 'enableGpt4', label: 'Enable OpenAI GPT-4' },
            { id: 'setAsBaseline', label: 'Set as Baseline Model' }
        ]
    },
    'DeepSeek': {
        apiKeyLabel: 'DeepSeek API Key',
        toggles: [
            { id: 'useCoderModel', label: 'Use DeepSeek Coder' },
            { id: 'enableStreaming', label: 'Enable Streaming' }
        ]
    },
    'Claude': {
        apiKeyLabel: 'Anthropic API Key',
        toggles: [
            { id: 'useSonnet', label: 'Use Claude 3.5 Sonnet' },
            { id: 'enableMemory', label: 'Enable Long-term Memory' }
        ]
    },
    'Google Gemini': {
        apiKeyLabel: 'Google Gemini API Key',
        toggles: [
            { id: 'useGeminiPro', label: 'Enable Gemini 1.5 Pro' },
            { id: 'useSafetyFilter', label: 'Use Safety Filter' }
        ]
    }
};

const Sidebar = () => {
    const [view, setView] = useState('chat');
    const [selectedModel, setSelectedModel] = useState('OpenAI');

    // --- NEW: A single state object to hold all settings for all models ---
    const [settings, setSettings] = useState({
        'OpenAI': { enableGpt4: false, setAsBaseline: false, apiKey: '' },
        'DeepSeek': { useCoderModel: true, enableStreaming: false, apiKey: '' },
        'Claude': { useSonnet: true, enableMemory: true, apiKey: '' },
        'Google Gemini': { useGeminiPro: false, useSafetyFilter: true, apiKey: '' }
    });

    const handleNewChat = () => {
        window.location.reload();
    };

    // --- NEW: Generic handler for toggle changes ---
    const handleToggleChange = (toggleId) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [selectedModel]: {
                ...prevSettings[selectedModel],
                [toggleId]: !prevSettings[selectedModel][toggleId]
            }
        }));
    };

    // --- NEW: Generic handler for API key changes ---
    const handleApiKeyChange = (event) => {
        const newApiKey = event.target.value;
        setSettings(prevSettings => ({
            ...prevSettings,
            [selectedModel]: {
                ...prevSettings[selectedModel],
                apiKey: newApiKey
            }
        }));
    };

    const renderContent = () => {
        if (view === 'settings') {
            const currentConfig = modelConfigurations[selectedModel];
            const currentSettings = settings[selectedModel];

            return (
                <div className="flex flex-col flex-grow mt-6 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {Object.keys(modelConfigurations).map(model => (
                            <button
                                key={model}
                                onClick={() => setSelectedModel(model)}
                                className={`p-3 rounded-md text-sm font-semibold transition-all duration-200 border ${selectedModel === model
                                        ? 'bg-white/20 border-white/30 text-white shadow-lg'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                            >
                                {model}
                            </button>
                        ))}
                    </div>

                    {/* --- DYNAMICALLY RENDERED SETTINGS --- */}
                    <div className="space-y-4 mb-6">
                        {currentConfig.toggles.map(toggle => (
                            <ToggleSwitch
                                key={toggle.id}
                                label={toggle.label}
                                isEnabled={currentSettings[toggle.id]}
                                onToggle={() => handleToggleChange(toggle.id)}
                            />
                        ))}
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {currentConfig.apiKeyLabel}
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={currentSettings.apiKey}
                                onChange={handleApiKeyChange}
                                placeholder="sk-..."
                                className="w-full bg-gray-900/50 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                <EyeIcon />
                            </button>
                        </div>
                    </div>
                    {/* --- END OF DYNAMIC SETTINGS --- */}

                    <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                        <SaveIcon />
                        <span>Save Keys</span>
                    </button>
                </div>
            );
        }
        return (
            <div className="flex-grow mt-6">
                <p className="text-gray-500 text-center text-sm px-4">Your chat history will appear here.</p>
            </div>
        );
    };

    return (
        <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col flex-shrink-0">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                    <BotIcon />
                </div>
                <span className="font-bold text-xl text-white">Mr Dork</span>
            </div>
            <button
                onClick={handleNewChat}
                className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg"
            >
                <PlusIcon />
                <span>New Chat</span>
            </button>

            {renderContent()}

            <div className="mt-auto flex-shrink-0 border-t border-white/10 pt-4">
                {view === 'settings' && (
                    <button
                        onClick={() => setView('chat')}
                        className="flex items-center w-full space-x-3 p-3 mb-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                    >
                        <SettingsIcon />
                        <span>Back to Chat</span>
                    </button>
                )}
                <button
                    onClick={() => setView('settings')}
                    className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors text-gray-300 ${view === 'settings' ? 'bg-white/10' : 'hover:bg-white/10'
                        }`}
                >
                    <SettingsIcon />
                    <span>Settings</span>
                </button>
                <div className="flex items-center w-full space-x-3 p-3 mt-2">
                    <div className="h-10 w-10 rounded-full bg-gray-700/50 flex items-center justify-center border border-white/10">
                        <UserIcon />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Demo User</span>
                        <span className="text-xs text-gray-400">demo@example.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
