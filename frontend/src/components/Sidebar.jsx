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
        <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col flex-shrink-0">
            <div className="flex items-center space-x-3 mb-12">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                    <BotIcon />
                </div>
                <span className="font-bold text-xl text-white">Mr Dork</span>
            </div>
            <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg">
                <PlusIcon />
                <span>New Chat</span>
            </button>
            <div className="flex-grow"></div>
            <div className="space-y-2">
                <button onClick={onSettingsClick} className="flex items-center w-full space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300">
                    <SettingsIcon />
                    <span>Settings</span>
                </button>
                <div className="flex items-center w-full space-x-3 p-3 border-t border-white/10 mt-2">
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