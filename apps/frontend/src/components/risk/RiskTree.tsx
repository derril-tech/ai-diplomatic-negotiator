'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScenarioImpact {
  scenario: string;
  probability: number;
  impact: number; // -1..1
}

interface IssueRiskResult {
  issue_id: string;
  expected_impact: number;
  scenarios: ScenarioImpact[];
}

interface RiskTreeProps {
  results: IssueRiskResult[];
  issueTitles: Record<string, string>;
}

export function RiskTree({ results, issueTitles }: RiskTreeProps) {
  const getImpactColor = (v: number) => v >= 0 ? 'text-green-600' : 'text-red-600';
  const pct = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Risk Tree</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map(res => (
          <div key={res.issue_id} className="border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{issueTitles[res.issue_id] || res.issue_id}</div>
              <Badge variant="outline" className={getImpactColor(res.expected_impact)}>
                Expected: {pct(res.expected_impact)}
              </Badge>
            </div>
            <div className="space-y-2">
              {res.scenarios.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.scenario}</span>
                    <span className="text-muted-foreground">P={pct(s.probability)}</span>
                  </div>
                  <div className={getImpactColor(s.impact)}>
                    Impact {pct(s.impact)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
