/*
================================================================================
| FILE: src/App.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

// --- Configuration object for model-specific settings ---
const modelConfigurations = {
  'OpenAI': {
    apiKeyLabel: 'OpenAI API Key',
    toggles: [
      { id: 'enabled', label: 'Enable OpenAI GPT-4' },
      { id: 'isBaseline', label: 'Select as Baseline Model' }
    ]
  },
  'DeepSeek': {
    apiKeyLabel: 'DeepSeek API Key',
    toggles: [
      { id: 'enabled', label: 'Enable DeepSeek Coder' },
      { id: 'isBaseline', label: 'Select as Baseline Model' }
    ]
  },
  'Claude': {
    apiKeyLabel: 'Anthropic API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Claude 3.5 Sonnet' },
      { id: 'isBaseline', label: 'Select as Baseline Model' }
    ]
  },
  'Google Gemini': {
    apiKeyLabel: 'Google Gemini API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Gemini 1.5 Pro' },
      { id: 'isBaseline', label: 'Select as Baseline Model' }
    ]
  }
};


function App() {
  const [settings, setSettings] = useState({
    'OpenAI': { enabled: true, isBaseline: true, apiKey: '' },
    'DeepSeek': { enabled: false, isBaseline: false, apiKey: '' },
    'Claude': { enabled: false, isBaseline: false, apiKey: '' },
    'Google Gemini': { enabled: false, isBaseline: false, apiKey: '' }
  });

  // --- NEW: State for the sidebar view is lifted up to App ---
  const [sidebarView, setSidebarView] = useState('chat');

  const [chats, setChats] = useState([
    { id: 1, title: 'Initial Chat', messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${chats.length + 1}`,
      messages: []
    };
    setChats(prevChats => [...prevChats, newChat]);
    setActiveChatId(newChat.id);
    setSidebarView('chat'); // Ensure we are in chat view
  };

  const handleSetMessages = (newMessages) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: newMessages } : chat
      )
    );
  };

  const enabledModelsCount = useMemo(() => {
    return Object.values(settings).filter(modelSettings => modelSettings.enabled).length;
  }, [settings]);

  const enabledModelNames = useMemo(() => {
    return Object.entries(settings)
      .filter(([, modelSettings]) => modelSettings.enabled)
      .map(([modelName]) => modelName);
  }, [settings]);

  const baselineModelName = useMemo(() => {
    return Object.entries(settings).find(([, modelSettings]) => modelSettings.isBaseline)?.[0] || 'OpenAI';
  }, [settings]);


  return (
    <div className="flex h-screen w-full text-white font-sans overflow-hidden">
      <Sidebar
        settings={settings}
        setSettings={setSettings}
        modelConfigurations={modelConfigurations}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
      />
      <ChatWindow
        key={activeChatId}
        enabledModelsCount={enabledModelsCount}
        enabledModelNames={enabledModelNames}
        baselineModelName={baselineModelName}
        messages={activeChat.messages}
        setMessages={handleSetMessages}
        setSidebarView={setSidebarView} // Pass setSidebarView to ChatWindow
      />
    </div>
  );
}

export default App;