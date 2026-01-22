export interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string; // The raw content to be summarized
  timestamp: string;
  source: string;
  url: string;
}

export interface SummaryState {
  text: string;
  loading: boolean;
  error: string | null;
}
