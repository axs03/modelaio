import React, { useState } from 'react';
import { BotIcon } from './Icons';

const SkeletonLoader = () => (
    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded h-4 w-full"></div>
);

const SkeletonBar = () => (
    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 w-full"></div>
);

const MultiModelResponse = ({ message }) => {
    const [activeTab, setActiveTab] = useState(0);
    const baselineModel = message.baselineModel;
    const isLoading = message.isLoading || false;
    const responses = message.responses || [];
    
    // Ensure activeTab is valid
    const safeActiveTab = activeTab < responses.length ? activeTab : 0;

    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 shadow-lg bg-blue-600">
                <BotIcon />
            </div>
            <div className="w-full max-w-3xl space-y-4">
                {/* Model Responses Comparison */}
                <div className="p-4 rounded-lg shadow-md bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Model Responses Comparison</h3>
                    <div className="space-y-4">
                        {isLoading ? (
                            // Skeleton loaders for model comparison
                            responses.map((_, index) => (
                                <div key={index} className="grid grid-cols-6 gap-4 items-center">
                                    <div className="col-span-2">
                                        <div className="w-2/3"><SkeletonLoader /></div>
                                    </div>
                                    <div className="col-span-4 flex items-center gap-2">
                                        <SkeletonBar />
                                        <div className="w-12"><SkeletonLoader /></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            responses.map((res, index) => {
                                const isBaseline = res.model === baselineModel;
                                return (
                                    <div key={index} className="grid grid-cols-6 gap-4 items-center">
                                        <div className={`col-span-2 font-medium ${
                                            isBaseline 
                                                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {res.model}
                                        </div>
                                        <div className="col-span-4 flex items-center gap-2">
                                            {isBaseline ? (
                                                <span className="text-sm italic text-blue-600 dark:text-blue-400">Baseline Model</span>
                                            ) : (
                                                <>
                                                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${res.similarity}%` }}></div>
                                                    </div>
                                                    <span className="font-semibold text-gray-800 dark:text-white w-12 text-right">{res.similarity}%</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Individual Responses */}
                <div className="p-4 rounded-lg shadow-md bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Individual Responses</h3>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-300 dark:border-white/10 mb-4">
                        {responses.map((res, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${safeActiveTab === index
                                        ? 'border-b-2 border-blue-500 text-gray-800 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                                    } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                {res.model}
                            </button>
                        ))}
                    </div>
                    {/* Tab Content */}
                    <div>
                        {isLoading ? (
                            <>
                                <div className="w-1/4 mb-2"><SkeletonLoader /></div>
                                <div className="w-1/3 mb-4"><SkeletonLoader /></div>
                                <div className="space-y-2">
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <div className="w-3/4"><SkeletonLoader /></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 className="font-semibold text-gray-800 dark:text-white">{responses[safeActiveTab]?.model || 'Unknown Model'}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Similarity to {baselineModel}: {responses[safeActiveTab]?.model === baselineModel ? 'N/A' : `${responses[safeActiveTab]?.similarity || 0}%`}
                                </p>
                                <p className="leading-relaxed text-gray-800 dark:text-gray-200">{responses[safeActiveTab]?.response || ''}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiModelResponse;