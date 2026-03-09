'use client'

import { useState } from 'react'
import { BotIcon } from './Icons'

const MultiModelResponse = ({ message }) => {
  const [activeTab, setActiveTab] = useState(0)
  const { baselineModel, responses, summary, overallSimilarity, timestamp } = message

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
        <BotIcon />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Summary bubble */}
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm">
          <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">{summary}</p>
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400">Similarity: {overallSimilarity}%</span>
            <span className="text-xs text-neutral-300 dark:text-neutral-600">{timestamp}</span>
          </div>
        </div>

        {/* Similarity bars */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Similarity</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            {responses.map((res, i) => {
              const isBaseline = res.model === baselineModel
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-xs w-24 flex-shrink-0 ${isBaseline ? 'text-blue-500 font-medium' : 'text-neutral-600 dark:text-neutral-300'}`}>
                    {res.model}
                    {isBaseline && <span className="ml-1 text-[10px] text-neutral-400 font-normal">base</span>}
                  </span>
                  {!isBaseline ? (
                    <>
                      <div className="flex-1 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${res.similarity}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-400 w-8 text-right tabular-nums">{res.similarity}%</span>
                    </>
                  ) : (
                    <span className="text-xs text-neutral-400 italic">baseline reference</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Individual response tabs */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="flex border-b border-neutral-100 dark:border-neutral-800">
            {responses.map((res, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === i
                    ? 'text-neutral-900 dark:text-white border-b-2 border-violet-500 -mb-px'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                {res.model}
              </button>
            ))}
          </div>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {responses[activeTab].model}
              </span>
              {responses[activeTab].model !== baselineModel && (
                <span className="text-xs text-neutral-400">
                  {responses[activeTab].similarity}% similar to {baselineModel}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {responses[activeTab].response}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiModelResponse
