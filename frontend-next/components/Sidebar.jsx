'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PlusIcon, SettingsIcon, BotIcon, EyeIcon, EyeOffIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from './Icons'
import { ModelProviderIcon } from './Icons'
import ToggleSwitch from './ToggleSwitch'
import AddModelModal from './AddModelModal'

const MIN_SIDEBAR_WIDTH = 240
const MAX_SIDEBAR_RATIO = 0.4

const Sidebar = ({
  modelSettings, setModelSettings,
  chats, activeChatId, onNewChat, onSelectChat,
  view, setView,
  onOpenSettings,
}) => {
  const [selectedMyModel, setSelectedMyModel] = useState(null)
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(MIN_SIDEBAR_WIDTH)
  const isResizing = useRef(false)

  const myModelIds = Object.keys(modelSettings)

  // Resize handlers
  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return
      const maxWidth = window.innerWidth * MAX_SIDEBAR_RATIO
      const newWidth = Math.min(Math.max(e.clientX, MIN_SIDEBAR_WIDTH), maxWidth)
      setSidebarWidth(newWidth)
    }
    const handleMouseUp = () => {
      if (!isResizing.current) return
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    setIsApiKeyVisible(false)
  }, [selectedMyModel])

  const handleAddModel = (modelId) => {
    if (modelSettings[modelId]) return
    setModelSettings(prev => ({
      ...prev,
      [modelId]: { enabled: false, isBaseline: false, apiKey: '' },
    }))
  }

  const handleRemoveModel = (modelId) => {
    setModelSettings(prev => {
      const next = { ...prev }
      delete next[modelId]
      return next
    })
    if (selectedMyModel === modelId) setSelectedMyModel(null)
  }

  const handleToggleChange = (modelId, toggleId) => {
    setModelSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      if (toggleId === 'isBaseline') {
        if (!next[modelId].isBaseline) {
          Object.keys(next).forEach(k => { next[k].isBaseline = false })
          next[modelId].isBaseline = true
          next[modelId].enabled = true
        }
      } else {
        next[modelId][toggleId] = !next[modelId][toggleId]
        if (toggleId === 'enabled' && !next[modelId].enabled) {
          next[modelId].isBaseline = false
        }
      }
      return next
    })
  }

  const handleApiKeyChange = (e) => {
    if (!selectedMyModel) return
    const value = e.target.value
    setModelSettings(prev => ({
      ...prev,
      [selectedMyModel]: { ...prev[selectedMyModel], apiKey: value },
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
          onClick={onOpenSettings}
          className={iconBtn}
          title="Settings"
        >
          <SettingsIcon />
        </button>
      </div>
    )
  }

  return (
    <>
      <div
        className="bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0 relative select-none"
        style={{ width: sidebarWidth }}
      >
        {/* Resize handle */}
        <div
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-10 group"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="w-full h-full transition-colors group-hover:bg-violet-500/40" />
        </div>

        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-violet-600 flex items-center justify-center">
              <BotIcon />
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">model.aio</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={onOpenSettings} className={iconBtn} title="Settings">
              <SettingsIcon />
            </button>
            <button onClick={() => setIsCollapsed(true)} className={iconBtn} title="Collapse">
              <ChevronLeftIcon />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          {[
            { key: 'chat', label: 'Chat' },
            { key: 'active-models', label: 'Active Models' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors
                ${view === tab.key
                  ? 'text-neutral-900 dark:text-white border-b-2 border-violet-500 -mb-px'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
            >
              {tab.label}
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
            <div className="p-4 space-y-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                  My Models{myModelIds.length > 0 && ` (${myModelIds.length})`}
                </p>
                <button
                  onClick={() => setIsAddModelOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-violet-500 hover:text-violet-400 transition-colors uppercase tracking-widest"
                >
                  <PlusIcon />
                  Add Model
                </button>
              </div>

              {myModelIds.length === 0 ? (
                <p className="text-xs text-neutral-400 italic leading-relaxed">
                  No models added yet. Click &ldquo;Add Model&rdquo; to get started.
                </p>
              ) : (
                <>
                  {/* Model list */}
                  <div className="space-y-0.5">
                    {myModelIds.map(id => {
                      const s = modelSettings[id]
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedMyModel(selectedMyModel === id ? null : id)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                            selectedMyModel === id
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                              : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          <ModelProviderIcon modelId={id} size={16} />
                          <span className="truncate flex-1">{id}</span>
                          {s.enabled && (
                            <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-green-500" title="Enabled" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Settings panel for the selected model */}
                  {selectedMyModel && modelSettings[selectedMyModel] && (
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <ModelProviderIcon modelId={selectedMyModel} size={18} />
                        <p className="text-[10px] font-mono text-neutral-400 truncate" title={selectedMyModel}>
                          {selectedMyModel}
                        </p>
                      </div>

                      <ToggleSwitch
                        label="Enable model"
                        isEnabled={modelSettings[selectedMyModel].enabled}
                        onToggle={() => handleToggleChange(selectedMyModel, 'enabled')}
                      />
                      <ToggleSwitch
                        label="Set as Baseline"
                        isEnabled={modelSettings[selectedMyModel].isBaseline}
                        onToggle={() => handleToggleChange(selectedMyModel, 'isBaseline')}
                      />

                      {/* API Key */}
                      <div>
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">
                          API Key
                        </p>
                        <div className="relative">
                          <input
                            type={isApiKeyVisible ? 'text' : 'password'}
                            value={modelSettings[selectedMyModel].apiKey}
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
                      </div>

                      <button
                        onClick={() => handleRemoveModel(selectedMyModel)}
                        className="w-full py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 transition-colors"
                      >
                        Remove model
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <AddModelModal
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
        modelSettings={modelSettings}
        onAddModel={handleAddModel}
        onRemoveModel={handleRemoveModel}
      />
    </>
  )
}

export default Sidebar
