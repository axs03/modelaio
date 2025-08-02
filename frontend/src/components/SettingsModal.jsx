/*
================================================================================
| FILE: src/components/SettingsModal.jsx
| DESCRIPTION: The settings modal pop-up with the new model switcher.
================================================================================
*/
import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { XIcon, EyeIcon, SaveIcon } from './Icons';

// --- Simple Arrow Icons for the new switcher ---
const LeftArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const RightArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;


const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const models = ['OpenAI', 'DeepSeek', 'Claude', 'Google Gemini'];
    const [selectedModelIndex, setSelectedModelIndex] = useState(0);

    const [enableGpt4, setEnableGpt4] = useState(false);
    const [setAsBaseline, setSetAsBaseline] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handlePrevModel = () => {
        setSelectedModelIndex((prevIndex) => (prevIndex - 1 + models.length) % models.length);
    };

    const handleNextModel = () => {
        setSelectedModelIndex((prevIndex) => (prevIndex + 1) % models.length);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-gray-900/70 backdrop-blur-xl border border-white/10 text-white rounded-lg shadow-2xl w-full max-w-md p-6 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <XIcon />
                </button>
                <h2 className="text-xl font-semibold text-white">Settings</h2>

                {/* --- NEW MODEL SWITCHER --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Active Model
                    </label>
                    <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2 border border-white/10">
                        <button onClick={handlePrevModel} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <LeftArrowIcon />
                        </button>
                        <span className="font-semibold text-lg text-white w-40 text-center">{models[selectedModelIndex]}</span>
                        <button onClick={handleNextModel} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <RightArrowIcon />
                        </button>
                    </div>
                </div>
                {/* --- END OF NEW MODEL SWITCHER --- */}

                <hr className="border-white/10" />
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
                <hr className="border-white/10" />
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
                            className="w-full bg-gray-700/50 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <EyeIcon />
                        </button>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                    <SaveIcon />
                    <span>Save Keys</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
