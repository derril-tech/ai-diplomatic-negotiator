'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Download, FileText, FileSpreadsheet, FileJson, FileType2 } from 'lucide-react';

interface ExportHubProps {
  packageData: any;
  onRequest: (format: 'md' | 'pdf' | 'csv' | 'json') => Promise<{ url: string } | null>;
}

export function ExportHub({ packageData, onRequest }: ExportHubProps) {
  const [busy, setBusy] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const doExport = async (format: 'md' | 'pdf' | 'csv' | 'json') => {
    setBusy(format);
    try {
      const res = await onRequest(format);
      if (res?.url) setLastUrl(res.url);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Export Hub</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Package</Label>
          <div className="text-sm bg-muted/50 p-3 rounded">
            <div className="font-medium">{packageData?.title || 'Final Package'}</div>
            <div className="text-muted-foreground">Parties: {(packageData?.summary?.parties || []).join(', ')}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => doExport('md')} disabled={busy !== null} variant="outline">
            <FileText className="w-4 h-4 mr-2" /> Markdown
          </Button>
          <Button onClick={() => doExport('pdf')} disabled={busy !== null} variant="outline">
            <FileType2 className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button onClick={() => doExport('csv')} disabled={busy !== null} variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={() => doExport('json')} disabled={busy !== null} variant="outline">
            <FileJson className="w-4 h-4 mr-2" /> JSON
          </Button>
        </div>

        {lastUrl && (
          <div className="p-3 border rounded flex items-center justify-between">
            <div className="text-sm truncate">{lastUrl}</div>
            <a href={lastUrl} target="_blank" rel="noreferrer">
              <Button size="sm"><Download className="w-4 h-4 mr-2" /> Download</Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
