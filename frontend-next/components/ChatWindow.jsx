'use client'

import { useState, useRef, useEffect } from 'react'
import MultiModelResponse from './MultiModelResponse'
import { SendIcon, UserIcon, BotIcon } from './Icons'

const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center">
      <BotIcon />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-1.5 h-4">
        <span className="dot animate-dot-bounce" />
        <span className="dot animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
        <span className="dot animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  </div>
)

const UserMessage = ({ message }) => (
  <div className="flex items-end gap-2.5 justify-end animate-fade-in">
    <div className="max-w-md">
      <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-violet-600 text-white text-sm leading-relaxed">
        {message.text}
      </div>
      <p className="text-[11px] mt-1 text-right text-neutral-400">{message.timestamp}</p>
    </div>
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mb-5">
      <UserIcon />
    </div>
  </div>
)

const EmptyState = ({ enabledModelsCount, setSidebarView }) => (
  <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
    <div className="h-11 w-11 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
      </svg>
    </div>
    <div>
      <h2 className="text-base font-semibold text-neutral-800 dark:text-white mb-1.5">model.aio</h2>
      <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
        {enabledModelsCount < 2
          ? <>Enable at least 2 models in{' '}
              <button
                onClick={() => setSidebarView('settings')}
                className="text-violet-500 hover:text-violet-400 underline underline-offset-2 transition-colors"
              >
                settings
              </button>{' '}
              to start comparing responses.</>
          : 'Send a message to compare responses across your selected models.'
        }
      </p>
    </div>
  </div>
)

const ChatWindow = ({
  enabledModelsCount,
  enabledModelNames,
  baselineModelName,
  messages: messagesProp,
  setMessages,
  setSidebarView,
}) => {
  const messages = Array.isArray(messagesProp) ? messagesProp : []
  const [input, setInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const chatEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiTyping])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const canSend = !isAiTyping && enabledModelsCount >= 2 && !!baselineModelName

  const handleSend = () => {
    if (!input.trim() || !canSend) return

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
    })
    const userMessage = { id: Date.now(), text: input, sender: 'user', timestamp }

    setMessages([...messages, userMessage])
    setInput('')
    setIsAiTyping(true)

    setTimeout(() => {
      const multiModelResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'multi-model',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
        }),
        summary: `${enabledModelsCount} model${enabledModelsCount > 1 ? 's have' : ' has'} responded. Review their answers and similarity scores below.`,
        overallSimilarity: 71,
        baselineModel: baselineModelName,
        responses: enabledModelNames.map(name => ({
          model: name,
          response: `${name}'s response to: "${userMessage.text}". This is a placeholder answer with some detail.`,
          similarity: Math.floor(Math.random() * (95 - 60 + 1) + 60),
        })),
      }
      setIsAiTyping(false)
      setMessages(prev => [...prev, multiModelResponse])
    }, 2500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!canSend) {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 4000)
      } else {
        handleSend()
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="h-14 px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5 flex-shrink-0 bg-white dark:bg-neutral-950">
        <span className="text-sm font-medium text-neutral-800 dark:text-white">Chat</span>
        {enabledModelsCount > 0 && (
          <span className="text-xs text-neutral-500 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {enabledModelsCount} model{enabledModelsCount > 1 && 's'}
          </span>
        )}
        {baselineModelName && (
          <span className="text-xs text-neutral-500 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            Baseline: {baselineModelName}
          </span>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {Array.isArray(messages) && messages.length === 0 && !isAiTyping ? (
          <EmptyState enabledModelsCount={enabledModelsCount} setSidebarView={setSidebarView} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
            {(Array.isArray(messages) ? messages : []).map((msg) => {
              if (msg.sender === 'user') return <UserMessage key={msg.id} message={msg} />
              if (msg.type === 'multi-model') return <MultiModelResponse key={msg.id} message={msg} />
              return null
            })}
            {isAiTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={enabledModelsCount >= 2 ? 'Message… (Shift+Enter for new line)' : 'Enable models in settings to start'}
              rows={1}
              disabled={isAiTyping || enabledModelsCount === 0}
              className="flex-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-sm text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 resize-none leading-relaxed transition-colors disabled:opacity-50"
              style={{ minHeight: '48px', maxHeight: '160px' }}
            />
            <div className="relative flex-shrink-0">
              <button
                onClick={handleSend}
                disabled={!canSend || !input.trim()}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 text-xs text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl">
                  Select a baseline and enable 2+ models in{' '}
                  <button
                    onClick={() => setSidebarView('settings')}
                    className="text-violet-400 hover:text-violet-300 underline transition-colors"
                  >
                    settings
                  </button>.
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ChatWindow
