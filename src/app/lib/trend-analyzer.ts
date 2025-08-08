import { QuarterlyInsights, TrendAnalysis, StrategicFocus } from '@/app/types';

export class TrendAnalyzer {
  /**
   * Analyze quarter-over-quarter changes in sentiment and strategic focus
   */
  analyzeQuarterOverQuarter(insights: QuarterlyInsights[]): TrendAnalysis {
    // Sort insights by quarter chronologically
    const sortedInsights = this.sortInsightsByQuarter(insights);
    
    if (sortedInsights.length < 2) {
      return this.getEmptyTrendAnalysis(sortedInsights);
    }

    const quarters = sortedInsights.map(i => i.quarter);
    
    // Analyze sentiment trends
    const sentimentTrend = this.analyzeSentimentTrends(sortedInsights);
    
    // Analyze quarter-over-quarter changes
    const quarterOverQuarterChanges = this.analyzeQuarterChanges(sortedInsights);
    
    // Analyze strategic theme evolution
    const strategicEvolution = this.analyzeStrategicEvolution(sortedInsights);
    
    // Generate overall trend summary
    const overallTrendSummary = this.generateTrendSummary(sentimentTrend, strategicEvolution);

    return {
      quarters,
      sentimentTrend,
      quarterOverQuarterChanges,
      strategicEvolution,
      overallTrendSummary
    };
  }

  private sortInsightsByQuarter(insights: QuarterlyInsights[]): QuarterlyInsights[] {
    return insights.sort((a, b) => {
      const aQuarter = this.parseQuarter(a.quarter);
      const bQuarter = this.parseQuarter(b.quarter);
      
      // Sort by year first, then by quarter
      if (aQuarter.year !== bQuarter.year) {
        return aQuarter.year - bQuarter.year;
      }
      return aQuarter.q - bQuarter.q;
    });
  }

  private parseQuarter(quarter: string): { q: number; year: number } {
    const match = quarter.match(/Q(\d+)\s+(\d+)/);
    if (!match) {
      throw new Error(`Invalid quarter format: ${quarter}`);
    }
    return { q: parseInt(match[1]), year: parseInt(match[2]) };
  }

  private analyzeSentimentTrends(insights: QuarterlyInsights[]) {
    return {
      management: insights.map(i => ({
        quarter: i.quarter,
        score: i.managementSentiment?.score || 0,
        sentiment: i.managementSentiment?.sentiment || 'neutral'
      })),
      qa: insights.map(i => ({
        quarter: i.quarter,
        score: i.qaSentiment?.score || 0,
        sentiment: i.qaSentiment?.sentiment || 'neutral'
      }))
    };
  }

  private analyzeQuarterChanges(insights: QuarterlyInsights[]) {
    const changes = [];
    
    for (let i = 1; i < insights.length; i++) {
      const current = insights[i];
      const previous = insights[i - 1];
      
      const mgmtScoreDelta = (current.managementSentiment?.score || 0) - (previous.managementSentiment?.score || 0);
      const qaScoreDelta = (current.qaSentiment?.score || 0) - (previous.qaSentiment?.score || 0);
      
      changes.push({
        quarter: current.quarter,
        managementChange: {
          scoreDelta: mgmtScoreDelta,
          sentimentShift: this.describeSentimentShift(
            previous.managementSentiment?.sentiment || 'neutral',
            current.managementSentiment?.sentiment || 'neutral'
          ),
          significance: this.getChangeSignificance(mgmtScoreDelta)
        },
        qaChange: {
          scoreDelta: qaScoreDelta,
          sentimentShift: this.describeSentimentShift(
            previous.qaSentiment?.sentiment || 'neutral',
            current.qaSentiment?.sentiment || 'neutral'
          ),
          significance: this.getChangeSignificance(qaScoreDelta)
        }
      });
    }
    
    return changes;
  }

  private describeSentimentShift(from: string, to: string): string {
    if (from === to) return 'No change';
    
    const sentimentOrder = { negative: 0, neutral: 1, positive: 2 };
    const fromScore = sentimentOrder[from as keyof typeof sentimentOrder] || 1;
    const toScore = sentimentOrder[to as keyof typeof sentimentOrder] || 1;
    
    if (toScore > fromScore) return `Improved from ${from} to ${to}`;
    if (toScore < fromScore) return `Declined from ${from} to ${to}`;
    return 'No change';
  }

  private getChangeSignificance(scoreDelta: number): 'major' | 'moderate' | 'minor' {
    const absChange = Math.abs(scoreDelta);
    if (absChange >= 0.5) return 'major';
    if (absChange >= 0.2) return 'moderate';
    return 'minor';
  }

