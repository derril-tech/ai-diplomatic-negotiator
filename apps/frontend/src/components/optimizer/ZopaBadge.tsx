import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ZopaBadgeProps {
  hasZopa: boolean;
  interval?: [number, number] | null;
}

export function ZopaBadge({ hasZopa, interval }: ZopaBadgeProps) {
  if (!hasZopa) {
    return <Badge variant="destructive">No ZOPA</Badge>;
  }
  if (!interval) {
    return <Badge variant="outline">ZOPA</Badge>;
  }
  return (
    <Badge variant="secondary">ZOPA {interval[0].toFixed(1)}–{interval[1].toFixed(1)}</Badge>
  );
}
