'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, FileText } from 'lucide-react';

interface Transcript {
  id: string;
  quarter: string;
  managementRemarks: string;
  qaSection: string;
  fullTranscript: string;
  url: string;
  participants: string[];
  date: string;
}

interface TranscriptViewerProps {
  transcripts: Transcript[];
  selectedQuarter: string;
}

export function TranscriptViewer({ transcripts, selectedQuarter }: TranscriptViewerProps) {
  const [expandedSection, setExpandedSection] = useState<'management' | 'qa' | 'full' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTranscript = transcripts.find(t => t.quarter === selectedQuarter);

  if (!currentTranscript) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Earnings Call Transcript</span>
        </h3>
        <p className="text-gray-400">No transcript available for selected quarter.</p>
      </div>
    );
  }

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-300 text-black px-1 rounded">{part}</mark> : 
        part
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Earnings Call Transcript - {selectedQuarter}</span>
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(currentTranscript.date)} • {currentTranscript.participants.length} participants
          </p>
        </div>
        
        {/* Source Link */}
        <a
          href={currentTranscript.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-sm flex items-center space-x-1 transition-colors"
        >
          <span>View Original</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Participants */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Participants:</h4>
        <div className="flex flex-wrap gap-2">
          {currentTranscript.participants.map((participant, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
              {participant}
            </span>
          ))}
        </div>
      </div>

      {/* Transcript Sections */}
      <div className="space-y-4">
        
        {/* Management Prepared Remarks */}
        <div className="border border-gray-700 rounded-lg">
          <button
            onClick={() => setExpandedSection(expandedSection === 'management' ? null : 'management')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors rounded-t-lg"
          >
            <div>
              <h4 className="font-semibold text-white">Management Prepared Remarks</h4>
              <p className="text-sm text-gray-400">
                {currentTranscript.managementRemarks.length.toLocaleString()} characters
              </p>
            </div>
            {expandedSection === 'management' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'management' && (
            <div className="p-4 border-t border-gray-700 bg-gray-750">
              <div className="prose prose-invert max-w-none text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {highlightSearchTerm(currentTranscript.managementRemarks)}
              </div>
            </div>
          )}
          
          {expandedSection !== 'management' && (
            <div className="p-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 italic">
                {highlightSearchTerm(truncateText(currentTranscript.managementRemarks))}
              </p>
              <button 
                onClick={() => setExpandedSection('management')}
                className="text-green-400 hover:text-green-300 text-xs mt-2 transition-colors"
              >
                Click to expand full remarks
              </button>
            </div>
          )}
        </div>

        {/* Q&A Section */}
        <div className="border border-gray-700 rounded-lg">
          <button
            onClick={() => setExpandedSection(expandedSection === 'qa' ? null : 'qa')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors rounded-t-lg"
          >
            <div>
              <h4 className="font-semibold text-white">Questions & Answers Session</h4>
              <p className="text-sm text-gray-400">
                {currentTranscript.qaSection.length.toLocaleString()} characters
              </p>
            </div>
            {expandedSection === 'qa' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'qa' && (
            <div className="p-4 border-t border-gray-700 bg-gray-750">
              <div className="prose prose-invert max-w-none text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {highlightSearchTerm(currentTranscript.qaSection)}
              </div>
            </div>
          )}
          
          {expandedSection !== 'qa' && (
            <div className="p-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 italic">
                {highlightSearchTerm(truncateText(currentTranscript.qaSection))}
              </p>
              <button 
                onClick={() => setExpandedSection('qa')}
                className="text-green-400 hover:text-green-300 text-xs mt-2 transition-colors"
              >
                Click to expand full Q&A session
              </button>
            </div>
          )}
        </div>

        {/* Full Transcript Option */}
        <div className="border border-gray-700 rounded-lg">
          <button
            onClick={() => setExpandedSection(expandedSection === 'full' ? null : 'full')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors rounded-t-lg"
          >
            <div>
              <h4 className="font-semibold text-white">Complete Transcript</h4>
              <p className="text-sm text-gray-400">
                {currentTranscript.fullTranscript.length.toLocaleString()} characters total
              </p>
            </div>
            {expandedSection === 'full' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'full' && (
            <div className="p-4 border-t border-gray-700 bg-gray-750 max-h-96 overflow-y-auto">
              <div className="prose prose-invert max-w-none text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {highlightSearchTerm(currentTranscript.fullTranscript)}
              </div>
            </div>
          )}
          
          {expandedSection !== 'full' && (
            <div className="p-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                View the complete earnings call transcript with both prepared remarks and Q&A session.
              </p>
              <button 
                onClick={() => setExpandedSection('full')}
                className="text-green-400 hover:text-green-300 text-xs mt-2 transition-colors"
              >
                Click to view complete transcript
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
        <p>
          Transcript data collected from public sources. Search functionality highlights matching terms.
          {searchTerm && (
            <span className="text-yellow-400 ml-2">
              Searching for: "{searchTerm}"
            </span>
          )}
        </p>
      </div>
    </div>
  );
} 
