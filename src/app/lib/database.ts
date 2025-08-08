import { EarningsTranscript, QuarterlyInsights } from '@/app/types';

class InMemoryDatabase {
  private transcripts: Map<string, EarningsTranscript> = new Map();
  private insights: Map<string, QuarterlyInsights> = new Map();

  async saveTranscript(transcript: EarningsTranscript): Promise<void> {
    this.transcripts.set(transcript.id, transcript);
  }

  async getTranscript(id: string): Promise<EarningsTranscript | null> {
    return this.transcripts.get(id) || null;
  }

  async getAllTranscripts(): Promise<EarningsTranscript[]> {
    return Array.from(this.transcripts.values());
  }

  async getTranscriptsByQuarters(quarters: string[]): Promise<EarningsTranscript[]> {
    return Array.from(this.transcripts.values())
      .filter(t => quarters.includes(t.quarter));
  }

  async saveInsights(insights: QuarterlyInsights): Promise<void> {
    this.insights.set(insights.transcriptId, insights);
  }

  async getInsights(transcriptId: string): Promise<QuarterlyInsights | null> {
    return this.insights.get(transcriptId) || null;
  }

  async getAllInsights(): Promise<QuarterlyInsights[]> {
    return Array.from(this.insights.values());
  }

  async clear(): Promise<void> {
    this.transcripts.clear();
    this.insights.clear();
  }

  async getStats(): Promise<{ transcripts: number; insights: number }> {
    return {
      transcripts: this.transcripts.size,
      insights: this.insights.size
    };
  }
}

export const db = new InMemoryDatabase();