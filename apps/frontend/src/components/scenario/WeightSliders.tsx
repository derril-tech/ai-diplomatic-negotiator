'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

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

interface WeightSlidersProps {
  parties: Party[];
  issues: Issue[];
  preferences: Record<string, Record<string, Preference>>;
  onPreferencesChange: (preferences: Record<string, Record<string, Preference>>) => void;
}

export function WeightSliders({ parties, issues, preferences, onPreferencesChange }: WeightSlidersProps) {
  const updatePreference = (partyId: string, issueId: string, field: keyof Preference, value: number | string) => {
    const currentPreferences = preferences[partyId] || {};
    const currentPreference = currentPreferences[issueId] || {
      weight: 0,
      reservationValue: 0,
      targetValue: 100,
      batna: ''
    };

    const updatedPreference = { ...currentPreference, [field]: value };
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

  if (parties.length === 0 || issues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please add parties and issues first to configure weights and preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Party Issue Weights & Preferences</h3>
        <p className="text-muted-foreground">
          Set the importance (weight) each party assigns to each issue, along with their reservation values and targets.
        </p>
      </div>

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
                
                return (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Weight Slider */}
                      <div>
                        <Label htmlFor={`weight-${party.id}-${issue.id}`}>
                          Weight: {preference.weight}%
                        </Label>
                        <Slider
                          id={`weight-${party.id}-${issue.id}`}
                          value={[preference.weight]}
                          onValueChange={([value]) => updatePreference(party.id, issue.id, 'weight', value)}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      {/* Reservation Value */}
                      <div>
                        <Label htmlFor={`reservation-${party.id}-${issue.id}`}>
                          Reservation Value
                        </Label>
                        <Input
                          id={`reservation-${party.id}-${issue.id}`}
                          type="number"
                          value={preference.reservationValue}
                          onChange={(e) => updatePreference(party.id, issue.id, 'reservationValue', Number(e.target.value))}
                          min={issue.minValue}
                          max={issue.maxValue}
                          className="mt-2"
                        />
                        {issue.unit && (
                          <span className="text-sm text-muted-foreground ml-2">{issue.unit}</span>
                        )}
                      </div>

                      {/* Target Value */}
                      <div>
                        <Label htmlFor={`target-${party.id}-${issue.id}`}>
                          Target Value
                        </Label>
                        <Input
                          id={`target-${party.id}-${issue.id}`}
                          type="number"
                          value={preference.targetValue}
                          onChange={(e) => updatePreference(party.id, issue.id, 'targetValue', Number(e.target.value))}
                          min={issue.minValue}
                          max={issue.maxValue}
                          className="mt-2"
                        />
                        {issue.unit && (
                          <span className="text-sm text-muted-foreground ml-2">{issue.unit}</span>
                        )}
                      </div>
                    </div>

                    {/* Value Range Display */}
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Range: {issue.minValue} - {issue.maxValue} {issue.unit}</span>
                        <span className="text-muted-foreground">
                          {preference.reservationValue} → {preference.targetValue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weight Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parties.map((party) => {
              const totalWeight = issues.reduce((sum, issue) => {
                const preference = getPreference(party.id, issue.id);
                return sum + preference.weight;
              }, 0);

              return (
                <div key={party.id} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{party.name}</span>
                  <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {totalWeight}%
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Weights should ideally sum to 100% for each party to represent relative importance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
