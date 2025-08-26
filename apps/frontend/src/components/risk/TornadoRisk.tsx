'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SensitivityItem {
  factor: string;
  low: number;  // outcome at low bound
  high: number; // outcome at high bound
}

interface TornadoRiskProps {
  data: SensitivityItem[];
  title?: string;
}

export function TornadoRisk({ data, title = 'Tornado Risk' }: TornadoRiskProps) {
  const chartData = data.map(d => ({
    factor: d.factor,
    range: Math.abs(d.high - d.low),
    low: d.low,
    high: d.high
  })).sort((a, b) => b.range - a.range);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="factor" width={100} />
            <Tooltip />
            <Bar dataKey="range" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
