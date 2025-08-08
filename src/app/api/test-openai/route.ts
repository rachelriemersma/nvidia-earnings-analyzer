import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured',
        message: 'Please add OPENAI_API_KEY to your .env.local file'
      }, { status: 400 });
    }

    console.log('🤖 Testing OpenAI connection...');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Test 1: Simple completion test
    console.log('📝 Testing basic completion...');
    const testCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Respond with exactly these words: 'OpenAI connection successful'"
        }
      ],
      max_tokens: 10,
      temperature: 0
    });

    const basicResponse = testCompletion.choices[0]?.message?.content || '';
    console.log('✅ Basic test response:', basicResponse);

    // Test 2: Sentiment analysis test
    console.log('📊 Testing sentiment analysis...');
    const sentimentTest = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analyzer. Respond only with valid JSON."
        },
        {
          role: "user",
          content: `Analyze the sentiment of this text and respond with JSON:
          
          "We had an exceptional quarter with record-breaking revenue growth and strong demand across all our product lines."
          
          Format: {"sentiment": "positive|neutral|negative", "confidence": 0.0-1.0, "reasoning": "brief explanation"}`
        }
      ],
      max_tokens: 150,
      temperature: 0
    });

    const sentimentResponse = sentimentTest.choices[0]?.message?.content || '';
    console.log('✅ Sentiment test response:', sentimentResponse);

    let parsedSentiment;
    try {
      parsedSentiment = JSON.parse(sentimentResponse);
    } catch (e) {
      parsedSentiment = { error: 'Failed to parse JSON', raw: sentimentResponse };
    }

    // Test 3: Strategic focus extraction test
    console.log('🎯 Testing strategic focus extraction...');
    const strategicTest = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract key strategic themes from earnings call transcripts. Respond only with valid JSON."
        },
        {
          role: "user",
          content: `Extract 3 key strategic themes from this transcript excerpt:
          
          "Our AI and data center business continues to see unprecedented demand. We're expanding our automotive partnerships and seeing strong growth in gaming with our RTX platform. Cloud computing remains a key focus area."
          
          Format: {"themes": [{"theme": "theme name", "category": "product|market|technology", "mentions": number}]}`
        }
      ],
      max_tokens: 200,
      temperature: 0.1
    });

    const strategicResponse = strategicTest.choices[0]?.message?.content || '';
    console.log('✅ Strategic test response:', strategicResponse);

    let parsedStrategic;
    try {
      parsedStrategic = JSON.parse(strategicResponse);
    } catch (e) {
      parsedStrategic = { error: 'Failed to parse JSON', raw: strategicResponse };
    }

    // Calculate total tokens used (approximate)
    const totalTokens = (testCompletion.usage?.total_tokens || 0) + 
                       (sentimentTest.usage?.total_tokens || 0) + 
                       (strategicTest.usage?.total_tokens || 0);

    return NextResponse.json({
      success: true,
      message: 'OpenAI integration test completed successfully!',
      data: {
        apiKeyConfigured: true,
        basicTest: {
          success: basicResponse.includes('successful'),
          response: basicResponse
        },
        sentimentTest: {
          success: parsedSentiment && !parsedSentiment.error,
          response: parsedSentiment
        },
        strategicTest: {
          success: parsedStrategic && !parsedStrategic.error,
          response: parsedStrategic
        },
        usage: {
          totalTokens: totalTokens,
          estimatedCost: `$${(totalTokens * 0.002 / 1000).toFixed(4)}` // Rough estimate
        }
      }
    });

  } catch (error) {
    console.error('❌ OpenAI test failed:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Check for common OpenAI errors
    if (errorMessage.includes('api_key')) {
      errorMessage = 'Invalid API key. Please check your OpenAI API key in .env.local';
    } else if (errorMessage.includes('quota')) {
      errorMessage = 'OpenAI quota exceeded. Please check your OpenAI account billing.';
    } else if (errorMessage.includes('rate_limit')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'OpenAI integration test failed'
    }, { status: 500 });
  }
}
 
