'use client'

import { useState } from 'react'
import { BotIcon } from './Icons'
import { ModelProviderIcon } from './Icons'

const SkeletonLine = ({ width = 'w-full' }) => (
  <div className={`h-3 ${width} rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse`} />
)

const ResponseSkeleton = () => (
  <div className="space-y-2.5 py-1">
    <SkeletonLine />
    <SkeletonLine width="w-5/6" />
    <SkeletonLine width="w-4/6" />
    <SkeletonLine />
    <SkeletonLine width="w-3/4" />
  </div>
)

const SimilaritySkeleton = () => (
  <div className="space-y-3">
    {[1, 2].map(i => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-3 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse flex-shrink-0" />
        <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-3 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>
    ))}
  </div>
)

const MultiModelResponse = ({ message }) => {
  const [activeTab, setActiveTab] = useState(0)
  const { baselineModel, responses, summary, overallSimilarity, timestamp, streaming } = message

  const allDoneStreaming = !streaming && responses.every(r => !r.streaming)

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
        <BotIcon />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Summary bubble */}
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm">
          {summary ? (
            <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">{summary}</p>
          ) : (
            <div className="space-y-1.5">
              <SkeletonLine width="w-3/4" />
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400">
              {allDoneStreaming ? `Similarity: ${overallSimilarity}%` : 'Computing similarity…'}
            </span>
            <span className="text-xs text-neutral-300 dark:text-neutral-600">{timestamp}</span>
          </div>
        </div>

        {/* Similarity bars */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Similarity</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            {!allDoneStreaming ? (
              <SimilaritySkeleton />
            ) : (
              responses.map((res, i) => {
                const isBaseline = res.model === baselineModel
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xs w-28 flex-shrink-0 truncate ${isBaseline ? 'text-blue-500 font-medium' : 'text-neutral-600 dark:text-neutral-300'}`}
                      title={res.model}>
                      {res.model.includes('/') ? res.model.split('/').pop() : res.model}
                      {isBaseline && <span className="ml-1 text-[10px] text-neutral-400 font-normal">base</span>}
                    </span>
                    {!isBaseline ? (
                      res.similarity !== null ? (
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
                        <span className="text-xs text-neutral-400 italic">n/a</span>
                      )
                    ) : (
                      <span className="text-xs text-neutral-400 italic">baseline reference</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Individual response tabs */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="flex border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto">
            {responses.map((res, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 max-w-[10rem] truncate ${
                  activeTab === i
                    ? 'text-neutral-900 dark:text-white border-b-2 border-violet-500 -mb-px'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
                title={res.model}
              >
                <ModelProviderIcon modelId={res.model} size={12} />
                {res.model.includes('/') ? res.model.split('/').pop() : res.model}
                {res.streaming && (
                  <span className="flex gap-0.5 ml-1 flex-shrink-0">
                    <span className="dot animate-dot-bounce" style={{ width: 4, height: 4 }} />
                    <span className="dot animate-dot-bounce" style={{ width: 4, height: 4, animationDelay: '0.2s' }} />
                    <span className="dot animate-dot-bounce" style={{ width: 4, height: 4, animationDelay: '0.4s' }} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 py-4">
            {responses[activeTab] && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ModelProviderIcon modelId={responses[activeTab].model} size={16} />
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">
                      {responses[activeTab].model}
                    </span>
                  </div>
                  {allDoneStreaming && responses[activeTab].model !== baselineModel && responses[activeTab].similarity !== null && (
                    <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                      {responses[activeTab].similarity}% similar
                    </span>
                  )}
                </div>
                {responses[activeTab].streaming && !responses[activeTab].response ? (
                  <ResponseSkeleton />
                ) : (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {responses[activeTab].response}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiModelResponse
