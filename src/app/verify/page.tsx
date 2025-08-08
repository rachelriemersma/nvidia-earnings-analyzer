export default function VerifyPage() {
  // These will be checked on the server side
  const checks = {
    openai: !!process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    cacheTtl: process.env.TRANSCRIPT_CACHE_TTL,
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">
        🔍 Setup Verification
      </h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>OpenAI API Key:</span>
              <span className={checks.openai ? 'text-green-600' : 'text-red-600'}>
                {checks.openai ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Node Environment:</span>
              <span className="text-blue-600">{checks.nodeEnv || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cache TTL:</span>
              <span className="text-blue-600">{checks.cacheTtl || 'Default'}</span>
            </div>
          </div>
        </div>

        {!checks.openai && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ Action Required</h3>
            <p className="text-red-700">
              OpenAI API key is missing. Add it to your `.env.local` file:
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
              OPENAI_API_KEY=sk-your-key-here
            </code>
          </div>
        )}

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
          <ul className="space-y-1 text-gray-700">
            <li>✅ Next.js development server running</li>
            <li className={checks.openai ? 'text-green-600' : 'text-gray-400'}>
              {checks.openai ? '✅' : '⏳'} Environment variables configured
            </li>
            <li className="text-gray-400">⏳ Test data collection</li>
            <li className="text-gray-400">⏳ Test AI analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}