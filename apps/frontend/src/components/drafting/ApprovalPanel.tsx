'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ApprovalItem {
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  actor?: string;
  timestamp?: string;
}

interface ApprovalPanelProps {
  approvals: ApprovalItem[];
  userRole: string;
  onDecision: (role: string, decision: 'approve' | 'reject') => void;
}

export function ApprovalPanel({ approvals, userRole, onDecision }: ApprovalPanelProps) {
  const canAct = (item: ApprovalItem) => item.role === userRole && item.status === 'pending';

  const statusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Approvals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {approvals.map((a, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 border rounded">
            <div className="text-sm">
              <div className="font-medium capitalize">{a.role}</div>
              <div className="text-xs text-muted-foreground">{a.actor || '—'} {a.timestamp ? `at ${a.timestamp}` : ''}</div>
            </div>
            <div className="flex items-center gap-2">
              {statusBadge(a.status)}
              {canAct(a) && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onDecision(a.role, 'reject')}>Reject</Button>
                  <Button size="sm" onClick={() => onDecision(a.role, 'approve')}>Approve</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
