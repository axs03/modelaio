/*
================================================================================
| FILE: src/App.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState, useMemo, useEffect } from 'react';
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

  // --- State to manage the application's theme ---
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  // --- This effect applies the theme class to the root HTML element ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Remove old theme
    root.classList.add(theme); // Add new theme
  }, [theme]);

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
    <div className="flex h-screen w-full font-sans overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar
        settings={settings}
        setSettings={setSettings}
        modelConfigurations={modelConfigurations}
        theme={theme}
        setTheme={setTheme}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
      />
      <ChatWindow
        key={activeChatId}
        enabledModelsCount={enabledModelsCount}
        enabledModelNames={enabledModelNames}
        baselineModelName={baselineModelName}
        messages={activeChat.messages}
        setMessages={handleSetMessages}
      />
    </div>
  );
}

export default App;