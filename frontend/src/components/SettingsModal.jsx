/*
================================================================================
| FILE: src/components/SettingsModal.jsx
| DESCRIPTION: The settings modal pop-up.
================================================================================
*/
import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { XIcon, EyeIcon, SaveIcon } from './Icons';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [selectedModel, setSelectedModel] = useState('OpenAI');
    const [enableGpt4, setEnableGpt4] = useState(false);
    const [setAsBaseline, setSetAsBaseline] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const models = ['OpenAI', 'DeepSeek', 'Claude', 'Google Gemini'];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 border border-gray-700 text-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <XIcon />
                </button>
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <div className="grid grid-cols-2 gap-3">
                    {models.map(model => (
                        <button
                            key={model}
                            onClick={() => setSelectedModel(model)}
                            className={`p-3 rounded-md text-sm font-semibold transition-all duration-200 ${selectedModel === model
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                }`}
                        >
                            {model}
                        </button>
                    ))}
                </div>
                <hr className="border-gray-700" />
                <div className="space-y-4">
                    <ToggleSwitch
                        label="Enable OpenAI GPT-4"
                        isEnabled={enableGpt4}
                        onToggle={() => setEnableGpt4(!enableGpt4)}
                    />
                    <ToggleSwitch
                        label="Set as Baseline Model"
                        isEnabled={setAsBaseline}
                        onToggle={() => setSetAsBaseline(!setAsBaseline)}
                    />
                </div>
                <hr className="border-gray-700" />
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        OpenAI API Key
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <EyeIcon />
                        </button>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                    <SaveIcon />
                    <span>Save Keys</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;