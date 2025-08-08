import OpenAI from 'openai';
import { EarningsTranscript, QuarterlyInsights, SentimentAnalysis, StrategicFocus } from '@/app/types';
import { sleep } from './utils';

export class AnalysisEngine {
  private openai: OpenAI;
  private readonly rateLimitDelay = 1000; // 1 second between API calls

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Analyze a single transcript and return complete insights
   */
  async analyzeTranscript(transcript: EarningsTranscript): Promise<QuarterlyInsights> {
    console.log(`🔍 Analyzing transcript for ${transcript.quarter}...`);

    try {
      // Run all analyses in parallel to save time
      const [managementSentiment, qaSentiment, strategicFocuses] = await Promise.all([
        this.analyzeMgmtSentiment(transcript.managementRemarks),
        this.analyzeQASentiment(transcript.qaSection),
        this.extractStrategicFocus(transcript.fullTranscript)
      ]);

      // Extract key metrics from the transcript
      const keyMetrics = this.extractKeyMetrics(transcript.fullTranscript);

      const insights: QuarterlyInsights = {
        transcriptId: transcript.id,
        quarter: transcript.quarter,
        managementSentiment,
        qaSentiment,
        strategicFocuses,
        keyMetrics,
        generatedAt: new Date().toISOString()
      };

      console.log(`✅ Analysis complete for ${transcript.quarter}`);
      return insights;

    } catch (error) {
      console.error(`❌ Analysis failed for ${transcript.quarter}:`, error);
      throw error;
    }
  }

  /**
   * Analyze multiple transcripts with rate limiting
   */
  async analyzeMultipleTranscripts(transcripts: EarningsTranscript[]): Promise<QuarterlyInsights[]> {
    console.log(`🚀 Starting analysis of ${transcripts.length} transcripts...`);
    
    const results: QuarterlyInsights[] = [];
    
    for (const transcript of transcripts) {
      try {
        const insights = await this.analyzeTranscript(transcript);
        results.push(insights);
        
        // Rate limiting - wait between requests
        if (transcripts.indexOf(transcript) < transcripts.length - 1) {
          await sleep(this.rateLimitDelay);
        }
        
      } catch (error) {
        console.error(`Failed to analyze ${transcript.quarter}:`, error);
        // Continue with other transcripts even if one fails
      }
    }

    console.log(`🎉 Completed analysis of ${results.length}/${transcripts.length} transcripts`);
    return results;
  }

  /**
   * Analyze management sentiment from prepared remarks
   */
  private async analyzeMgmtSentiment(managementRemarks: string): Promise<SentimentAnalysis> {
    const prompt = `Analyze the sentiment of these management prepared remarks from an earnings call.

Text: "${managementRemarks.substring(0, 2000)}..." 

Respond with valid JSON only:
{
  "sentiment": "positive" | "neutral" | "negative",
  "score": number between -1 and 1,
  "confidence": number between 0 and 1,
  "keyPhrases": ["phrase1", "phrase2", "phrase3"],
  "reasoning": "brief explanation of the sentiment assessment"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial sentiment analyzer. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      });

      const content = response.choices[0]?.message?.content || '';
      return JSON.parse(content);

    } catch (error) {
      console.error('Error analyzing management sentiment:', error);
      return this.getDefaultSentiment();
    }
  }

  /**
   * Analyze Q&A session sentiment
   */
  private async analyzeQASentiment(qaSection: string): Promise<SentimentAnalysis> {
    const prompt = `Analyze the overall tone and sentiment of this Q&A session from an earnings call. Consider both the questions asked and management's responses.

Text: "${qaSection.substring(0, 2000)}..."

Respond with valid JSON only:
{
  "sentiment": "positive" | "neutral" | "negative",
  "score": number between -1 and 1,
  "confidence": number between 0 and 1,
  "keyPhrases": ["phrase1", "phrase2", "phrase3"],
  "reasoning": "brief explanation focusing on Q&A dynamics"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst expert at reading Q&A dynamics. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      });

      const content = response.choices[0]?.message?.content || '';
      return JSON.parse(content);

    } catch (error) {
      console.error('Error analyzing Q&A sentiment:', error);
      return this.getDefaultSentiment();
    }
  }

  /**
   * Extract strategic focuses and themes
   */
  private async extractStrategicFocus(fullTranscript: string): Promise<StrategicFocus[]> {
    const prompt = `Extract 3-5 key strategic themes from this NVIDIA earnings call transcript. Focus on business priorities, growth areas, and strategic initiatives.

Text: "${fullTranscript.substring(0, 3000)}..."

Respond with valid JSON only:
{
  "themes": [
    {
      "theme": "specific theme name",
      "mentions": number_of_mentions,
      "importance": score_0_to_1,
      "quotes": ["supporting quote 1", "supporting quote 2"],
      "category": "product" | "market" | "technology" | "financial" | "strategic"
    }
  ]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a business strategy analyst specializing in technology companies. Extract key strategic themes and respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content || '';
      const parsed = JSON.parse(content);
      return parsed.themes || [];

    } catch (error) {
      console.error('Error extracting strategic focus:', error);
      return this.getDefaultStrategicFocus();
    }
  }

  /**
   * Extract key financial metrics mentioned in transcript
   */
  private extractKeyMetrics(transcript: string): { revenue?: string; guidance?: string; marketCap?: string } {
    const metrics: { revenue?: string; guidance?: string; marketCap?: string } = {};

    // Simple regex patterns to extract common metrics
    const revenueMatch = transcript.match(/revenue.*?(\$[\d.]+ billion)/i);
    if (revenueMatch) {
      metrics.revenue = revenueMatch[1];
    }

    const guidanceMatch = transcript.match(/guidance.*?(\$[\d.]+ billion)/i);
    if (guidanceMatch) {
      metrics.guidance = guidanceMatch[1];
    }

    return metrics;
  }

  /**
   * Fallback sentiment analysis
   */
  private getDefaultSentiment(): SentimentAnalysis {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0.5,
      keyPhrases: ['analysis unavailable'],
      reasoning: 'Unable to analyze sentiment due to API error'
    };
  }

  /**
   * Fallback strategic focus
   */
  private getDefaultStrategicFocus(): StrategicFocus[] {
    return [
      {
        theme: 'General Business Operations',
        mentions: 1,
        importance: 0.5,
        quotes: ['Analysis unavailable'],
        category: 'strategic'
      }
    ];
  }
} 
