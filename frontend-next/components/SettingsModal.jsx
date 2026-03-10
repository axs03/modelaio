'use client'

import { useState, useEffect } from 'react'
import { CloseIcon, UserIcon, ModelProviderIcon } from './Icons'
import ToggleSwitch from './ToggleSwitch'
import { getAvailableModels } from '../src/services/api'

const GROQ_PLACEHOLDER_MODELS = [
  'groq/llama-3.3-70b-versatile',
  'groq/llama-3.1-8b-instant',
  'groq/mixtral-8x7b-32768',
  'groq/gemma2-9b-it',
]

const SETTINGS_PAGES = [
  { key: 'supported-models', label: 'Supported Models' },
  { key: 'theme', label: 'Theme' },
  { key: 'account', label: 'Account' },
]

const CollapsibleSection = ({ title, models }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{title}</span>
        <span className="text-[10px] text-neutral-400 flex items-center gap-2">
          {models.length} models
          <span>{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>
      {isOpen && (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-52 overflow-y-auto">
          {models.map(model => (
            <div key={model} className="px-4 py-1.5 flex items-center gap-2.5">
              <ModelProviderIcon modelId={model} size={16} />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{model}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SettingsModal = ({ isOpen, onClose, theme, setTheme, modelSettings, setModelSettings }) => {
  const [activePage, setActivePage] = useState('supported-models')
  const [availableModels, setAvailableModels] = useState([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setModelsLoading(true)
    setModelsError(null)
    getAvailableModels()
      .then(data => setAvailableModels(data.models))
      .catch(err => setModelsError(err.message))
      .finally(() => setModelsLoading(false))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setActivePage('supported-models')
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[680px] max-w-[90vw] h-[520px] max-h-[85vh] flex overflow-hidden">
        {/* Left nav */}
        <div className="w-48 border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
          <div className="h-14 px-4 flex items-center border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">Settings</span>
          </div>
          <nav className="flex-1 p-2 space-y-0.5">
            {SETTINGS_PAGES.map(page => (
              <button
                key={page.key}
                onClick={() => setActivePage(page.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activePage === page.key
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 px-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <span className="text-sm font-medium text-neutral-800 dark:text-white">
              {SETTINGS_PAGES.find(p => p.key === activePage)?.label}
            </span>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Supported Models page */}
            {activePage === 'supported-models' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  All models available through the backend. Use the Active Models tab to add models to your workspace.
                </p>
                {modelsLoading && (
                  <p className="text-xs text-neutral-400 text-center py-6">Loading models…</p>
                )}
                {modelsError && (
                  <p className="text-xs text-red-400 text-center py-6">{modelsError}</p>
                )}
                {!modelsLoading && !modelsError && (
                  <div className="space-y-3">
                    <CollapsibleSection title="LiteLLM Models" models={availableModels} />
                    <CollapsibleSection title="Groq Models" models={GROQ_PLACEHOLDER_MODELS} />
                  </div>
                )}
              </div>
            )}

            {/* Theme page */}
            {activePage === 'theme' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Customize the appearance of the application.
                </p>
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <ToggleSwitch
                    label={theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    isEnabled={theme === 'dark'}
                    onToggle={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      theme === 'light'
                        ? 'border-violet-500 bg-white'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div className="h-16 rounded-md bg-neutral-100 border border-neutral-200 mb-2 flex items-center justify-center">
                      <span className="text-lg">☀️</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-violet-500 bg-neutral-800'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div className="h-16 rounded-md bg-neutral-900 border border-neutral-700 mb-2 flex items-center justify-center">
                      <span className="text-lg">🌙</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Dark</p>
                  </button>
                </div>
              </div>
            )}

            {/* Account page (placeholder) */}
            {activePage === 'account' && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <UserIcon />
                </div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Account Settings</p>
                <p className="text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed">
                  Account management features are coming soon. Stay tuned for user profiles, API key management, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
