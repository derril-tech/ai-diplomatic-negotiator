'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  User, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface Offer {
  id: string;
  party_id: string;
  party_name: string;
  issue_id: string;
  issue_title: string;
  round_number: number;
  proposed_value: number;
  previous_value?: number;
  strategy: string;
  rationale: string;
  confidence: number;
  flexibility: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
}

interface OfferCardProps {
  offer: Offer;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  onCounter?: (offerId: string) => void;
  showActions?: boolean;
}

export function OfferCard({ 
  offer, 
  onAccept, 
  onReject, 
  onCounter, 
  showActions = true 
}: OfferCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'countered':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getValueChange = () => {
    if (!offer.previous_value) return null;
    const change = offer.proposed_value - offer.previous_value;
    const percentChange = (change / offer.previous_value) * 100;
    return { change, percentChange };
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const valueChange = getValueChange();

  return (
    <Card className={`border-2 ${
      offer.status === 'accepted' ? 'border-green-200 bg-green-50' :
      offer.status === 'rejected' ? 'border-red-200 bg-red-50' :
      offer.status === 'countered' ? 'border-yellow-200 bg-yellow-50' :
      'border-blue-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              {offer.issue_title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{offer.party_name}</span>
              <Badge variant="outline">Round {offer.round_number}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(offer.status)}>
              {getStatusIcon(offer.status)}
              {offer.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Value Display */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {offer.proposed_value}
            </div>
            <div className="text-sm text-muted-foreground">Proposed Value</div>
          </div>
          
          {valueChange && (
            <div className="text-center">
              <div className={`text-lg font-semibold flex items-center gap-1 ${
                valueChange.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {valueChange.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(valueChange.change).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {valueChange.percentChange > 0 ? '+' : ''}{valueChange.percentChange.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* Strategy and Confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Strategy</div>
            <div className="text-sm capitalize">{offer.strategy.replace('_', ' ')}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Confidence</div>
            <div className="text-sm">{Math.round(offer.confidence * 100)}%</div>
          </div>
        </div>

        {/* Flexibility */}
        <div>
          <div className="text-sm font-medium text-muted-foreground">Flexibility</div>
          <div className="text-sm capitalize">{offer.flexibility}</div>
        </div>

        {/* Rationale */}
        {offer.rationale && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Rationale</div>
            <div className="text-sm bg-muted/50 p-3 rounded-md">
              {offer.rationale}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatTimestamp(offer.timestamp)}
        </div>

        {/* Actions */}
        {showActions && offer.status === 'pending' && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCounter?.(offer.id)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Counter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject?.(offer.id)}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept?.(offer.id)}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
