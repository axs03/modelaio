/*
================================================================================
| FILE: src/components/ToggleSwitch.jsx
| DESCRIPTION: A reusable toggle switch component.
================================================================================
*/
import React from 'react';

const ToggleSwitch = ({ isEnabled, onToggle, label }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

export default ToggleSwitch;
