/*
================================================================================
| FILE: src/App.jsx
| DESCRIPTION: The main component that assembles the application layout.
================================================================================
*/
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen w-full bg-red-500 text-white font-sans">
        <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
        <ChatWindow />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export default App;