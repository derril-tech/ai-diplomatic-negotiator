'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  MessageSquare,
  Zap
} from 'lucide-react';

interface MediatorAction {
  id: string;
  type: 'pause' | 'resume' | 'intervene' | 'suggest' | 'timeout' | 'deadline';
  description: string;
  timestamp: string;
  status: 'pending' | 'executed' | 'cancelled';
  target_parties?: string[];
  message?: string;
}

interface NegotiationStatus {
  current_round: number;
  total_rounds: number;
  status: 'active' | 'paused' | 'completed' | 'deadlocked';
  time_elapsed: string;
  time_remaining?: string;
  parties_engaged: number;
  total_parties: number;
  offers_pending: number;
  last_activity: string;
}

interface MediatorConsoleProps {
  negotiationId: string;
  status: NegotiationStatus;
  onAction: (action: MediatorAction) => void;
  isMediator?: boolean;
}

export function MediatorConsole({ 
  negotiationId, 
  status, 
  onAction, 
  isMediator = true 
}: MediatorConsoleProps) {
  const [isPaused, setIsPaused] = useState(status.status === 'paused');
  const [interventionMessage, setInterventionMessage] = useState('');
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [recentActions, setRecentActions] = useState<MediatorAction[]>([]);

  const mockParties = ['United States', 'European Union', 'China'];

  const handlePauseResume = () => {
    const action: MediatorAction = {
      id: Date.now().toString(),
      type: isPaused ? 'resume' : 'pause',
      description: isPaused ? 'Resume negotiation' : 'Pause negotiation',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    setIsPaused(!isPaused);
    onAction(action);
    setRecentActions(prev => [action, ...prev.slice(0, 4)]);
  };

  const handleIntervention = () => {
    if (!interventionMessage.trim()) return;
    
    const action: MediatorAction = {
      id: Date.now().toString(),
      type: 'intervene',
      description: 'Mediator intervention',
      timestamp: new Date().toISOString(),
      status: 'pending',
      target_parties: selectedParties,
      message: interventionMessage
    };
    
    onAction(action);
    setRecentActions(prev => [action, ...prev.slice(0, 4)]);
    setInterventionMessage('');
    setSelectedParties([]);
  };

  const handleSuggestion = () => {
    const action: MediatorAction = {
      id: Date.now().toString(),
      type: 'suggest',
      description: 'Mediator suggestion for compromise',
      timestamp: new Date().toISOString(),
      status: 'pending',
      target_parties: selectedParties
    };
    
    onAction(action);
    setRecentActions(prev => [action, ...prev.slice(0, 4)]);
  };

  const handleTimeout = () => {
    const action: MediatorAction = {
      id: Date.now().toString(),
      type: 'timeout',
      description: 'Call for timeout',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    onAction(action);
    setRecentActions(prev => [action, ...prev.slice(0, 4)]);
  };

  const handleDeadline = () => {
    const action: MediatorAction = {
      id: Date.now().toString(),
      type: 'deadline',
      description: 'Set negotiation deadline',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    onAction(action);
    setRecentActions(prev => [action, ...prev.slice(0, 4)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'deadlocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'deadlocked':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!isMediator) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Mediator Console
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Mediator access required</p>
            <p className="text-sm">Only mediators can access this console</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Mediator Console
          </CardTitle>
          <Badge className={getStatusColor(status.status)}>
            {getStatusIcon(status.status)}
            {status.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="text-lg font-bold">{status.current_round}/{status.total_rounds}</div>
            <div className="text-xs text-muted-foreground">Rounds</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <div className="text-lg font-bold">{status.parties_engaged}/{status.total_parties}</div>
            <div className="text-xs text-muted-foreground">Parties Active</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-lg font-bold">{status.offers_pending}</div>
            <div className="text-xs text-muted-foreground">Offers</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="text-lg font-bold">{status.time_elapsed}</div>
            <div className="text-xs text-muted-foreground">Elapsed</div>
          </div>
        </div>

        {/* Control Actions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Control Actions</h3>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isPaused ? "default" : "outline"}
              onClick={handlePauseResume}
              className="flex-1"
            >
              {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleTimeout}
            >
              <Clock className="w-4 h-4 mr-2" />
              Timeout
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeadline}
            >
              <Zap className="w-4 h-4 mr-2" />
              Deadline
            </Button>
          </div>
        </div>

        {/* Intervention */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Intervention</h3>
          
          <div className="space-y-2">
            <Label className="text-sm">Target Parties</Label>
            <div className="flex flex-wrap gap-2">
              {mockParties.map(party => (
                <Button
                  key={party}
                  size="sm"
                  variant={selectedParties.includes(party) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedParties(prev => 
                      prev.includes(party) 
                        ? prev.filter(p => p !== party)
                        : [...prev, party]
                    );
                  }}
                >
                  {party}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Message</Label>
            <Textarea
              value={interventionMessage}
              onChange={(e) => setInterventionMessage(e.target.value)}
              placeholder="Enter intervention message..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleIntervention}
              disabled={!interventionMessage.trim()}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Intervention
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSuggestion}
              disabled={selectedParties.length === 0}
            >
              <Target className="w-4 h-4 mr-2" />
              Suggest Compromise
            </Button>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Recent Actions</h3>
          <div className="space-y-2">
            {recentActions.map(action => (
              <div key={action.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{action.type}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {action.status}
                </Badge>
              </div>
            ))}
            {recentActions.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">No recent actions</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
