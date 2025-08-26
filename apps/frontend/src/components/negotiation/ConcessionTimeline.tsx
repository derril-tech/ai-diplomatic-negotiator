'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Timeline, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Target,
  Filter,
  Download,
  Play,
  Pause
} from 'lucide-react';

interface Concession {
  id: string;
  round_number: number;
  party_id: string;
  party_name: string;
  issue_id: string;
  issue_title: string;
  previous_value: number;
  new_value: number;
  concession_amount: number;
  concession_percentage: number;
  timestamp: string;
  rationale: string;
  strategy: string;
}

interface ConcessionTimelineProps {
  negotiationId: string;
  concessions: Concession[];
  onConcessionClick?: (concession: Concession) => void;
}

export function ConcessionTimeline({ 
  negotiationId, 
  concessions, 
  onConcessionClick 
}: ConcessionTimelineProps) {
  const [filterParty, setFilterParty] = useState<string>('all');
  const [filterIssue, setFilterIssue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'round' | 'amount' | 'time'>('round');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  const parties = Array.from(new Set(concessions.map(c => c.party_name)));
  const issues = Array.from(new Set(concessions.map(c => c.issue_title)));

  const filteredConcessions = concessions.filter(concession => {
    const matchesParty = filterParty === 'all' || concession.party_name === filterParty;
    const matchesIssue = filterIssue === 'all' || concession.issue_title === filterIssue;
    return matchesParty && matchesIssue;
  });

  const sortedConcessions = [...filteredConcessions].sort((a, b) => {
    switch (sortBy) {
      case 'round':
        return a.round_number - b.round_number;
      case 'amount':
        return Math.abs(b.concession_amount) - Math.abs(a.concession_amount);
      case 'time':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      default:
        return 0;
    }
  });

  const getConcessionColor = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount > 10) return 'bg-red-100 text-red-800';
    if (absAmount > 5) return 'bg-orange-100 text-orange-800';
    if (absAmount > 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getConcessionIcon = (amount: number) => {
    return amount > 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalConcessions = () => {
    return concessions.reduce((total, concession) => total + Math.abs(concession.concession_amount), 0);
  };

  const getAverageConcession = () => {
    return concessions.length > 0 ? getTotalConcessions() / concessions.length : 0;
  };

  const getConcessionTrend = () => {
    if (concessions.length < 2) return 'stable';
    const recent = concessions.slice(-3);
    const avgRecent = recent.reduce((sum, c) => sum + Math.abs(c.concession_amount), 0) / recent.length;
    const avgOverall = getAverageConcession();
    return avgRecent > avgOverall ? 'increasing' : 'decreasing';
  };

  const exportTimeline = () => {
    const data = {
      negotiation_id: negotiationId,
      concessions: sortedConcessions,
      summary: {
        total_concessions: getTotalConcessions(),
        average_concession: getAverageConcession(),
        trend: getConcessionTrend(),
        total_rounds: Math.max(...concessions.map(c => c.round_number))
      },
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concession-timeline-${negotiationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timeline className="w-5 h-5" />
            Concession Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button size="sm" variant="outline" onClick={exportTimeline}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Party:</span>
            <select
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="all">All Parties</option>
              {parties.map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Issue:</span>
            <select
              value={filterIssue}
              onChange={(e) => setFilterIssue(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="all">All Issues</option>
              {issues.map(issue => (
                <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="round">Round</option>
              <option value="amount">Amount</option>
              <option value="time">Time</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {concessions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Concessions</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {getTotalConcessions().toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {getAverageConcession().toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...concessions.map(c => c.round_number))}
              </div>
              <div className="text-sm text-muted-foreground">Rounds</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {sortedConcessions.map((concession, index) => (
              <div
                key={concession.id}
                className={`relative p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  onConcessionClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onConcessionClick?.(concession)}
              >
                {/* Timeline connector */}
                {index < sortedConcessions.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Round indicator */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      R{concession.round_number}
                    </span>
                  </div>

                  {/* Concession details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{concession.party_name}</span>
                        <Badge variant="outline">{concession.issue_title}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getConcessionColor(concession.concession_amount)}>
                          {getConcessionIcon(concession.concession_amount)}
                          {Math.abs(concession.concession_amount).toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(concession.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Value change */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">{concession.previous_value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{concession.new_value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Change:</span>
                        <span className={`font-medium ${
                          concession.concession_amount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {concession.concession_amount > 0 ? '+' : ''}{concession.concession_amount.toFixed(1)}
                          ({concession.concession_percentage > 0 ? '+' : ''}{concession.concession_percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* Strategy and rationale */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Strategy:</span>
                        <span className="ml-2 capitalize">{concession.strategy.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rationale:</span>
                        <span className="ml-2">{concession.rationale}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sortedConcessions.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Timeline className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No concessions found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
