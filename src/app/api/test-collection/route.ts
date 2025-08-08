import { NextResponse } from 'next/server';
import { createTranscriptCollector } from '@/app/lib/transcript-collector';
import { db } from '@/app/lib/database';

export async function GET() {
  try {
    console.log('🔍 Testing data collection...');
    
    // Create the transcript collector
    const collector = createTranscriptCollector();
    
    // Test collecting transcripts (this will use sample data for now)
    const transcripts = await collector.collectNvidiaTranscripts(2); // Just get 2 for testing
    
    console.log(`📄 Collected ${transcripts.length} transcripts`);
    
    // Test saving to database
    for (const transcript of transcripts) {
      await db.saveTranscript(transcript);
      console.log(`💾 Saved transcript: ${transcript.quarter}`);
    }
    
    // Test retrieving from database
    const savedTranscripts = await db.getAllTranscripts();
    console.log(`🔍 Retrieved ${savedTranscripts.length} transcripts from database`);
    
    // Get database stats
    const stats = await db.getStats();
    
    return NextResponse.json({
      success: true,
      message: 'Data collection test completed successfully!',
      data: {
        collected: transcripts.length,
        saved: savedTranscripts.length,
        stats: stats,
        sampleTranscript: {
          id: transcripts[0]?.id,
          quarter: transcripts[0]?.quarter,
          date: transcripts[0]?.date,
          managementRemarksLength: transcripts[0]?.managementRemarks?.length || 0,
          qaSectionLength: transcripts[0]?.qaSection?.length || 0,
          participants: transcripts[0]?.participants?.length || 0
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Data collection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Data collection test failed'
    }, { status: 500 });
  }
} 
