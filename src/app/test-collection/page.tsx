'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  data?: {
    collected: number;
    saved: number;
    stats: { transcripts: number; insights: number };
    sampleTranscript: {
      id: string;
      quarter: string;
      date: string;
      managementRemarksLength: number;
      qaSectionLength: number;
      participants: number;
    };
  };
  error?: string;
}

export default function TestCollectionPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      console.log('🚀 Starting data collection test...');
      
      const response = await fetch('/api/test-collection');
      const result = await response.json();
      
      setTestResult(result);
      
      if (result.success) {
        console.log('✅ Test completed successfully!', result);
      } else {
        console.error('❌ Test failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Test request failed:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to run test'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        📊 Data Collection Test
      </h1>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">What This Test Does:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Creates sample NVIDIA earnings transcripts</li>
            <li>✅ Tests saving transcripts to database</li>
            <li>✅ Tests retrieving transcripts from database</li>
            <li>✅ Verifies transcript data structure</li>
            <li>✅ Shows database statistics</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={runTest}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? '🔄 Running Test...' : '🚀 Run Data Collection Test'}
          </button>
          
          {testResult && (
            <button
              onClick={() => setTestResult(null)}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Clear Results
            </button>
          )}
        </div>

        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              🔄 Running data collection test... This may take a few seconds.
            </p>
          </div>
        )}

        {testResult && (
          <div className={`p-6 border rounded-lg ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.success ? '✅ Test Results' : '❌ Test Failed'}
            </h2>
            
            <p className={`mb-4 ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>

            {testResult.error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}

            {testResult.success && testResult.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border rounded">
                    <h3 className="font-semibold">Transcripts Collected</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {testResult.data.collected}
                    </p>
                  </div>
                  <div className="p-3 bg-white border rounded">
                    <h3 className="font-semibold">Transcripts Saved</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {testResult.data.saved}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded">
                  <h3 className="font-semibold mb-2">Sample Transcript Info:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Quarter:</strong> {testResult.data.sampleTranscript.quarter}</div>
                    <div><strong>ID:</strong> {testResult.data.sampleTranscript.id}</div>
                    <div><strong>Date:</strong> {new Date(testResult.data.sampleTranscript.date).toLocaleDateString()}</div>
                    <div><strong>Participants:</strong> {testResult.data.sampleTranscript.participants}</div>
                    <div><strong>Management Remarks:</strong> {testResult.data.sampleTranscript.managementRemarksLength.toLocaleString()} characters</div>
                    <div><strong>Q&A Section:</strong> {testResult.data.sampleTranscript.qaSectionLength.toLocaleString()} characters</div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded">
                  <h3 className="font-semibold mb-2">Database Stats:</h3>
                  <div className="text-sm">
                    <div><strong>Total Transcripts:</strong> {testResult.data.stats.transcripts}</div>
                    <div><strong>Total Insights:</strong> {testResult.data.stats.insights}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">📝 Note:</h3>
          <p className="text-yellow-700 text-sm">
            This test uses sample data since we haven't implemented real web scraping yet. 
            The sample data mimics the structure of real NVIDIA earnings transcripts.
          </p>
        </div>
      </div>
    </div>
  );
} 
