'use client'

import { useState, useMemo, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'

const modelConfigurations = {
  OpenAI: {
    apiKeyLabel: 'OpenAI API Key',
    toggles: [
      { id: 'enabled', label: 'Enable OpenAI GPT' },
      { id: 'isBaseline', label: 'Set as Baseline' },
    ],
  },
  DeepSeek: {
    apiKeyLabel: 'DeepSeek API Key',
    toggles: [
      { id: 'enabled', label: 'Enable DeepSeek' },
      { id: 'isBaseline', label: 'Set as Baseline' },
    ],
  },
  Claude: {
    apiKeyLabel: 'Anthropic API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Claude' },
      { id: 'isBaseline', label: 'Set as Baseline' },
    ],
  },
  'Google Gemini': {
    apiKeyLabel: 'Google API Key',
    toggles: [
      { id: 'enabled', label: 'Enable Gemini' },
      { id: 'isBaseline', label: 'Set as Baseline' },
    ],
  },
}

export default function Home() {
  const [settings, setSettings] = useState({
    OpenAI: { enabled: true, isBaseline: true, apiKey: '' },
    DeepSeek: { enabled: false, isBaseline: false, apiKey: '' },
    Claude: { enabled: false, isBaseline: false, apiKey: '' },
    'Google Gemini': { enabled: false, isBaseline: false, apiKey: '' },
  })
  const [theme, setTheme] = useState('dark')
  const [sidebarView, setSidebarView] = useState('chat')
  const [chats, setChats] = useState([{ id: 1, title: 'Chat 1', messages: [] }])
  const [activeChatId, setActiveChatId] = useState(1)

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const activeChat = useMemo(
    () => chats.find(c => c.id === activeChatId),
    [chats, activeChatId]
  )

  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: `Chat ${chats.length + 1}`, messages: [] }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newChat.id)
  }

  const handleSetMessages = (newMessages) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id !== activeChatId) return c
        const updated = typeof newMessages === 'function' ? newMessages(c.messages) : newMessages
        return { ...c, messages: updated }
      })
    )
  }

  const enabledModelsCount = useMemo(
    () => Object.values(settings).filter(s => s.enabled).length,
    [settings]
  )

  const enabledModelNames = useMemo(
    () => Object.entries(settings).filter(([, s]) => s.enabled).map(([name]) => name),
    [settings]
  )

  const baselineModelName = useMemo(
    () => Object.entries(settings).find(([, s]) => s.isBaseline)?.[0],
    [settings]
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
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
      <ChatWindow
        key={activeChatId}
        enabledModelsCount={enabledModelsCount}
        enabledModelNames={enabledModelNames}
        baselineModelName={baselineModelName}
        messages={activeChat?.messages ?? []}
        setMessages={handleSetMessages}
        setSidebarView={setSidebarView}
      />
    </div>
  )
}
