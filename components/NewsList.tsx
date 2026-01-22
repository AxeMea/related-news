import React, { useState, useMemo, useEffect } from 'react';
import { NewsItem } from '../types';

interface NewsListProps {
  news: NewsItem[];
  selectedId: string | null;
  onSelect: (item: NewsItem) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, selectedId, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(news.map(item => item.category));
    return ['ALL', ...Array.from(cats)];
  }, [news]);

  // Filter news based on active category
  const filteredNews = useMemo(() => {
    if (activeCategory === 'ALL') return news;
    return news.filter(item => item.category === activeCategory);
  }, [news, activeCategory]);

  useEffect(() => {
    onSelect(news[0])
  }, [news]);

  return (
    <div className="h-full flex flex-col bg-cyber-dark border-r border-gray-800">
      {/* <div className="p-4 border-b border-gray-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-neon-blue font-mono text-sm tracking-widest uppercase glow-text">
            // 分类
          </h2>
          <span className="text-xs text-gray-500 font-mono animate-pulse">{filteredNews.length} 活跃</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] px-3 py-1 rounded-sm border font-mono transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.2)]'
                  : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div> */}
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {filteredNews.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full text-left p-4 rounded-sm border transition-all duration-300 group relative overflow-hidden ${
              selectedId === item.id
                ? 'bg-white/5 border-neon-blue/50 text-white shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            {selectedId === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue shadow-[0_0_10px_#00f3ff]"></div>
            )}
            
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                selectedId === item.id ? 'bg-neon-blue/20 text-neon-blue' : 'bg-gray-800 text-gray-500'
              }`}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">{item.source}</a>
              </span>
              <span className="text-[10px] font-mono text-gray-600">{item.timestamp}</span>
            </div>
            
            <h3 className={`font-sans font-medium leading-snug ${
              selectedId === item.id ? 'text-gray-100' : 'text-gray-400'
            }`}>
              {item.title}
            </h3>
          </button>
        ))}
        
        {filteredNews.length === 0 && (
            <div className="p-8 text-center text-gray-600 font-mono text-xs">
                NO STREAMS FOUND
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;