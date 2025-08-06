/*
================================================================================
| FILE: src/App.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

// App is now simpler and no longer manages views.
function App() {
  return (
    <div className="flex h-screen w-full text-white font-sans overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default App;