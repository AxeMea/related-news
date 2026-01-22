import React, { useState, useEffect } from 'react';
import NewsList from './components/NewsList';
import NewsSummary from './components/NewsSummary';
import RelatedNews from './components/RelatedNews';
import { NewsItem, SummaryState } from './types';
import { summarizeNewsArticle } from './services/geminiService';
import latestNews from './articles/latest-news.json';

// Mock Data Generation
const MOCK_NEWS: any = latestNews;

const App: React.FC = () => {
  const [newsData] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [summary, setSummary] = useState<SummaryState>({
    text: '',
    loading: false,
    error: null,
  });

  // Calculate "Related" news based on category or just random for mock purposes
  // const relatedNews = React.useMemo(() => {
  //   if (!selectedNews) return [];
  //   return newsData.filter(item => item.id !== selectedNews.id); // Simple filter for demo
  // }, [selectedNews, newsData]);

  useEffect(() => {
    if (selectedNews) {
      console.log(selectedNews)
      const fetchSummary = async () => {
        setSummary({ text: '', loading: true, error: null });
        try {
          // const text = await summarizeNewsArticle(selectedNews.title, selectedNews.content);
          const text = selectedNews.content
          setSummary({ text, loading: false, error: null });
        } catch (err) {
            console.error(err);
          setSummary({ text: '', loading: false, error: 'Failed to generate summary' });
        }
      };
      fetchSummary();
    }
  }, [selectedNews]);

  const handleBack = () => {
    setSelectedNews(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-cyber-black text-gray-200 overflow-hidden font-sans selection:bg-neon-blue selection:text-black">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center px-4 md:px-6 bg-cyber-dark z-20 shadow-md flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-black font-mono">
                    AI
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">这些新闻对家政互联网平台业务提升有帮助<span className="text-neon-blue"></span></h1>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs font-mono text-gray-500">
                <span className="hidden md:inline-block">系统状态: 在线</span>
                <span className="text-neon-blue animate-pulse">● 实时</span>
            </div>
        </header>

        {/* Main Layout */}
        <main className="flex-1 flex overflow-hidden relative">
            
            {/* Left Sidebar: News List */}
            {/* Mobile: Hidden if news selected. Desktop: Always visible (1/3 width) */}
            <aside className={`
                ${selectedNews ? 'hidden md:flex' : 'flex'} 
                w-full md:w-1/3 min-w-[300px] max-w-[450px] h-full z-10 flex-col
            `}>
                <NewsList 
                    news={newsData} 
                    selectedId={selectedNews?.id || null} 
                    onSelect={setSelectedNews} 
                />
            </aside>

            {/* Right Content Area */}
            {/* Mobile: Hidden if NO news selected. Desktop: Always visible (flex-1) */}
            <section className={`
                ${selectedNews ? 'flex' : 'hidden md:flex'} 
                flex-1 flex-col h-full bg-[#08080c]
            `}>
                {/* Top Right: AI Summary (60% height) */}
                <div className="h-[100%] w-full relative">
                     <NewsSummary 
                        selectedNews={selectedNews} 
                        summaryState={summary}
                        onBack={handleBack}
                    />
                </div>

                {/* Bottom Right: Related News (40% height) */}
                {/* <div className="h-[40%] w-full border-l border-gray-800">
                    <RelatedNews 
                        related={relatedNews} 
                        onSelect={setSelectedNews}
                    />
                </div> */}
            </section>
        </main>
    </div>
  );
};

export default App;
