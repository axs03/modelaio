'use client'

import { useState, useMemo, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import SettingsModal from '../components/SettingsModal'

export default function Home() {
  // modelSettings: { [litellmModelId]: { enabled: bool, isBaseline: bool, apiKey: string } }
  const [modelSettings, setModelSettings] = useState({})
  const [theme, setTheme] = useState('dark')
  const [sidebarView, setSidebarView] = useState('chat')
  const [chats, setChats] = useState([{ id: 1, title: 'Chat 1', messages: [] }])
  const [activeChatId, setActiveChatId] = useState(1)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  // Array of { name: string, apiKey: string } for all enabled models
  const enabledModels = useMemo(
    () => Object.entries(modelSettings)
      .filter(([, s]) => s.enabled)
      .map(([name, s]) => ({ name, apiKey: s.apiKey })),
    [modelSettings]
  )

  const enabledModelsCount = enabledModels.length

  const baselineModelName = useMemo(
    () => Object.entries(modelSettings).find(([, s]) => s.isBaseline)?.[0] ?? null,
    [modelSettings]
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <Sidebar
        modelSettings={modelSettings}
        setModelSettings={setModelSettings}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        view={sidebarView}
        setView={setSidebarView}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <ChatWindow
        key={activeChatId}
        enabledModelsCount={enabledModelsCount}
        enabledModels={enabledModels}
        baselineModelName={baselineModelName}
        messages={activeChat?.messages ?? []}
        setMessages={handleSetMessages}
        setSidebarView={setSidebarView}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        modelSettings={modelSettings}
        setModelSettings={setModelSettings}
      />
    </div>
  )
}
