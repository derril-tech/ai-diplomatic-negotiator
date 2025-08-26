'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PackageEditorProps {
  pkg: any;
  onSubmit: (pkg: any) => void;
}

export function PackageEditor({ pkg, onSubmit }: PackageEditorProps) {
  const [notes, setNotes] = useState<string>('');
  const [title, setTitle] = useState<string>(pkg?.title || 'Final Package');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Package Editor</CardTitle>
          <Badge variant="outline">Draft</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Summary</Label>
          <div className="text-sm bg-muted/50 p-3 rounded">
            <div><span className="font-medium">Parties:</span> {pkg?.summary?.parties?.join(', ')}</div>
            <div><span className="font-medium">Issues:</span> {pkg?.summary?.issues?.join(', ')}</div>
            <div><span className="font-medium">Basis:</span> {pkg?.summary?.recommendation_basis}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Offers</Label>
          <div className="space-y-2">
            {(pkg?.selected_offers || []).map((o: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded">
                <div className="text-sm">
                  <div className="font-medium">Issue: {o.issue_id}</div>
                  <div>Proposed: {o.proposed_value}</div>
                </div>
                <Badge variant="outline">Confidence {Math.round((o.confidence || 0) * 100)}%</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Mediator Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add mediator rationale, caveats, and implementation notes..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Risk Notes</Label>
          <div className="space-y-2">
            {(pkg?.risk_notes || []).map((r: any, idx: number) => (
              <div key={idx} className="text-sm p-2 rounded bg-amber-50 border border-amber-200">
                <span className="font-medium">Issue:</span> {r.issue_id} — {r.note} ({Math.round((r.expected_impact||0)*100)}%)
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSubmit({ ...pkg, title, notes })}>Submit for Approval</Button>
        </div>
      </CardContent>
    </Card>
  );
}
