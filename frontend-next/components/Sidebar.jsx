'use client'

import { useState } from 'react'
import {
  PlusIcon, SettingsIcon, BotIcon, EyeIcon, EyeOffIcon,
  SaveIcon, ChevronLeftIcon, ChevronRightIcon,
} from './Icons'
import ToggleSwitch from './ToggleSwitch'

const Sidebar = ({
  settings, setSettings, modelConfigurations,
  theme, setTheme,
  chats, activeChatId, onNewChat, onSelectChat,
  view, setView,
}) => {
  const [selectedModel, setSelectedModel] = useState('OpenAI')
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleChange = (modelName, toggleId) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      if (toggleId === 'isBaseline') {
        if (!next[modelName].isBaseline) {
          Object.keys(next).forEach(k => { next[k].isBaseline = false })
          next[modelName].isBaseline = true
          next[modelName].enabled = true
        }
      } else {
        next[modelName][toggleId] = !next[modelName][toggleId]
        if (toggleId === 'enabled' && !next[modelName].enabled) {
          next[modelName].isBaseline = false
        }
      }
      return next
    })
  }

  const handleApiKeyChange = (e) => {
    setSettings(prev => ({
      ...prev,
      [selectedModel]: { ...prev[selectedModel], apiKey: e.target.value },
    }))
  }

  const iconBtn = 'h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'

  if (isCollapsed) {
    return (
      <div className="w-14 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col items-center py-3 gap-2 flex-shrink-0">
        <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center mb-2">
          <BotIcon />
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className={iconBtn}
          title="Expand sidebar"
        >
          <ChevronRightIcon />
        </button>
        <button
          onClick={() => { setIsCollapsed(false); setView('settings') }}
          className={iconBtn}
          title="Settings"
        >
          <SettingsIcon />
        </button>
      </div>
    )
  }

  return (
    <div className="w-60 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-violet-600 flex items-center justify-center">
            <BotIcon />
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">model.aio</span>
        </div>
        <button onClick={() => setIsCollapsed(true)} className={iconBtn} title="Collapse">
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        {['chat', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors
              ${view === tab
                ? 'text-neutral-900 dark:text-white border-b-2 border-violet-500 -mb-px'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'chat' ? (
          <div className="p-3">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              <PlusIcon />
              New Chat
            </button>
            <div className="space-y-0.5">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    activeChatId === chat.id
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <p className="text-xs font-medium truncate">{chat.title}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                    {chat.messages.length > 0 ? chat.messages[0].text : 'Empty conversation'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Model picker */}
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">Model</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.keys(modelConfigurations).map(model => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border ${
                      selectedModel === model
                        ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white'
                        : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              {modelConfigurations[selectedModel].toggles.map(toggle => (
                <ToggleSwitch
                  key={toggle.id}
                  label={toggle.label}
                  isEnabled={settings[selectedModel][toggle.id]}
                  onToggle={() => handleToggleChange(selectedModel, toggle.id)}
                />
              ))}
            </div>

            {/* API Key */}
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                {modelConfigurations[selectedModel].apiKeyLabel}
              </p>
              <div className="relative">
                <input
                  type={isApiKeyVisible ? 'text' : 'password'}
                  value={settings[selectedModel].apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="sk-..."
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg py-2 pl-3 pr-9 text-xs text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
                />
                <button
                  onClick={() => setIsApiKeyVisible(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {isApiKeyVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors">
                <SaveIcon />
                Save Key
              </button>
            </div>

            {/* Theme */}
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">Appearance</p>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <ToggleSwitch
                  label={theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  isEnabled={theme === 'dark'}
                  onToggle={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