  private analyzeStrategicEvolution(insights: QuarterlyInsights[]) {
    const evolution = [];
    
    for (let i = 0; i < insights.length; i++) {
      const current = insights[i];
      const previous = i > 0 ? insights[i - 1] : null;
      
      const currentThemes = new Set(current.strategicFocuses?.map(f => f.theme) || []);
      const previousThemes = new Set(previous?.strategicFocuses?.map(f => f.theme) || []);
      
      const emergingThemes = [...currentThemes].filter(theme => !previousThemes.has(theme));
      const decliningThemes = previous ? [...previousThemes].filter(theme => !currentThemes.has(theme)) : [];
      const consistentThemes = [...currentThemes].filter(theme => previousThemes.has(theme));
      
      evolution.push({
        quarter: current.quarter,
        emergingThemes,
        decliningThemes,
        consistentThemes
      });
    }
    
    return evolution;
  }

  private generateTrendSummary(sentimentTrend: any, strategicEvolution: any[]) {
    const managementTrend = this.calculateOverallTrend(sentimentTrend.management);
    const qaTrend = this.calculateOverallTrend(sentimentTrend.qa);
    
    // Find most common emerging themes
    const allEmergingThemes = strategicEvolution.flatMap(e => e.emergingThemes);
    const strategicShift = this.getMostCommonTheme(allEmergingThemes) || 'No significant strategic shifts detected';
    
    const keyChanges = this.identifyKeyChanges(sentimentTrend, strategicEvolution);
    
    return {
      managementTrend,
      qaTrend,
      strategicShift,
      keyChanges
    };
  }

  private calculateOverallTrend(sentimentData: Array<{ score: number }>): 'improving' | 'declining' | 'stable' {
    if (sentimentData.length < 2) return 'stable';
    
    const firstScore = sentimentData[0].score;
    const lastScore = sentimentData[sentimentData.length - 1].score;
    const difference = lastScore - firstScore;
    
    if (difference > 0.2) return 'improving';
    if (difference < -0.2) return 'declining';
    return 'stable';
  }

  private getMostCommonTheme(themes: string[]): string | null {
    if (themes.length === 0) return null;
    
    const frequency: Record<string, number> = {};
    themes.forEach(theme => {
      frequency[theme] = (frequency[theme] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  private identifyKeyChanges(sentimentTrend: any, strategicEvolution: any[]): string[] {
    const changes: string[] = [];
    
    // Check for significant sentiment changes
    const mgmtTrend = this.calculateOverallTrend(sentimentTrend.management);
    const qaTrend = this.calculateOverallTrend(sentimentTrend.qa);
    
    if (mgmtTrend === 'improving') {
      changes.push('Management sentiment has improved over time');
    } else if (mgmtTrend === 'declining') {
      changes.push('Management sentiment has declined over time');
    }
    
    if (qaTrend === 'improving') {
      changes.push('Q&A sentiment has become more positive');
    } else if (qaTrend === 'declining') {
      changes.push('Q&A sentiment has become more negative');
    }
    
    // Check for strategic theme changes
    const allEmergingThemes = strategicEvolution.flatMap(e => e.emergingThemes);
    if (allEmergingThemes.length > 0) {
      changes.push(`New strategic focus areas emerged: ${allEmergingThemes.slice(0, 2).join(', ')}`);
    }
    
    return changes.length > 0 ? changes : ['No significant changes detected across quarters'];
  }

  private getEmptyTrendAnalysis(insights: QuarterlyInsights[]): TrendAnalysis {
    return {
      quarters: insights.map(i => i.quarter),
      sentimentTrend: {
        management: insights.map(i => ({
          quarter: i.quarter,
          score: i.managementSentiment?.score || 0,
          sentiment: i.managementSentiment?.sentiment || 'neutral'
        })),
        qa: insights.map(i => ({
          quarter: i.quarter,
          score: i.qaSentiment?.score || 0,
          sentiment: i.qaSentiment?.sentiment || 'neutral'
        }))
      },
      quarterOverQuarterChanges: [],
      strategicEvolution: insights.map(i => ({
        quarter: i.quarter,
        emergingThemes: [],
        decliningThemes: [],
        consistentThemes: i.strategicFocuses?.map(f => f.theme) || []
      })),
      overallTrendSummary: {
        managementTrend: 'stable',
        qaTrend: 'stable',
        strategicShift: 'Insufficient data for trend analysis',
        keyChanges: ['Need at least 2 quarters for comparison']
      }
    };
  }
}

export function createTrendAnalyzer(): TrendAnalyzer {
  return new TrendAnalyzer();
}
 
