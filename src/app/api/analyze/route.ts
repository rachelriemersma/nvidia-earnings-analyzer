import { NextResponse } from 'next/server';
import { createTranscriptCollector } from '@/app/lib/transcript-collector';
import { AnalysisEngine } from '@/app/lib/analysis-engine';
import { createTrendAnalyzer } from '@/app/lib/trend-analyzer';
import { db } from '@/app/lib/database';
import { APIResponse, QuarterlyInsights, TrendAnalysis } from '@/app/types';

export async function POST(request: Request) {
  try {
    const { quarters = 4, reanalyze = false } = await request.json();
    
    console.log(`🚀 Starting full analysis pipeline for ${quarters} quarters...`);

    // Step 1: Get transcripts
    console.log('📊 Step 1: Collecting transcripts...');
    const collector = createTranscriptCollector();
    const transcripts = await collector.collectNvidiaTranscripts(quarters);
    
    if (transcripts.length === 0) {
      throw new Error('No transcripts found to analyze');
    }

    // Save transcripts to database
    for (const transcript of transcripts) {
      await db.saveTranscript(transcript);
    }
    console.log(`✅ Saved ${transcripts.length} transcripts to database`);

    // Step 2: Run AI analysis
    console.log('🤖 Step 2: Running AI analysis...');
    const analysisEngine = new AnalysisEngine();
    
    let allInsights: QuarterlyInsights[] = [];
    
    if (reanalyze) {
      // Force re-analysis
      allInsights = await analysisEngine.analyzeMultipleTranscripts(transcripts);
    } else {
      // Check for existing insights first
      const existingInsights = await db.getAllInsights();
      const analyzedTranscriptIds = new Set(existingInsights.map(i => i.transcriptId));
      
      const needAnalysis = transcripts.filter(t => !analyzedTranscriptIds.has(t.id));
      
      if (needAnalysis.length > 0) {
        console.log(`🔍 Analyzing ${needAnalysis.length} new transcripts...`);
        const newInsights = await analysisEngine.analyzeMultipleTranscripts(needAnalysis);
        allInsights = [...existingInsights, ...newInsights];
      } else {
        console.log('✅ Using existing analysis results');
        allInsights = existingInsights;
      }
    }

    // Step 3: Save insights
    console.log('💾 Step 3: Saving insights...');
    for (const insights of allInsights) {
      await db.saveInsights(insights);
    }

    // Step 4: Generate quarter-over-quarter trend analysis
    console.log('📈 Step 4: Analyzing quarter-over-quarter trends...');
    const trendAnalyzer = createTrendAnalyzer();
    const trendAnalysis = trendAnalyzer.analyzeQuarterOverQuarter(allInsights);

    // Step 5: Generate summary
    const summary = {
      transcriptsProcessed: transcripts.length,
      insightsGenerated: allInsights.length,
      quarters: allInsights.map(i => i.quarter),
      completedAt: new Date().toISOString()
    };

    console.log('🎉 Analysis pipeline completed successfully!');

    const response: APIResponse<{ insights: QuarterlyInsights[]; summary: typeof summary; trends: TrendAnalysis }> = {
      success: true,
      data: {
        insights: allInsights,
        summary,
        trends: trendAnalysis
      },
      message: `Successfully analyzed ${allInsights.length} quarters with trend analysis`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Analysis pipeline failed:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Analysis pipeline failed'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return existing insights and generate trends if we have data
    const insights = await db.getAllInsights();
    const stats = await db.getStats();

    let trends: TrendAnalysis | null = null;
    if (insights.length > 1) {
      const trendAnalyzer = createTrendAnalyzer();
      trends = trendAnalyzer.analyzeQuarterOverQuarter(insights);
    }

    const summary = {
      transcriptsProcessed: insights.length,
      insightsGenerated: insights.length,
      quarters: insights.map(i => i.quarter),
      completedAt: new Date().toISOString()
    };

    const response: APIResponse<{ insights: QuarterlyInsights[]; stats: typeof stats; trends: TrendAnalysis | null; summary: typeof summary }> = {
      success: true,
      data: {
        insights,
        stats,
        trends,
        summary
      },
      message: `Retrieved ${insights.length} existing insights`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Failed to retrieve insights:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}