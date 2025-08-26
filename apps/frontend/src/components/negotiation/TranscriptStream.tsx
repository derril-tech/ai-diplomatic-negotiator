'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Settings, 
  Filter,
  Search,
  Download,
  Pause,
  Play
} from 'lucide-react';

interface TranscriptEntry {
  id: string;
  timestamp: string;
  party_name: string;
  party_id: string;
  message_type: 'offer' | 'comment' | 'concession' | 'rejection' | 'acceptance';
  content: string;
  issue_title?: string;
  proposed_value?: number;
  confidence?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface TranscriptStreamProps {
  negotiationId: string;
  isLive?: boolean;
  onEntryClick?: (entry: TranscriptEntry) => void;
}

export function TranscriptStream({ 
  negotiationId, 
  isLive = true, 
  onEntryClick 
}: TranscriptStreamProps) {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'offers' | 'comments' | 'concessions'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTranscript();
    if (isLive) {
      const interval = setInterval(() => {
        if (!isPaused) {
          loadNewEntries();
        }
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [negotiationId, isLive, isPaused]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);

  const loadTranscript = async () => {
    try {
      // TODO: Load from API
      const mockEntries: TranscriptEntry[] = [
        {
          id: '1',
          timestamp: '2024-12-19T15:30:00Z',
          party_name: 'United States',
          party_id: 'us-1',
          message_type: 'offer',
          content: 'US proposes 25% tariff reduction on clean energy imports',
          issue_title: 'Clean Energy Tariffs',
          proposed_value: 25,
          confidence: 0.85,
          sentiment: 'positive'
        },
        {
          id: '2',
          timestamp: '2024-12-19T15:32:00Z',
          party_name: 'European Union',
          party_id: 'eu-1',
          message_type: 'comment',
          content: 'EU acknowledges US proposal but seeks clarification on implementation timeline',
          sentiment: 'neutral'
        },
        {
          id: '3',
          timestamp: '2024-12-19T15:35:00Z',
          party_name: 'European Union',
          party_id: 'eu-1',
          message_type: 'offer',
          content: 'EU counter-proposes 15% tariff reduction with 3-year phase-in period',
          issue_title: 'Clean Energy Tariffs',
          proposed_value: 15,
          confidence: 0.78,
          sentiment: 'positive'
        },
        {
          id: '4',
          timestamp: '2024-12-19T15:38:00Z',
          party_name: 'United States',
          party_id: 'us-1',
          message_type: 'concession',
          content: 'US willing to consider 20% reduction if EU accepts immediate implementation',
          sentiment: 'positive'
        }
      ];
      setEntries(mockEntries);
    } catch (error) {
      console.error('Error loading transcript:', error);
    }
  };

  const loadNewEntries = async () => {
    try {
      // TODO: Load only new entries from API
      const newEntry: TranscriptEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        party_name: Math.random() > 0.5 ? 'United States' : 'European Union',
        party_id: Math.random() > 0.5 ? 'us-1' : 'eu-1',
        message_type: 'comment',
        content: 'New negotiation activity detected...',
        sentiment: 'neutral'
      };
      setEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Error loading new entries:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesFilter = filter === 'all' || entry.message_type === filter;
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.party_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'offer':
        return 'bg-blue-100 text-blue-800';
      case 'concession':
        return 'bg-green-100 text-green-800';
      case 'rejection':
        return 'bg-red-100 text-red-800';
      case 'acceptance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportTranscript = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-${negotiationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Negotiation Transcript
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLive && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={exportTranscript}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex items-center gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Messages</option>
            <option value="offer">Offers</option>
            <option value="comment">Comments</option>
            <option value="concession">Concessions</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  onEntryClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onEntryClick?.(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{entry.party_name}</span>
                    <Badge className={getMessageTypeColor(entry.message_type)}>
                      {entry.message_type}
                    </Badge>
                    {entry.sentiment && (
                      <span className="text-lg">{getSentimentIcon(entry.sentiment)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(entry.timestamp)}
                  </div>
                </div>
                
                <p className="text-sm mb-2">{entry.content}</p>
                
                {entry.issue_title && (
                  <div className="text-xs text-muted-foreground mb-1">
                    Issue: {entry.issue_title}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {entry.proposed_value !== undefined && (
                    <span>Value: {entry.proposed_value}</span>
                  )}
                  {entry.confidence !== undefined && (
                    <span>Confidence: {Math.round(entry.confidence * 100)}%</span>
                  )}
                </div>
              </div>
            ))}
            
            {filteredEntries.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transcript entries found</p>
                {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
