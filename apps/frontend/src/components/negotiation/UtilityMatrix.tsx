'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Grid3X3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Settings,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

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

interface UtilityScore {
  party_id: string;
  issue_id: string;
  value: number;
  utility: number;
  weight: number;
}

interface UtilityMatrixProps {
  parties: Party[];
  issues: Issue[];
  utilityScores: UtilityScore[];
  onValueChange?: (partyId: string, issueId: string, value: number) => void;
  showWeights?: boolean;
}

export function UtilityMatrix({ 
  parties, 
  issues, 
  utilityScores, 
  onValueChange,
  showWeights = true 
}: UtilityMatrixProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'party' | 'issue' | 'utility'>('party');
  const [filterParty, setFilterParty] = useState<string>('all');
  const [filterIssue, setFilterIssue] = useState<string>('all');

  const getUtilityScore = (partyId: string, issueId: string) => {
    return utilityScores.find(score => 
      score.party_id === partyId && score.issue_id === issueId
    );
  };

  const getTotalUtility = (partyId: string) => {
    const partyScores = utilityScores.filter(score => score.party_id === partyId);
    return partyScores.reduce((total, score) => total + (score.utility * score.weight), 0);
  };

  const getAverageUtility = () => {
    const total = utilityScores.reduce((sum, score) => sum + score.utility, 0);
    return total / utilityScores.length;
  };

  const getUtilityColor = (utility: number) => {
    if (utility >= 0.8) return 'bg-green-100 text-green-800';
    if (utility >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (utility >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getUtilityIcon = (utility: number) => {
    if (utility >= 0.8) return <TrendingUp className="w-4 h-4" />;
    if (utility >= 0.6) return <Target className="w-4 h-4" />;
    if (utility >= 0.4) return <TrendingDown className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const filteredParties = parties.filter(party => 
    filterParty === 'all' || party.id === filterParty
  );

  const filteredIssues = issues.filter(issue => 
    filterIssue === 'all' || issue.id === filterIssue
  );

  const exportMatrix = () => {
    const data = {
      parties: parties.map(party => ({
        id: party.id,
        name: party.name,
        total_utility: getTotalUtility(party.id)
      })),
      issues: issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        type: issue.type
      })),
      utility_scores: utilityScores,
      average_utility: getAverageUtility(),
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'utility-matrix.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Utility Matrix
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button size="sm" variant="outline" onClick={exportMatrix}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Party:</Label>
            <select
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="all">All Parties</option>
              {parties.map(party => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Issue:</Label>
            <select
              value={filterIssue}
              onChange={(e) => setFilterIssue(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="all">All Issues</option>
              {issues.map(issue => (
                <option key={issue.id} value={issue.id}>{issue.title}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Sort by:</Label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="party">Party</option>
              <option value="issue">Issue</option>
              <option value="utility">Utility</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(getAverageUtility() * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Utility</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {utilityScores.filter(score => score.utility >= 0.8).length}
              </div>
              <div className="text-sm text-muted-foreground">High Utility Scores</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {utilityScores.filter(score => score.utility < 0.4).length}
              </div>
              <div className="text-sm text-muted-foreground">Low Utility Scores</div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Party / Issue</th>
                  {filteredIssues.map(issue => (
                    <th key={issue.id} className="text-center p-2 font-medium">
                      <div className="text-sm">{issue.title}</div>
                      {showWeights && (
                        <div className="text-xs text-muted-foreground">
                          Weight: {Math.round(issue.weight * 100)}%
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="text-center p-2 font-medium">Total Utility</th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.map(party => (
                  <tr key={party.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">
                      <div>{party.name}</div>
                      {party.country && (
                        <div className="text-xs text-muted-foreground">{party.country}</div>
                      )}
                    </td>
                    {filteredIssues.map(issue => {
                      const score = getUtilityScore(party.id, issue.id);
                      return (
                        <td key={issue.id} className="text-center p-2">
                          {score ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-1">
                                {getUtilityIcon(score.utility)}
                                <Badge className={getUtilityColor(score.utility)}>
                                  {Math.round(score.utility * 100)}%
                                </Badge>
                              </div>
                              {showDetails && (
                                <div className="text-xs text-muted-foreground">
                                  <div>Value: {score.value}</div>
                                  {showWeights && <div>Weight: {Math.round(score.weight * 100)}%</div>}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center p-2 font-medium">
                      <div className="text-lg">
                        {Math.round(getTotalUtility(party.id) * 100)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Utility Distribution */}
          {showDetails && (
            <div className="space-y-4">
              <h3 className="font-semibold">Utility Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">By Party</h4>
                  <div className="space-y-2">
                    {filteredParties.map(party => {
                      const total = getTotalUtility(party.id);
                      return (
                        <div key={party.id} className="flex items-center justify-between">
                          <span className="text-sm">{party.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${total * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round(total * 100)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">By Issue</h4>
                  <div className="space-y-2">
                    {filteredIssues.map(issue => {
                      const issueScores = utilityScores.filter(score => score.issue_id === issue.id);
                      const average = issueScores.reduce((sum, score) => sum + score.utility, 0) / issueScores.length;
                      return (
                        <div key={issue.id} className="flex items-center justify-between">
                          <span className="text-sm">{issue.title}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${average * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round(average * 100)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
