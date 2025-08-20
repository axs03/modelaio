/*
================================================================================
| FILE: src/components/Sidebar.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState } from 'react';
import { PlusIcon, SettingsIcon, UserIcon, BotIcon, EyeIcon, SaveIcon } from './Icons';
import ToggleSwitch from './ToggleSwitch';

const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>;

const Sidebar = ({ settings, setSettings, modelConfigurations, theme, setTheme, chats, activeChatId, onNewChat, onSelectChat }) => {
    const [view, setView] = useState('chat');
    const [selectedModel, setSelectedModel] = useState('OpenAI');
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

    const handleSettingsToggle = () => {
        setView(prevView => prevView === 'settings' ? 'chat' : 'settings');
    };

    const handleToggleChange = (modelName, toggleId) => {
        setSettings(prevSettings => {
            const newSettings = JSON.parse(JSON.stringify(prevSettings));
            const currentModelSettings = newSettings[modelName];

            if (toggleId === 'isBaseline') {
                if (!currentModelSettings.isBaseline) {
                    for (const key in newSettings) {
                        newSettings[key].isBaseline = false;
                    }
                    currentModelSettings.isBaseline = true;
                    currentModelSettings.enabled = true;
                }
            } else {
                currentModelSettings[toggleId] = !currentModelSettings[toggleId];
                if (toggleId === 'enabled' && !currentModelSettings.enabled) {
                    currentModelSettings.isBaseline = false;
                }
            }

            return newSettings;
        });
    };

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
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Theme</h3>
                        <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <ToggleSwitch
                                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                isEnabled={theme === 'dark'}
                                onToggle={() => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')}
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Models</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {Object.keys(modelConfigurations).map(model => (
                            <button
                                key={model}
                                onClick={() => setSelectedModel(model)}
                                className={`p-3 rounded-md text-sm font-semibold transition-all duration-200 border ${selectedModel === model
                                    ? 'bg-black/20 dark:bg-white/20 border-black/20 dark:border-white/30 text-gray-800 dark:text-white shadow-lg'
                                    : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {model}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 mb-6">
                        {currentConfig.toggles.map(toggle => (
                            <ToggleSwitch
                                key={toggle.id}
                                label={toggle.label}
                                isEnabled={currentSettings[toggle.id]}
                                onToggle={() => handleToggleChange(selectedModel, toggle.id)}
                            />
                        ))}
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {currentConfig.apiKeyLabel}
                        </label>
                        <div className="relative">
                            <input
                                type={isApiKeyVisible ? 'text' : 'password'}
                                value={currentSettings.apiKey}
                                onChange={handleApiKeyChange}
                                placeholder="sk-..."
                                className="w-full bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                            >
                                {isApiKeyVisible ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
                        <SaveIcon />
                        <span>Save Keys</span>
                    </button>
                </div>
            );
        }
        return (
            <div className="flex-grow mt-6 space-y-2">
                {chats.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors animate-fade-in ${activeChatId === chat.id ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/30' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                    >
                        <p className="text-gray-800 dark:text-white font-medium text-sm truncate">{chat.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{chat.messages.length > 0 ? chat.messages[0].text : 'Start a new conversation...'}</p>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="w-80 bg-white/50 dark:bg-black/20 backdrop-blur-lg border-r border-black/10 dark:border-white/10 p-6 flex flex-col flex-shrink-0 text-gray-800 dark:text-white">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                    <BotIcon className="text-white" />
                </div>
                {/* --- UPDATED: Application name changed here --- */}
                <span className="font-bold text-xl">model.aio</span>
            </div>
            <button
                onClick={onNewChat}
                className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg"
            >
                <PlusIcon />
                <span>New Chat</span>
            </button>

            {renderContent()}

            <div className="mt-auto flex-shrink-0 border-t border-black/10 dark:border-white/10 pt-4">
                <button
                    onClick={handleSettingsToggle}
                    className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors text-gray-600 dark:text-gray-300 ${view === 'settings' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                >
                    <SettingsIcon />
                    <span>Settings</span>
                </button>
                <div className="flex items-center w-full space-x-3 p-3 mt-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/50 flex items-center justify-center border border-black/10 dark:border-white/10">
                        <UserIcon />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Demo User</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">demo@example.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;