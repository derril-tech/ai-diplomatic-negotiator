'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartyTable } from './PartyTable';
import { IssueGrid } from './IssueGrid';
import { WeightSliders } from './WeightSliders';
import { BatnaEditor } from './BatnaEditor';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface ScenarioData {
  title: string;
  description: string;
  parties: Array<{
    id: string;
    name: string;
    type: 'country' | 'organization' | 'individual';
    country?: string;
    organization?: string;
  }>;
  issues: Array<{
    id: string;
    title: string;
    description: string;
    type: 'distributive' | 'integrative' | 'linked';
    weight: number;
    minValue: number;
    maxValue: number;
    unit?: string;
  }>;
  preferences: Record<string, Record<string, {
    weight: number;
    reservationValue: number;
    targetValue: number;
    batna: string;
  }>>;
}

export function ScenarioWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scenarioData, setScenarioData] = useState<ScenarioData>({
    title: '',
    description: '',
    parties: [],
    issues: [],
    preferences: {}
  });

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Set negotiation title and description' },
    { id: 2, title: 'Parties', description: 'Define negotiation participants' },
    { id: 3, title: 'Issues', description: 'Define negotiation topics' },
    { id: 4, title: 'Weights', description: 'Set party issue weights' },
    { id: 5, title: 'BATNA', description: 'Define Best Alternative to Negotiated Agreement' }
  ];

  const updateScenarioData = (updates: Partial<ScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Send to API
      console.log('Saving scenario:', scenarioData);
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scenario Wizard</h1>
        <p className="text-muted-foreground">
          Create a new diplomatic negotiation scenario
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background border-muted-foreground text-muted-foreground'
              }`}>
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Negotiation Title</Label>
                <Input
                  id="title"
                  value={scenarioData.title}
                  onChange={(e) => updateScenarioData({ title: e.target.value })}
                  placeholder="e.g., US-EU Clean Energy Trade Dispute"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={scenarioData.description}
                  onChange={(e) => updateScenarioData({ description: e.target.value })}
                  placeholder="Describe the negotiation context, background, and objectives..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <PartyTable
              parties={scenarioData.parties}
              onPartiesChange={(parties) => updateScenarioData({ parties })}
            />
          )}

          {currentStep === 3 && (
            <IssueGrid
              issues={scenarioData.issues}
              onIssuesChange={(issues) => updateScenarioData({ issues })}
            />
          )}

          {currentStep === 4 && (
            <WeightSliders
              parties={scenarioData.parties}
              issues={scenarioData.issues}
              preferences={scenarioData.preferences}
              onPreferencesChange={(preferences) => updateScenarioData({ preferences })}
            />
          )}

          {currentStep === 5 && (
            <BatnaEditor
              parties={scenarioData.parties}
              issues={scenarioData.issues}
              preferences={scenarioData.preferences}
              onPreferencesChange={(preferences) => updateScenarioData({ preferences })}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === steps.length ? (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
