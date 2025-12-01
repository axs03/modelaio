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
      { id: 'enabled', label: 'Enable OpenAI GPT' },
      { id: 'isBaseline', label: 'Set Baseline Model' }
    ]
  },
  'DeepSeek': {
    apiKeyLabel: 'DeepSeek API Key',
    toggles: [
      { id: 'enabled', label: 'Enable DeepSeek' },
      { id: 'isBaseline', label: 'Set Baseline Model' }
    ]
  },
  'Claude': {
    apiKeyLabel: 'Anthropic API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Claude 3.5 Sonnet' },
      { id: 'isBaseline', label: 'Set Baseline Model' }
    ]
  },
  'Google Gemini': {
    apiKeyLabel: 'Google API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Gemini 1.5 Pro' },
      { id: 'isBaseline', label: 'Set Baseline Model' }
    ]
  }
};


function App() {
  const [settings, setSettings] = useState({
    'OpenAI': { enabled: true, isBaseline: true, apiKey: '', backendModelName: 'openai/gpt-4o' },
    'DeepSeek': { enabled: false, isBaseline: false, apiKey: '', backendModelName: 'deepseek/deepseek-chat' },
    'Claude': { enabled: false, isBaseline: false, apiKey: '', backendModelName: 'anthropic/claude-3-sonnet-20240229' },
    'Google Gemini': { enabled: false, isBaseline: false, apiKey: '', backendModelName: 'gemini/gemini-1.5-pro' }
  });

  // --- State to manage the application's theme ---
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [sidebarView, setSidebarView] = useState('chat'); // state for opening settings

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

  const handleSetMessages = (newMessagesOrUpdater) => {
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          // Check if newMessagesOrUpdater is a function (updater) or a value
          const newMessages = typeof newMessagesOrUpdater === 'function'
            ? newMessagesOrUpdater(chat.messages)
            : newMessagesOrUpdater;
          return { ...chat, messages: newMessages };
        }
        return chat;
      })
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
    return Object.entries(settings).find(([, modelSettings]) => modelSettings.isBaseline)?.[0];
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
        view={sidebarView}
        setView={setSidebarView}
      />
      {activeChat && (
        <ChatWindow
          key={activeChatId}
          enabledModelsCount={enabledModelsCount}
          enabledModelNames={enabledModelNames}
          baselineModelName={baselineModelName}
          messages={activeChat.messages}
          setMessages={handleSetMessages}
          setSidebarView={setSidebarView}
          settings={settings}
        />
      )}
    </div>
  );
}

export default App;