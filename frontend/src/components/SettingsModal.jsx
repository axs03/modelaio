/*
================================================================================
| FILE: src/components/SettingsModal.jsx
| DESCRIPTION: The settings modal pop-up.
================================================================================
*/
import React, { useState } from 'react';
import { X, Eye, Save } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [selectedModel, setSelectedModel] = useState('OpenAI');
    const [enableGpt4, setEnableGpt4] = useState(false);
    const [setAsBaseline, setSetAsBaseline] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const models = ['OpenAI', 'DeepSeek', 'Claude', 'Google Gemini'];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-[#1E1F22] text-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-semibold">Settings</h2>

                <div className="grid grid-cols-2 gap-2">
                    {models.map(model => (
                        <button
                            key={model}
                            onClick={() => setSelectedModel(model)}
                            className={`p-3 rounded-md text-sm font-semibold transition-colors ${selectedModel === model
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
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
                            className="w-full bg-[#2a2b2f] border border-gray-600 rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C4F4]"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <Eye size={18} />
                        </button>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">
                    <Save size={20} />
                    <span>Save Keys</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;