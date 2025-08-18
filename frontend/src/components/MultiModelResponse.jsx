/*
================================================================================
| FILE: src/components/MultiModelResponse.jsx
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
import React, { useState } from 'react';
import { BotIcon } from './Icons';

const MultiModelResponse = ({ message }) => {
    const [activeTab, setActiveTab] = useState(0);
    const baselineModel = message.baselineModel;

    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 shadow-lg bg-purple-600 text-white">
                <BotIcon />
            </div>
            <div className="w-full max-w-3xl space-y-4">
                <div className="p-4 rounded-lg shadow-md bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 border border-black/10 dark:border-white/10">
                    <p className="leading-relaxed">{message.summary}</p>
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">Overall Similarity Score: {message.overallSimilarity}%</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-500">{message.timestamp}</p>
                </div>

                <div className="p-4 rounded-lg shadow-md bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-black/10 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Model Responses Comparison</h3>
                    <div className="space-y-4">
                        {message.responses.map((res, index) => {
                            const isBaseline = res.model === baselineModel;
                            return (
                                <div key={index} className="grid grid-cols-6 gap-4 items-center">
                                    <div className={`col-span-2 font-medium ${isBaseline ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {res.model} {isBaseline && <span className="text-xs font-normal text-gray-500 dark:text-gray-500">(Baseline)</span>}
                                    </div>
                                    <div className="col-span-4 flex items-center gap-2">
                                        {!isBaseline && (
                                            <>
                                                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                                                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${res.similarity}%` }}></div>
                                                </div>
                                                <span className="font-semibold text-gray-800 dark:text-white w-12 text-right">{res.similarity}%</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 rounded-lg shadow-md bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-black/10 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Individual Responses</h3>
                    <div className="flex border-b border-black/10 dark:border-white/10 mb-4">
                        {message.responses.map((res, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === index
                                        ? 'border-b-2 border-purple-500 text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {res.model}
                            </button>
                        ))}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{message.responses[activeTab].model}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Similarity to {baselineModel}: {message.responses[activeTab].model === baselineModel ? 'N/A' : `${message.responses[activeTab].similarity}%`}
                        </p>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-200">{message.responses[activeTab].response}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiModelResponse;
