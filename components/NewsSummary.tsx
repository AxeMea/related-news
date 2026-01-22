import React from 'react';
import { NewsItem, SummaryState } from '../types';
import markdownit from 'markdown-it'

const md = markdownit()

interface NewsSummaryProps {
  selectedNews: NewsItem | null;
  summaryState: SummaryState;
  onBack?: () => void;
}

const NewsSummary: React.FC<NewsSummaryProps> = ({ selectedNews, summaryState, onBack }) => {
  if (!selectedNews) {
    return (
      <div className="h-full flex items-center justify-center bg-cyber-dark text-gray-600 font-mono text-sm border-b border-gray-800">
        <div className="text-center">
          <p className="mb-2 opacity-50 text-4xl">⚠️</p>
          <p>WAITING FOR TARGET SELECTION...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-cyber-dark border-b border-gray-800 relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                {/* Mobile Back Button */}
                {onBack && (
                  <button 
                    onClick={onBack}
                    className="md:hidden mr-2 p-1 rounded-sm border border-gray-800 text-neon-blue hover:bg-gray-800 transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                )}
                
                <div className="hidden md:block h-2 w-2 bg-neon-purple rounded-full animate-pulse"></div>
                <h2 className="text-neon-purple font-mono text-xs md:text-sm tracking-widest uppercase truncate max-w-[150px] md:max-w-none">
                // AI 分析
                </h2>
            </div>
            
            <a 
              href={selectedNews.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-1.5 border border-gray-800 bg-gray-900/50 hover:border-neon-blue hover:text-neon-blue text-gray-400 transition-all duration-300 rounded-sm"
            >
              <span className="text-[10px] font-mono tracking-wider">源链接</span>
              <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
        </div>

        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 font-sans tracking-tight">
          {selectedNews.title}
        </h1>
        
        <div className="flex flex-wrap gap-y-2 items-center space-x-4 mb-6 text-xs font-mono text-gray-500 border-b border-gray-800 pb-4">
            <span>SRC: {selectedNews.source}</span>
            <span>ID: {selectedNews.id}</span>
            <span className="hidden sm:inline">TS: {selectedNews.timestamp}</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          {summaryState.loading ? (
            <div className="space-y-3 animate-pulse">
               <div className="h-2 bg-gray-800 rounded w-3/4"></div>
               <div className="h-2 bg-gray-800 rounded w-full"></div>
               <div className="h-2 bg-gray-800 rounded w-5/6"></div>
               <div className="mt-4 flex items-center space-x-2">
                   <span className="text-neon-blue text-xs font-mono">正在拉取...</span>
               </div>
            </div>
          ) : (
            <div className="markdown-content text-gray-300 leading-relaxed font-sans text-base md:text-lg space-y-4" dangerouslySetInnerHTML={{ __html: md.render(summaryState.text) }}>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsSummary;
