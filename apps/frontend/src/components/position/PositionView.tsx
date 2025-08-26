'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Target, 
  Shield, 
  TrendingUp,
  FileText,
  Lightbulb,
  Zap
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

interface Position {
  stance: string;
  interests: {
    primary: string;
    secondary: string;
    constraints: string;
  };
  arguments: string[];
  evidence: string[];
  negotiation_approach: string;
  flexibility_level: string;
}

interface PrivatePosition {
  priority_level: string;
  flexibility: string;
  strategy: string;
  internal_interests: {
    core_objectives: string[];
    risk_factors: string[];
    opportunities: string[];
  };
  batna_analysis: {
    strength: string;
    implications: string[];
    fallback_plan: string;
  };
  strategy_details: {
    opening_position: string;
    concession_strategy: string;
    deal_breakers: string[];
    success_metrics: string[];
  };
  confidential_notes: string[];
}

interface PositionViewProps {
  position: Position | PrivatePosition | null;
  party: Party;
  issue: Issue;
  preference: any;
  isPrivate: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PositionView({ 
  position, 
  party, 
  issue, 
  preference, 
  isPrivate, 
  onGenerate, 
  isGenerating 
}: PositionViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPosition, setEditedPosition] = useState<Position | PrivatePosition | null>(null);

  const handleEdit = () => {
    setEditedPosition(position ? JSON.parse(JSON.stringify(position)) : null);
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Save edited position
    setIsEditing(false);
    setEditedPosition(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPosition(null);
  };

  const addListItem = (field: string, value: string) => {
    if (!editedPosition) return;
    
    if (isPrivate) {
      const privatePos = editedPosition as PrivatePosition;
      if (field === 'core_objectives') {
        privatePos.internal_interests.core_objectives.push(value);
      } else if (field === 'risk_factors') {
        privatePos.internal_interests.risk_factors.push(value);
      } else if (field === 'opportunities') {
        privatePos.internal_interests.opportunities.push(value);
      } else if (field === 'implications') {
        privatePos.batna_analysis.implications.push(value);
      } else if (field === 'deal_breakers') {
        privatePos.strategy_details.deal_breakers.push(value);
      } else if (field === 'success_metrics') {
        privatePos.strategy_details.success_metrics.push(value);
      } else if (field === 'confidential_notes') {
        privatePos.confidential_notes.push(value);
      }
    } else {
      const publicPos = editedPosition as Position;
      if (field === 'arguments') {
        publicPos.arguments.push(value);
      } else if (field === 'evidence') {
        publicPos.evidence.push(value);
      }
    }
    setEditedPosition({ ...editedPosition });
  };

  const removeListItem = (field: string, index: number) => {
    if (!editedPosition) return;
    
    if (isPrivate) {
      const privatePos = editedPosition as PrivatePosition;
      if (field === 'core_objectives') {
        privatePos.internal_interests.core_objectives.splice(index, 1);
      } else if (field === 'risk_factors') {
        privatePos.internal_interests.risk_factors.splice(index, 1);
      } else if (field === 'opportunities') {
        privatePos.internal_interests.opportunities.splice(index, 1);
      } else if (field === 'implications') {
        privatePos.batna_analysis.implications.splice(index, 1);
      } else if (field === 'deal_breakers') {
        privatePos.strategy_details.deal_breakers.splice(index, 1);
      } else if (field === 'success_metrics') {
        privatePos.strategy_details.success_metrics.splice(index, 1);
      } else if (field === 'confidential_notes') {
        privatePos.confidential_notes.splice(index, 1);
      }
    } else {
      const publicPos = editedPosition as Position;
      if (field === 'arguments') {
        publicPos.arguments.splice(index, 1);
      } else if (field === 'evidence') {
        publicPos.evidence.splice(index, 1);
      }
    }
    setEditedPosition({ ...editedPosition });
  };

  const currentPosition = isEditing ? editedPosition : position;

  if (!currentPosition) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Position Generated</h3>
          <p className="text-muted-foreground mb-4">
            Generate a {isPrivate ? 'private' : 'public'} position for {party.name} on {issue.title}
          </p>
          <Button onClick={onGenerate} disabled={isGenerating}>
            <Zap className="w-4 h-4 mr-2" />
            Generate Position
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {party.name} - {issue.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isPrivate ? "secondary" : "default"}>
              {isPrivate ? "Private" : "Public"} Position
            </Badge>
            <Badge variant="outline">
              Weight: {preference?.weight || 0}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {isPrivate ? (
          <PrivatePositionContent 
            position={currentPosition as PrivatePosition}
            isEditing={isEditing}
            onAddItem={addListItem}
            onRemoveItem={removeListItem}
          />
        ) : (
          <PublicPositionContent 
            position={currentPosition as Position}
            isEditing={isEditing}
            onAddItem={addListItem}
            onRemoveItem={removeListItem}
          />
        )}
      </ScrollArea>
    </div>
  );
}

