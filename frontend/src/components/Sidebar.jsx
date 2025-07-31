/*
================================================================================
| FILE: src/components/Sidebar.jsx
| DESCRIPTION: The left sidebar component with navigation and user info.
================================================================================
*/
import React from 'react';
import { Plus, Settings, User, Bot } from 'lucide-react';

const Sidebar = ({ onSettingsClick }) => {
    return (
        <div className="w-64 bg-[#171717] p-4 flex flex-col flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
                <div className="p-2 bg-purple-600 rounded-lg">
                    <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-lg">Mr Dork</span>
            </div>

            {/* New Chat Button */}
            <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#00C4F4] to-[#00D886] hover:opacity-90 transition-opacity">
                <Plus className="h-5 w-5" />
                <span>New Chat</span>
            </button>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Bottom Section */}
            <div className="space-y-2">
                <button onClick={onSettingsClick} className="flex items-center w-full space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">Settings</span>
                </button>
                <div className="flex items-center w-full space-x-3 p-2 border-t border-gray-700 pt-4">
                    <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
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