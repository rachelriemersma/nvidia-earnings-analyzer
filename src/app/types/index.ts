export interface EarningsTranscript {
  id: string;
  quarter: string;
  fiscalYear: number;
  date: string;
  url: string;
  company: string;
  managementRemarks: string;
  qaSection: string;
  fullTranscript: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  keyPhrases: string[];
  reasoning: string;
}

export interface StrategicFocus {
  theme: string;
  mentions: number;
  importance: number;
  quotes: string[];
  category: 'product' | 'market' | 'technology' | 'financial' | 'strategic';
}

export interface QuarterlyInsights {
  transcriptId: string;
  quarter: string;
  managementSentiment: SentimentAnalysis;
  qaSentiment: SentimentAnalysis;
  strategicFocuses: StrategicFocus[];
  keyMetrics: {
    revenue?: string;
    guidance?: string;
    marketCap?: string;
  };
  generatedAt: string;
}

export interface TrendAnalysis {
  quarters: string[];
  sentimentTrend: {
    management: Array<{ quarter: string; score: number; sentiment: string }>;
    qa: Array<{ quarter: string; score: number; sentiment: string }>;
  };
  quarterOverQuarterChanges: {
    quarter: string;
    managementChange: {
      scoreDelta: number;
      sentimentShift: string;
      significance: 'major' | 'moderate' | 'minor';
    };
    qaChange: {
      scoreDelta: number;
      sentimentShift: string;
      significance: 'major' | 'moderate' | 'minor';
    };
  }[];
  strategicEvolution: {
    quarter: string;
    emergingThemes: string[];
    decliningThemes: string[];
    consistentThemes: string[];
  }[];
  overallTrendSummary: {
    managementTrend: 'improving' | 'declining' | 'stable';
    qaTrend: 'improving' | 'declining' | 'stable';
    strategicShift: string;
    keyChanges: string[];
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}