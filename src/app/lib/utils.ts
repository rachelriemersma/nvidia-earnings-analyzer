import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatQuarter(quarter: string): string {
  return quarter.replace(/Q(\d+)\s+(\d+)/, 'Q$1 $2');
}

export function parseQuarter(quarter: string): { q: number; year: number } {
  const match = quarter.match(/Q(\d+)\s+(\d+)/);
  if (!match) throw new Error(`Invalid quarter format: ${quarter}`);
  return { q: parseInt(match[1]), year: parseInt(match[2]) };
}

export function getQuartersBefore(currentQuarter: string, count: number = 4): string[] {
  const { q, year } = parseQuarter(currentQuarter);
  const quarters: string[] = [];
  
  let currentQ = q;
  let currentYear = year;
  
  for (let i = 0; i < count; i++) {
    quarters.push(`Q${currentQ} ${currentYear}`);
    currentQ--;
    if (currentQ === 0) {
      currentQ = 4;
      currentYear--;
    }
  }
  
  return quarters;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}