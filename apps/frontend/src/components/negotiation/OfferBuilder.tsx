'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Send, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  RefreshCw,
  Save
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

interface Preference {
  weight: number;
  reservation_value: number;
  target_value: number;
  current_value: number;
}

interface OfferBuilderProps {
  party: Party;
  issues: Issue[];
  preferences: Record<string, Preference>;
  roundNumber: number;
  onOfferSubmit: (offer: any) => void;
  isSubmitting?: boolean;
}

export function OfferBuilder({ 
  party, 
  issues, 
  preferences, 
  roundNumber, 
  onOfferSubmit, 
  isSubmitting = false 
}: OfferBuilderProps) {
  const [offers, setOffers] = useState<Record<string, any>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [strategy, setStrategy] = useState<'aggressive' | 'moderate' | 'conservative'>('moderate');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Initialize offers with current values
    const initialOffers: Record<string, any> = {};
    issues.forEach(issue => {
      const preference = preferences[issue.id];
      if (preference) {
        initialOffers[issue.id] = {
          proposed_value: preference.current_value,
          confidence: 0.7,
          rationale: ''
        };
      }
    });
    setOffers(initialOffers);
  }, [issues, preferences]);

  useEffect(() => {
    // Validate offers
    const valid = issues.every(issue => {
      const offer = offers[issue.id];
      const preference = preferences[issue.id];
      if (!offer || !preference) return false;
      
      const value = offer.proposed_value;
      return value >= preference.reservation_value && value <= preference.target_value;
    });
    setIsValid(valid);
  }, [offers, issues, preferences]);

  const updateOffer = (issueId: string, field: string, value: any) => {
    setOffers(prev => ({
      ...prev,
      [issueId]: {
        ...prev[issueId],
        [field]: value
      }
    }));
  };

  const updateComment = (issueId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [issueId]: comment
    }));
  };

  const getStrategyRecommendation = (issue: Issue, preference: Preference) => {
    const weight = preference.weight;
    const currentValue = preference.current_value;
    const targetValue = preference.target_value;
    const reservationValue = preference.reservation_value;
    
    if (strategy === 'aggressive') {
      if (weight > 0.7) {
        return targetValue * 0.95;
      } else {
        return targetValue * 0.85;
      }
    } else if (strategy === 'conservative') {
      if (weight > 0.7) {
        return currentValue;
      } else {
        return currentValue * 0.9;
      }
    } else { // moderate
      if (weight > 0.7) {
        return targetValue * 0.9;
      } else {
        return targetValue * 0.8;
      }
    }
  };

  const applyStrategy = () => {
    const newOffers = { ...offers };
    issues.forEach(issue => {
      const preference = preferences[issue.id];
      if (preference) {
        const recommendedValue = getStrategyRecommendation(issue, preference);
        newOffers[issue.id] = {
          ...newOffers[issue.id],
          proposed_value: recommendedValue
        };
      }
    });
    setOffers(newOffers);
  };

  const handleSubmit = () => {
    const offerData = {
      party_id: party.id,
      round_number: roundNumber,
      strategy: strategy,
      offers: Object.entries(offers).map(([issueId, offer]) => ({
        issue_id: issueId,
        proposed_value: offer.proposed_value,
        confidence: offer.confidence,
        rationale: offer.rationale || comments[issueId] || ''
      })),
      timestamp: new Date().toISOString()
    };
    
    onOfferSubmit(offerData);
  };

  const getValueColor = (issue: Issue, value: number) => {
    const preference = preferences[issue.id];
    if (!preference) return 'text-gray-600';
    
    const range = preference.target_value - preference.reservation_value;
    const position = (value - preference.reservation_value) / range;
    
    if (position > 0.8) return 'text-green-600';
    if (position > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Offer Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Round {roundNumber}</Badge>
            <Badge variant="outline">{party.name}</Badge>
          </div>
        </div>
        
        {/* Strategy Selection */}
        <div className="flex items-center gap-4 mt-4">
          <Label className="text-sm font-medium">Strategy:</Label>
          <div className="flex gap-2">
            {(['conservative', 'moderate', 'aggressive'] as const).map(strat => (
              <Button
                key={strat}
                size="sm"
                variant={strategy === strat ? "default" : "outline"}
                onClick={() => setStrategy(strat)}
              >
                {strat.charAt(0).toUpperCase() + strat.slice(1)}
              </Button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={applyStrategy}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Apply Strategy
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6">
          {issues.map(issue => {
            const preference = preferences[issue.id];
            const offer = offers[issue.id];
            
            if (!preference || !offer) return null;
            
            return (
              <Card key={issue.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Weight: {Math.round(preference.weight * 100)}%</Badge>
                      <Badge variant="outline">{issue.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Value Range Display */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600">Min: {preference.reservation_value}</span>
                    <span className="text-blue-600">Current: {preference.current_value}</span>
                    <span className="text-green-600">Target: {preference.target_value}</span>
                  </div>
                  
                  {/* Value Slider */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Proposed Value</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[offer.proposed_value]}
                        onValueChange={([value]) => updateOffer(issue.id, 'proposed_value', value)}
                        min={preference.reservation_value}
                        max={preference.target_value}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={offer.proposed_value}
                        onChange={(e) => updateOffer(issue.id, 'proposed_value', parseFloat(e.target.value))}
                        min={preference.reservation_value}
                        max={preference.target_value}
                        className="w-20"
                      />
                      <span className={`font-medium ${getValueColor(issue, offer.proposed_value)}`}>
                        {offer.proposed_value}
                      </span>
                    </div>
                  </div>
                  
                  {/* Confidence Slider */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Confidence Level</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[offer.confidence * 100]}
                        onValueChange={([value]) => updateOffer(issue.id, 'confidence', value / 100)}
                        min={0}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="font-medium w-12">
                        {Math.round(offer.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Rationale */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rationale</Label>
                    <Textarea
                      value={offer.rationale}
                      onChange={(e) => updateOffer(issue.id, 'rationale', e.target.value)}
                      placeholder="Explain the reasoning behind this offer..."
                      rows={2}
                    />
                  </div>
                  
                  {/* Additional Comments */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Additional Comments</Label>
                    <Textarea
                      value={comments[issue.id] || ''}
                      onChange={(e) => updateComment(issue.id, e.target.value)}
                      placeholder="Any additional comments or conditions..."
                      rows={2}
                    />
                  </div>
                  
                  {/* Validation */}
                  {offer.proposed_value < preference.reservation_value && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Value below reservation point
                    </div>
                  )}
                  
                  {offer.proposed_value > preference.target_value && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Value above target point
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
      
      {/* Submit Section */}
      <div className="p-4 border-t bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <span className="text-sm">
              {isValid ? 'All offers are valid' : 'Some offers need adjustment'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting}
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Offers'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
