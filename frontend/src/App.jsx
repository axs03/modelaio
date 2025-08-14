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
  // State for settings is now lifted to the App component to be shared
  const [settings, setSettings] = useState({
    'OpenAI': { enabled: true, isBaseline: true, apiKey: '' }, // Enabled & Baseline by default
    'DeepSeek': { enabled: false, isBaseline: false, apiKey: '' },
    'Claude': { enabled: false, isBaseline: false, apiKey: '' },
    'Google Gemini': { enabled: false, isBaseline: false, apiKey: '' }
  });

  // Calculate the number of enabled models
  const enabledModelsCount = useMemo(() => {
    return Object.values(settings).filter(modelSettings => modelSettings.enabled).length;
  }, [settings]);

  // Get the names of the enabled models
  const enabledModelNames = useMemo(() => {
    return Object.entries(settings)
      .filter(([, modelSettings]) => modelSettings.enabled)
      .map(([modelName]) => modelName);
  }, [settings]);

  // Find the name of the baseline model
  const baselineModelName = useMemo(() => {
    return Object.entries(settings).find(([, modelSettings]) => modelSettings.isBaseline)?.[0] || 'OpenAI';
  }, [settings]);


  return (
    <div className="flex h-screen w-full text-white font-sans overflow-hidden">
      <Sidebar
        settings={settings}
        setSettings={setSettings}
        modelConfigurations={modelConfigurations}
      />
      <ChatWindow
        enabledModelsCount={enabledModelsCount}
        enabledModelNames={enabledModelNames}
        baselineModelName={baselineModelName}
      />
    </div>
  );
}

export default App;