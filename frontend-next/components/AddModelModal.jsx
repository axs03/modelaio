'use client'

import { useState, useEffect } from 'react'
import { CloseIcon, ModelProviderIcon } from './Icons'
import { getAvailableModels } from '../src/services/api'

const GROQ_PLACEHOLDER_MODELS = [
  'groq/llama-3.3-70b-versatile',
  'groq/llama-3.1-8b-instant',
  'groq/mixtral-8x7b-32768',
  'groq/gemma2-9b-it',
]

const AddModelModal = ({ isOpen, onClose, modelSettings, onAddModel, onRemoveModel }) => {
  const [availableModels, setAvailableModels] = useState([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setSearch('')
    setModelsLoading(true)
    setModelsError(null)
    getAvailableModels()
      .then(data => setAvailableModels(data.models))
      .catch(err => setModelsError(err.message))
      .finally(() => setModelsLoading(false))
  }, [isOpen])

  if (!isOpen) return null

  const q = search.toLowerCase()
  const filteredLiteLLM = availableModels.filter(m => m.toLowerCase().includes(q))
  const filteredGroq = GROQ_PLACEHOLDER_MODELS.filter(m => m.toLowerCase().includes(q))

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const renderSection = (models, title) => (
    <div>
      <p className="sticky top-0 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 z-10">
        {title} ({models.length})
      </p>
      {models.length === 0 ? (
        <p className="text-xs text-neutral-400 text-center py-3">No models found.</p>
      ) : (
        models.map(model => {
          const isAdded = !!modelSettings[model]
          return (
            <div
              key={model}
              className="px-4 py-2 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <ModelProviderIcon modelId={model} size={20} />
              <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate flex-1">
                {model}
              </span>
              <button
                onClick={() => isAdded ? onRemoveModel(model) : onAddModel(model)}
                className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                  isAdded
                    ? 'text-green-500 hover:text-red-400 bg-green-50 dark:bg-green-900/20 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-neutral-400 hover:text-violet-500 bg-neutral-100 dark:bg-neutral-800 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                }`}
                title={isAdded ? 'Remove model' : 'Add model'}
              >
                {isAdded ? '✓' : '+'}
              </button>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[480px] max-w-[90vw] h-[540px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">Add Model</span>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models…"
            autoFocus
            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg py-2 px-3 text-xs text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600 transition-colors"
          />
        </div>

        {/* Model list */}
        <div className="flex-1 overflow-y-auto">
          {modelsLoading && (
            <p className="text-xs text-neutral-400 text-center py-8">Loading models…</p>
          )}
          {modelsError && (
            <p className="text-xs text-red-400 text-center py-8 px-4">{modelsError}</p>
          )}
          {!modelsLoading && !modelsError && (
            <>
              {renderSection(filteredLiteLLM, 'LiteLLM Models')}
              {renderSection(filteredGroq, 'Groq Models')}
              {filteredLiteLLM.length === 0 && filteredGroq.length === 0 && (
                <p className="text-xs text-neutral-400 text-center py-8">No models match your search.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddModelModal
