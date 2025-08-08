'use client';

import { useState } from 'react';

interface OpenAITestResult {
  success: boolean;
  message: string;
  data?: {
    apiKeyConfigured: boolean;
    basicTest: {
      success: boolean;
      response: string;
    };
    sentimentTest: {
      success: boolean;
      response: any;
    };
    strategicTest: {
      success: boolean;
      response: any;
    };
    usage: {
      totalTokens: number;
      estimatedCost: string;
    };
  };
  error?: string;
}

export default function TestOpenAIPage() {
  const [testResult, setTestResult] = useState<OpenAITestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      console.log('🚀 Starting OpenAI integration test...');
      
      const response = await fetch('/api/test-openai');
      const result = await response.json();
      
      setTestResult(result);
      
      if (result.success) {
        console.log('✅ OpenAI test completed successfully!', result);
      } else {
        console.error('❌ OpenAI test failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Test request failed:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to run OpenAI test'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">
        🤖 OpenAI Integration Test
      </h1>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">What This Test Does:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Verifies your OpenAI API key is working</li>
            <li>✅ Tests basic AI text completion</li>
            <li>✅ Tests sentiment analysis with JSON response</li>
            <li>✅ Tests strategic theme extraction</li>
            <li>✅ Shows token usage and estimated costs</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💰 Cost Information:</h3>
          <p className="text-blue-700 text-sm">
            This test uses ~300-500 tokens, costing approximately $0.001-0.002 (less than a penny).
            Your full application will use roughly $1-5 during development.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={runTest}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isLoading ? '🔄 Testing OpenAI...' : '🤖 Run OpenAI Test'}
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
              🔄 Testing OpenAI integration... This will take 10-15 seconds.
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
              {testResult.success ? '✅ OpenAI Test Results' : '❌ OpenAI Test Failed'}
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
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-3 border rounded ${
                    testResult.data.basicTest.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                  }`}>
                    <h3 className="font-semibold">Basic Connection</h3>
                    <p className="text-sm">
                      {testResult.data.basicTest.success ? '✅ Working' : '❌ Failed'}
                    </p>
                  </div>
                  <div className={`p-3 border rounded ${
                    testResult.data.sentimentTest.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                  }`}>
                    <h3 className="font-semibold">Sentiment Analysis</h3>
                    <p className="text-sm">
                      {testResult.data.sentimentTest.success ? '✅ Working' : '❌ Failed'}
                    </p>
                  </div>
                  <div className={`p-3 border rounded ${
                    testResult.data.strategicTest.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                  }`}>
                    <h3 className="font-semibold">Strategic Analysis</h3>
                    <p className="text-sm">
                      {testResult.data.strategicTest.success ? '✅ Working' : '❌ Failed'}
                    </p>
                  </div>
                </div>

                {testResult.data.sentimentTest.success && (
                  <div className="p-4 bg-white border rounded">
                    <h3 className="font-semibold mb-2">Sample Sentiment Analysis:</h3>
                    <div className="text-sm space-y-1">
                      <div><strong>Sentiment:</strong> {testResult.data.sentimentTest.response.sentiment}</div>
                      <div><strong>Confidence:</strong> {testResult.data.sentimentTest.response.confidence}</div>
                      <div><strong>Reasoning:</strong> {testResult.data.sentimentTest.response.reasoning}</div>
                    </div>
                  </div>
                )}

                {testResult.data.strategicTest.success && (
                  <div className="p-4 bg-white border rounded">
                    <h3 className="font-semibold mb-2">Sample Strategic Themes:</h3>
                    <div className="text-sm">
                      {testResult.data.strategicTest.response.themes?.map((theme: any, index: number) => (
                        <div key={index} className="mb-1">
                          <strong>{theme.theme}</strong> ({theme.category})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-white border rounded">
                  <h3 className="font-semibold mb-2">Usage Stats:</h3>
                  <div className="text-sm">
                    <div><strong>Tokens Used:</strong> {testResult.data.usage.totalTokens}</div>
                    <div><strong>Estimated Cost:</strong> {testResult.data.usage.estimatedCost}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">🔑 Troubleshooting:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li><strong>Invalid API Key:</strong> Double-check your OPENAI_API_KEY in .env.local</li>
            <li><strong>Quota Exceeded:</strong> Add billing info to your OpenAI account</li>
            <li><strong>Rate Limit:</strong> Wait a moment and try again</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
