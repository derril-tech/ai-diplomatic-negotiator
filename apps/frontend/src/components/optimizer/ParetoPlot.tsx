'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ParetoPoint {
  values: Record<string, number>;
  party_utils: Record<string, number>;
  score: number;
}

interface ParetoPlotProps {
  frontier: ParetoPoint[];
  partyIds: string[];
  title?: string;
}

export function ParetoPlot({ frontier, partyIds, title = 'Pareto Frontier' }: ParetoPlotProps) {
  // Reduce to 2D plot by taking first two parties' utilities
  const [p1, p2] = [partyIds[0], partyIds[1]];
  const data = frontier.map(pt => ({
    x: Math.round((pt.party_utils[p1] || 0) * 100),
    y: Math.round((pt.party_utils[p2] || 0) * 100),
    z: Math.round((pt.score || 0) * 1000) / 10,
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name={p1} unit="%" domain={[0, 100]} />
              <YAxis type="number" dataKey="y" name={p2} unit="%" domain={[0, 100]} />
              <ZAxis type="number" dataKey="z" range={[50, 300]} name="score" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Frontier" data={data} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
