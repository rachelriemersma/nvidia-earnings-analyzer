'use client';

import { useState } from 'react';

interface AnalysisResult {
  success: boolean;
  message: string;
  data?: {
    insights: any[];
    summary: {
      transcriptsProcessed: number;
      insightsGenerated: number;
      quarters: string[];
      completedAt: string;
    };
    trends: {
      quarters: string[];
      sentimentTrend: {
        management: Array<{ quarter: string; score: number; sentiment: string }>;
        qa: Array<{ quarter: string; score: number; sentiment: string }>;
      };
      quarterOverQuarterChanges: Array<{
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
      }>;
      strategicEvolution: Array<{
        quarter: string;
        emergingThemes: string[];
        decliningThemes: string[];
        consistentThemes: string[];
      }>;
      overallTrendSummary: {
        managementTrend: 'improving' | 'declining' | 'stable';
        qaTrend: 'improving' | 'declining' | 'stable';
        strategicShift: string;
        keyChanges: string[];
      };
    };
  };
  error?: string;
}

export default function TestAnalysisPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🚀 Starting full analysis pipeline...');
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarters: 4, reanalyze: false }) // FIXED: Now analyzes 4 quarters
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        console.log('✅ Analysis pipeline completed!', data);
      } else {
        console.error('❌ Analysis failed:', data.error);
      }
      
    } catch (error) {
      console.error('❌ Request failed:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to run analysis pipeline'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeColor = (significance: string) => {
    switch (significance) {
      case 'major': return 'text-red-600 font-bold';
      case 'moderate': return 'text-orange-600 font-semibold';
      case 'minor': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">
        🧠 Complete Analysis Pipeline Test
      </h1>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Full Backend Pipeline:</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1️⃣ Collect NVIDIA earnings transcripts (4 quarters)</li>
            <li>2️⃣ Run AI sentiment analysis on management remarks</li>
            <li>3️⃣ Run AI sentiment analysis on Q&A session</li>
            <li>4️⃣ Extract strategic themes and focuses</li>
            <li>5️⃣ Analyze quarter-over-quarter trends</li>
            <li>6️⃣ Save all insights to database</li>
          </ol>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">🎉 What You'll Get:</h3>
          <p className="text-green-700 text-sm">
            Complete AI-powered insights about NVIDIA's earnings including sentiment analysis, 
            strategic themes, and quarter-over-quarter trend analysis!
          </p>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isLoading}
          className={`px-8 py-4 rounded-lg font-semibold text-lg ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isLoading ? '🔄 Running Full Analysis...' : '🧠 Run Complete Analysis Pipeline (4 Quarters)'}
        </button>

        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-semibold">
              🔄 Running complete analysis pipeline...
            </p>
            <p className="text-blue-600 text-sm mt-1">
              This will take 60-90 seconds as we analyze 4 quarters with multiple AI analyses. 
              You'll see comprehensive NVIDIA earnings insights when complete!
            </p>
          </div>
        )}

        {result && (
          <div className={`p-6 border rounded-lg ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? '🎉 Analysis Complete!' : '❌ Analysis Failed'}
            </h2>
            
            <p className={`mb-4 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>

            {result.error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {result.success && result.data && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white border rounded text-center">
                    <h3 className="font-semibold">Transcripts</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      {result.data.summary.transcriptsProcessed}
                    </p>
                  </div>
                  <div className="p-3 bg-white border rounded text-center">
                    <h3 className="font-semibold">Insights</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {result.data.summary.insightsGenerated}
                    </p>
                  </div>
                  <div className="p-3 bg-white border rounded text-center">
                    <h3 className="font-semibold">Quarters</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {result.data.summary.quarters.length}
                    </p>
                  </div>
                </div>

                {/* Analyzed Quarters */}
                <div className="p-4 bg-white border rounded">
                  <h3 className="font-semibold mb-2">Analyzed Quarters:</h3>
                  <div className="flex gap-2">
                    {result.data.summary.quarters.map((quarter, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {quarter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quarter-over-Quarter Trend Analysis */}
                {result.data.trends && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      📈 Quarter-over-Quarter Trend Analysis
                    </h3>

                    {/* Overall Trend Summary */}
                    <div className="p-4 bg-white border rounded">
                      <h4 className="font-semibold mb-2">Overall Trends:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Management Sentiment:</strong>{' '}
                          <span className={getTrendColor(result.data.trends.overallTrendSummary.managementTrend)}>
                            {result.data.trends.overallTrendSummary.managementTrend}
                          </span>
                        </div>
                        <div>
                          <strong>Q&A Sentiment:</strong>{' '}
                          <span className={getTrendColor(result.data.trends.overallTrendSummary.qaTrend)}>
                            {result.data.trends.overallTrendSummary.qaTrend}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong>Strategic Shift:</strong> {result.data.trends.overallTrendSummary.strategicShift}
                      </div>
                    </div>

                    {/* Quarter-by-Quarter Changes */}
                    {result.data.trends.quarterOverQuarterChanges.length > 0 && (
                      <div className="p-4 bg-white border rounded">
                        <h4 className="font-semibold mb-3">Quarter-by-Quarter Changes:</h4>
                        <div className="space-y-3">
                          {result.data.trends.quarterOverQuarterChanges.map((change, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4">
                              <h5 className="font-semibold text-blue-800">{change.quarter}</h5>
                              <div className="text-sm space-y-1">
                                <div>
                                  <strong>Management:</strong>{' '}
                                  <span className={getChangeColor(change.managementChange.significance)}>
                                    {change.managementChange.sentimentShift} ({change.managementChange.scoreDelta > 0 ? '+' : ''}{change.managementChange.scoreDelta.toFixed(2)})
                                  </span>
                                </div>
                                <div>
                                  <strong>Q&A:</strong>{' '}
                                  <span className={getChangeColor(change.qaChange.significance)}>
                                    {change.qaChange.sentimentShift} ({change.qaChange.scoreDelta > 0 ? '+' : ''}{change.qaChange.scoreDelta.toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic Theme Evolution */}
                    {result.data.trends.strategicEvolution.length > 0 && (
                      <div className="p-4 bg-white border rounded">
                        <h4 className="font-semibold mb-3">Strategic Theme Evolution:</h4>
                        <div className="space-y-3">
                          {result.data.trends.strategicEvolution.map((evolution, index) => (
                            <div key={index} className="border-l-4 border-green-200 pl-4">
                              <h5 className="font-semibold text-green-800">{evolution.quarter}</h5>
                              <div className="text-sm space-y-1">
                                {evolution.emergingThemes.length > 0 && (
                                  <div>
                                    <strong className="text-green-600">New Themes:</strong> {evolution.emergingThemes.join(', ')}
                                  </div>
                                )}
                                {evolution.decliningThemes.length > 0 && (
                                  <div>
                                    <strong className="text-red-600">Declining Themes:</strong> {evolution.decliningThemes.join(', ')}
                                  </div>
                                )}
                                {evolution.consistentThemes.length > 0 && (
                                  <div>
                                    <strong className="text-gray-600">Consistent Themes:</strong> {evolution.consistentThemes.slice(0, 3).join(', ')}
                                    {evolution.consistentThemes.length > 3 && '...'}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Changes */}
                    <div className="p-4 bg-white border rounded">
                      <h4 className="font-semibold mb-2">Key Changes Identified:</h4>
                      <ul className="text-sm space-y-1">
                        {result.data.trends.overallTrendSummary.keyChanges.map((change, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Sample Individual Insight */}
                {result.data.insights.length > 0 && (
                  <div className="p-4 bg-white border rounded">
                    <h3 className="font-semibold mb-2">Sample Insight (Latest Quarter):</h3>
                    <div className="text-sm space-y-1">
                      <div><strong>Quarter:</strong> {result.data.insights[0].quarter}</div>
                      <div><strong>Management Sentiment:</strong> {result.data.insights[0].managementSentiment?.sentiment} (score: {result.data.insights[0].managementSentiment?.score?.toFixed(2)})</div>
                      <div><strong>Q&A Sentiment:</strong> {result.data.insights[0].qaSentiment?.sentiment} (score: {result.data.insights[0].qaSentiment?.score?.toFixed(2)})</div>
                      <div><strong>Strategic Themes:</strong> {result.data.insights[0].strategicFocuses?.length} identified</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}