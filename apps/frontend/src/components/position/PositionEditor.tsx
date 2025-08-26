'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PositionView } from './PositionView';
import { HistorianContext } from './HistorianContext';
import { Edit, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

interface Party {
  id: string;
  name: string;
  type: 'country' | 'organization' | 'individual';
  country?: string;
  organization?: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'distributive' | 'integrative' | 'linked';
  weight: number;
  minValue: number;
  maxValue: number;
  unit?: string;
}

interface Position {
  stance: string;
  interests: {
    primary: string;
    secondary: string;
    constraints: string;
  };
  arguments: string[];
  evidence: string[];
  negotiation_approach: string;
  flexibility_level: string;
}

interface PrivatePosition {
  priority_level: string;
  flexibility: string;
  strategy: string;
  internal_interests: {
    core_objectives: string[];
    risk_factors: string[];
    opportunities: string[];
  };
  batna_analysis: {
    strength: string;
    implications: string[];
    fallback_plan: string;
  };
  strategy_details: {
    opening_position: string;
    concession_strategy: string;
    deal_breakers: string[];
    success_metrics: string[];
  };
  confidential_notes: string[];
}

interface PositionEditorProps {
  parties: Party[];
  issues: Issue[];
  preferences: Record<string, Record<string, any>>;
}

export function PositionEditor({ parties, issues, preferences }: PositionEditorProps) {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Record<string, Position>>>({});
  const [privatePositions, setPrivatePositions] = useState<Record<string, Record<string, PrivatePosition>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  // Auto-select first party and issue if available
  useEffect(() => {
    if (parties.length > 0 && !selectedParty) {
      setSelectedParty(parties[0].id);
    }
    if (issues.length > 0 && !selectedIssue) {
      setSelectedIssue(issues[0].id);
    }
  }, [parties, issues, selectedParty, selectedIssue]);

  const generatePosition = async (partyId: string, issueId: string, positionType: 'public' | 'private') => {
    if (!partyId || !issueId) return;

    setIsGenerating(true);
    try {
      const party = parties.find(p => p.id === partyId);
      const issue = issues.find(i => i.id === issueId);
      const preference = preferences[partyId]?.[issueId];

      if (!party || !issue || !preference) {
        throw new Error('Missing party, issue, or preference data');
      }

      // TODO: Call position drafter API
      const response = await fetch('/api/positions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party,
          issue,
          preference,
          positionType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate position');
      }

      const result = await response.json();

      if (positionType === 'public') {
        setPositions(prev => ({
          ...prev,
          [partyId]: { ...prev[partyId], [issueId]: result.position }
        }));
      } else {
        setPrivatePositions(prev => ({
          ...prev,
          [partyId]: { ...prev[partyId], [issueId]: result.position }
        }));
      }
    } catch (error) {
      console.error('Error generating position:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentPosition = () => {
    if (!selectedParty || !selectedIssue) return null;
    
    if (showPrivate) {
      return privatePositions[selectedParty]?.[selectedIssue];
    } else {
      return positions[selectedParty]?.[selectedIssue];
    }
  };

  const hasPosition = (partyId: string, issueId: string, isPrivate: boolean = false) => {
    if (isPrivate) {
      return !!privatePositions[partyId]?.[issueId];
    } else {
      return !!positions[partyId]?.[issueId];
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Position Editor</h1>
              <p className="text-muted-foreground">
                Generate and edit party positions with historical context
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivate(!showPrivate)}
              >
                {showPrivate ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPrivate ? 'Hide' : 'Show'} Private
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedParty && selectedIssue) {
                    generatePosition(selectedParty, selectedIssue, showPrivate ? 'private' : 'public');
                  }
                }}
                disabled={isGenerating || !selectedParty || !selectedIssue}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>
        </div>

        {/* Party and Issue Selection */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Party</label>
              <select
                value={selectedParty || ''}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a party</option>
                {parties.map(party => (
                  <option key={party.id} value={party.id}>
                    {party.name} {party.country && `(${party.country})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Issue</label>
              <select
                value={selectedIssue || ''}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select an issue</option>
                {issues.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Position Content */}
        <div className="flex-1 overflow-hidden">
          {selectedParty && selectedIssue ? (
            <div className="h-full flex">
              {/* Position View */}
              <div className="flex-1 p-4 overflow-auto">
                <PositionView
                  position={getCurrentPosition()}
                  party={parties.find(p => p.id === selectedParty)!}
                  issue={issues.find(i => i.id === selectedIssue)!}
                  preference={preferences[selectedParty]?.[selectedIssue]}
                  isPrivate={showPrivate}
                  onGenerate={() => generatePosition(selectedParty, selectedIssue, showPrivate ? 'private' : 'public')}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Historian Context Sidebar */}
              <div className="w-80 border-l">
                <HistorianContext
                  party={parties.find(p => p.id === selectedParty)!}
                  issue={issues.find(i => i.id === selectedIssue)!}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a party and issue to view positions
            </div>
          )}
        </div>
      </div>

      {/* Position Status Sidebar */}
      <div className="w-64 border-l bg-muted/50">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Position Status</h3>
          <div className="space-y-2">
            {parties.map(party => (
              <div key={party.id} className="space-y-1">
                <div className="font-medium text-sm">{party.name}</div>
                <div className="space-y-1">
                  {issues.map(issue => (
                    <div key={issue.id} className="flex items-center justify-between text-xs">
                      <span className="truncate">{issue.title}</span>
                      <div className="flex gap-1">
                        {hasPosition(party.id, issue.id, false) && (
                          <Badge variant="default" className="text-xs">P</Badge>
                        )}
                        {hasPosition(party.id, issue.id, true) && (
                          <Badge variant="secondary" className="text-xs">Pr</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
