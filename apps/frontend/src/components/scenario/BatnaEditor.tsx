'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
  reservationValue: number;
  targetValue: number;
  batna: string;
}

interface BatnaEditorProps {
  parties: Party[];
  issues: Issue[];
  preferences: Record<string, Record<string, Preference>>;
  onPreferencesChange: (preferences: Record<string, Record<string, Preference>>) => void;
}

export function BatnaEditor({ parties, issues, preferences, onPreferencesChange }: BatnaEditorProps) {
  const updateBatna = (partyId: string, issueId: string, batna: string) => {
    const currentPreferences = preferences[partyId] || {};
    const currentPreference = currentPreferences[issueId] || {
      weight: 0,
      reservationValue: 0,
      targetValue: 100,
      batna: ''
    };

    const updatedPreference = { ...currentPreference, batna };
    const updatedPartyPreferences = { ...currentPreferences, [issueId]: updatedPreference };
    const updatedPreferences = { ...preferences, [partyId]: updatedPartyPreferences };

    onPreferencesChange(updatedPreferences);
  };

  const getPreference = (partyId: string, issueId: string): Preference => {
    return preferences[partyId]?.[issueId] || {
      weight: 0,
      reservationValue: 0,
      targetValue: 100,
      batna: ''
    };
  };

  const getBatnaStrength = (batna: string): 'weak' | 'moderate' | 'strong' => {
    if (!batna.trim()) return 'weak';
    if (batna.length < 50) return 'moderate';
    return 'strong';
  };

  if (parties.length === 0 || issues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please add parties and issues first to configure BATNA.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">BATNA Configuration</h3>
        <p className="text-muted-foreground">
          Define each party's Best Alternative To Negotiated Agreement (BATNA) for each issue.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          BATNA represents what each party will do if no agreement is reached. A strong BATNA gives a party more leverage in negotiations.
        </AlertDescription>
      </Alert>

      {parties.map((party) => (
        <Card key={party.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              {party.name}
              {party.country && (
                <span className="text-sm text-muted-foreground">({party.country})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {issues.map((issue) => {
                const preference = getPreference(party.id, issue.id);
                const batnaStrength = getBatnaStrength(preference.batna);
                
                return (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge variant={
                          batnaStrength === 'strong' ? 'default' :
                          batnaStrength === 'moderate' ? 'secondary' : 'outline'
                        }>
                          {batnaStrength} BATNA
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`batna-${party.id}-${issue.id}`}>
                          BATNA Description
                        </Label>
                        <Textarea
                          id={`batna-${party.id}-${issue.id}`}
                          value={preference.batna}
                          onChange={(e) => updateBatna(party.id, issue.id, e.target.value)}
                          placeholder={`Describe ${party.name}'s best alternative if no agreement is reached on ${issue.title.toLowerCase()}...`}
                          rows={3}
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-muted rounded">
                          <div className="font-medium">Reservation Value</div>
                          <div className="text-muted-foreground">
                            {preference.reservationValue} {issue.unit}
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded">
                          <div className="font-medium">Target Value</div>
                          <div className="text-muted-foreground">
                            {preference.targetValue} {issue.unit}
                          </div>
                        </div>
                      </div>

                      {preference.batna && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="text-sm font-medium text-blue-900 mb-1">BATNA Analysis</div>
                          <div className="text-sm text-blue-700">
                            {batnaStrength === 'strong' && (
                              "This BATNA provides strong leverage. The party has a credible alternative that's better than most potential agreements."
                            )}
                            {batnaStrength === 'moderate' && (
                              "This BATNA provides moderate leverage. The party has some alternatives but may still prefer a negotiated agreement."
                            )}
                            {batnaStrength === 'weak' && (
                              "This BATNA provides weak leverage. The party has limited alternatives and may be more willing to compromise."
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* BATNA Summary */}
      <Card>
        <CardHeader>
          <CardTitle>BATNA Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parties.map((party) => {
              const partyBatnas = issues.map(issue => {
                const preference = getPreference(party.id, issue.id);
                return {
                  issue: issue.title,
                  strength: getBatnaStrength(preference.batna),
                  hasBatna: !!preference.batna.trim()
                };
              });

              const strongCount = partyBatnas.filter(b => b.strength === 'strong').length;
              const moderateCount = partyBatnas.filter(b => b.strength === 'moderate').length;
              const weakCount = partyBatnas.filter(b => b.strength === 'weak').length;

              return (
                <div key={party.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{party.name}</h4>
                    <div className="flex gap-2">
                      <Badge variant="default">{strongCount} Strong</Badge>
                      <Badge variant="secondary">{moderateCount} Moderate</Badge>
                      <Badge variant="outline">{weakCount} Weak</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {partyBatnas.map((batna, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{batna.issue}</span>
                        <Badge variant={
                          batna.strength === 'strong' ? 'default' :
                          batna.strength === 'moderate' ? 'secondary' : 'outline'
                        } size="sm">
                          {batna.strength}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
