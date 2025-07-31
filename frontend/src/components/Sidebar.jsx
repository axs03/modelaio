/*
================================================================================
| FILE: src/components/Sidebar.jsx
| DESCRIPTION: The left sidebar component with navigation and user info.
================================================================================
*/
import React from 'react';
import { PlusIcon, SettingsIcon, UserIcon, BotIcon } from './Icons';

const Sidebar = ({ onSettingsClick }) => {
    return (
        <div className="w-80 bg-gray-900 p-6 flex flex-col flex-shrink-0">
            <div className="flex items-center space-x-3 mb-12">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <BotIcon />
                </div>
                <span className="font-bold text-xl text-white">Mr Dork</span>
            </div>
            <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-opacity shadow-md">
                <PlusIcon />
                <span>New Chat</span>
            </button>
            <div className="flex-grow"></div>
            <div className="space-y-2">
                <button onClick={onSettingsClick} className="flex items-center w-full space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
                    <SettingsIcon />
                    <span>Settings</span>
                </button>
                <div className="flex items-center w-full space-x-3 p-3 border-t border-gray-700/50 mt-2">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
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