import React from 'react';
import { NewsItem } from '../types';

interface RelatedNewsProps {
  related: NewsItem[];
  onSelect: (item: NewsItem) => void;
}

const RelatedNews: React.FC<RelatedNewsProps> = ({ related, onSelect }) => {
  return (
    <div className="h-full bg-cyber-gray flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-cyber-dark/50">
        <h2 className="text-gray-400 font-mono text-xs tracking-widest uppercase">
          // Correlated Events
        </h2>
        <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-600"></div>
            <div className="w-1 h-1 bg-gray-600"></div>
            <div className="w-1 h-1 bg-gray-600"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-gray-600 font-mono text-xs">
                NO CORRELATION FOUND
            </div>
        ) : (
            related.map((item) => (
            <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="text-left bg-[#0f0f16] border border-gray-800 p-3 hover:border-gray-600 transition-colors group h-32 flex flex-col justify-between"
            >
                <h4 className="text-sm font-medium text-gray-300 group-hover:text-neon-blue transition-colors line-clamp-2">
                {item.title}
                </h4>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">{item.category}</span>
                    <span className="text-[10px] text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity">
                        → READ
                    </span>
                </div>
            </button>
            ))
        )}
      </div>
    </div>
  );
};

export default RelatedNews;