function PublicPositionContent({ 
  position, 
  isEditing, 
  onAddItem, 
  onRemoveItem 
}: { 
  position: Position; 
  isEditing: boolean; 
  onAddItem: (field: string, value: string) => void;
  onRemoveItem: (field: string, index: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={position.stance}
              onChange={(e) => position.stance = e.target.value}
              placeholder="Enter the party's stance on this issue..."
              rows={3}
            />
          ) : (
            <p className="text-sm">{position.stance}</p>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Interests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Primary Interest</Label>
            {isEditing ? (
              <Textarea
                value={position.interests.primary}
                onChange={(e) => position.interests.primary = e.target.value}
                placeholder="Primary interest..."
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{position.interests.primary}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Secondary Interest</Label>
            {isEditing ? (
              <Textarea
                value={position.interests.secondary}
                onChange={(e) => position.interests.secondary = e.target.value}
                placeholder="Secondary interest..."
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{position.interests.secondary}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Constraints</Label>
            {isEditing ? (
              <Textarea
                value={position.interests.constraints}
                onChange={(e) => position.interests.constraints = e.target.value}
                placeholder="Constraints..."
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{position.interests.constraints}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Arguments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Arguments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {position.arguments.map((arg, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1 text-sm">{arg}</div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveItem('arguments', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add new argument..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      onAddItem('arguments', e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add new argument..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      onAddItem('arguments', input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Evidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {position.evidence.map((ev, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1 text-sm">{ev}</div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveItem('evidence', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add new evidence..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      onAddItem('evidence', e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add new evidence..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      onAddItem('evidence', input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Negotiation Approach</Label>
            {isEditing ? (
              <Textarea
                value={position.negotiation_approach}
                onChange={(e) => position.negotiation_approach = e.target.value}
                placeholder="Negotiation approach..."
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{position.negotiation_approach}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Flexibility Level</Label>
            {isEditing ? (
              <Textarea
                value={position.flexibility_level}
                onChange={(e) => position.flexibility_level = e.target.value}
                placeholder="Flexibility level..."
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{position.flexibility_level}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrivatePositionContent({ 
  position, 
  isEditing, 
  onAddItem, 
  onRemoveItem 
}: { 
  position: PrivatePosition; 
  isEditing: boolean; 
  onAddItem: (field: string, value: string) => void;
  onRemoveItem: (field: string, index: number) => void;
}) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="interests">Internal Interests</TabsTrigger>
        <TabsTrigger value="batna">BATNA Analysis</TabsTrigger>
        <TabsTrigger value="strategy">Strategy Details</TabsTrigger>
        <TabsTrigger value="notes">Confidential Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Priority & Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Priority Level</Label>
              {isEditing ? (
                <Input
                  value={position.priority_level}
                  onChange={(e) => position.priority_level = e.target.value}
                  placeholder="Priority level..."
                />
              ) : (
                <p className="text-sm mt-1">{position.priority_level}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Flexibility</Label>
              {isEditing ? (
                <Input
                  value={position.flexibility}
                  onChange={(e) => position.flexibility = e.target.value}
                  placeholder="Flexibility..."
                />
              ) : (
                <p className="text-sm mt-1">{position.flexibility}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Strategy</Label>
              {isEditing ? (
                <Textarea
                  value={position.strategy}
                  onChange={(e) => position.strategy = e.target.value}
                  placeholder="Strategy..."
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">{position.strategy}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interests" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Core Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {position.internal_interests.core_objectives.map((obj, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 text-sm">{obj}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem('core_objectives', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add core objective..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onAddItem('core_objectives', e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {position.internal_interests.risk_factors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 text-sm">{risk}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem('risk_factors', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add risk factor..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onAddItem('risk_factors', e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {position.internal_interests.opportunities.map((opp, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 text-sm">{opp}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem('opportunities', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add opportunity..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onAddItem('opportunities', e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="batna" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>BATNA Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">BATNA Strength</Label>
              {isEditing ? (
                <Input
                  value={position.batna_analysis.strength}
                  onChange={(e) => position.batna_analysis.strength = e.target.value}
                  placeholder="BATNA strength..."
                />
              ) : (
                <p className="text-sm mt-1">{position.batna_analysis.strength}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Implications</Label>
              <div className="space-y-2 mt-1">
                {position.batna_analysis.implications.map((imp, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 text-sm">{imp}</div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem('implications', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add implication..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          onAddItem('implications', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Fallback Plan</Label>
              {isEditing ? (
                <Textarea
                  value={position.batna_analysis.fallback_plan}
                  onChange={(e) => position.batna_analysis.fallback_plan = e.target.value}
                  placeholder="Fallback plan..."
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">{position.batna_analysis.fallback_plan}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="strategy" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Opening Position</Label>
              {isEditing ? (
                <Textarea
                  value={position.strategy_details.opening_position}
                  onChange={(e) => position.strategy_details.opening_position = e.target.value}
                  placeholder="Opening position..."
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">{position.strategy_details.opening_position}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Concession Strategy</Label>
              {isEditing ? (
                <Textarea
                  value={position.strategy_details.concession_strategy}
                  onChange={(e) => position.strategy_details.concession_strategy = e.target.value}
                  placeholder="Concession strategy..."
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">{position.strategy_details.concession_strategy}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Deal Breakers</Label>
              <div className="space-y-2 mt-1">
                {position.strategy_details.deal_breakers.map((breaker, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 text-sm">{breaker}</div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem('deal_breakers', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add deal breaker..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          onAddItem('deal_breakers', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Success Metrics</Label>
              <div className="space-y-2 mt-1">
                {position.strategy_details.success_metrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 text-sm">{metric}</div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem('success_metrics', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add success metric..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          onAddItem('success_metrics', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Confidential Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {position.confidential_notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 text-sm">{note}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem('confidential_notes', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add confidential note..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onAddItem('confidential_notes', e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
