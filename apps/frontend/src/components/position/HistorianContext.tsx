'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Search,
  Filter
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

interface Precedent {
  id: string;
  title: string;
  description: string;
  date: string;
  parties: string[];
  outcome: 'success' | 'failure' | 'partial';
  relevance_score: number;
  key_lessons: string[];
  tags: string[];
}

interface HistoricalPosition {
  id: string;
  party: string;
  issue: string;
  date: string;
  stance: string;
  outcome: 'achieved' | 'compromised' | 'failed';
  notes: string;
}

interface HistorianContextProps {
  party: Party;
  issue: Issue;
}

export function HistorianContext({ party, issue }: HistorianContextProps) {
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [historicalPositions, setHistoricalPositions] = useState<HistoricalPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'success' | 'failure' | 'partial'>('all');

  useEffect(() => {
    loadHistoricalData();
  }, [party, issue]);

  const loadHistoricalData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from API
      const mockPrecedents: Precedent[] = [
        {
          id: '1',
          title: 'Paris Climate Agreement (2015)',
          description: 'International agreement on climate change mitigation',
          date: '2015-12-12',
          parties: ['United States', 'China', 'European Union'],
          outcome: 'success',
          relevance_score: 0.85,
          key_lessons: [
            'Voluntary commitments can drive participation',
            'Financial mechanisms crucial for developing nations',
            'Regular review cycles maintain momentum'
          ],
          tags: ['climate', 'international', 'voluntary']
        },
        {
          id: '2',
          title: 'Iran Nuclear Deal (2015)',
          description: 'Agreement on Iran\'s nuclear program',
          date: '2015-07-14',
          parties: ['Iran', 'United States', 'United Kingdom', 'France', 'Germany', 'Russia', 'China'],
          outcome: 'partial',
          relevance_score: 0.72,
          key_lessons: [
            'Verification mechanisms essential',
            'Economic sanctions as leverage',
            'Domestic politics can undermine agreements'
          ],
          tags: ['nuclear', 'security', 'verification']
        },
        {
          id: '3',
          title: 'Brexit Negotiations (2016-2020)',
          description: 'UK withdrawal from European Union',
          date: '2020-01-31',
          parties: ['United Kingdom', 'European Union'],
          outcome: 'failure',
          relevance_score: 0.68,
          key_lessons: [
            'Emotional issues can override economic logic',
            'Complex agreements require detailed planning',
            'Public opinion can shift negotiation dynamics'
          ],
          tags: ['trade', 'sovereignty', 'complex']
        }
      ];

      const mockHistoricalPositions: HistoricalPosition[] = [
        {
          id: '1',
          party: party.name,
          issue: 'Climate Change',
          date: '2020-03-15',
          stance: 'Strong support for renewable energy targets',
          outcome: 'achieved',
          notes: 'Successfully negotiated 40% renewable energy target by 2030'
        },
        {
          id: '2',
          party: party.name,
          issue: 'Trade Relations',
          date: '2019-08-22',
          stance: 'Advocated for free trade agreements',
          outcome: 'compromised',
          notes: 'Reached partial agreement with some tariff reductions'
        },
        {
          id: '3',
          party: party.name,
          issue: 'Security Cooperation',
          date: '2018-11-10',
          stance: 'Pushed for intelligence sharing protocols',
          outcome: 'failed',
          notes: 'Failed to reach agreement due to sovereignty concerns'
        }
      ];

      setPrecedents(mockPrecedents);
      setHistoricalPositions(mockHistoricalPositions);
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrecedents = precedents.filter(precedent => {
    const matchesSearch = precedent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         precedent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         precedent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || precedent.outcome === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
      case 'achieved':
        return 'bg-green-100 text-green-800';
      case 'failure':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'partial':
      case 'compromised':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
      case 'achieved':
        return <CheckCircle className="w-4 h-4" />;
      case 'failure':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'partial':
      case 'compromised':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Historical Context
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Precedents and past positions for {party.name} on {issue.title}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="precedents" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="precedents">Precedents</TabsTrigger>
            <TabsTrigger value="positions">Past Positions</TabsTrigger>
          </TabsList>

          <TabsContent value="precedents" className="flex-1 overflow-hidden">
            <div className="p-4 space-y-4">
              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search precedents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'success', 'partial', 'failure'] as const).map(filter => (
                    <Button
                      key={filter}
                      size="sm"
                      variant={selectedFilter === filter ? "default" : "outline"}
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter === 'all' ? 'All' : 
                       filter === 'success' ? 'Success' :
                       filter === 'partial' ? 'Partial' : 'Failure'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Precedents List */}
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {filteredPrecedents.map(precedent => (
                    <Card key={precedent.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {precedent.title}
                          </CardTitle>
                          <Badge className={getOutcomeColor(precedent.outcome)}>
                            {getOutcomeIcon(precedent.outcome)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(precedent.date).toLocaleDateString()}
                          <span>•</span>
                          <span>Relevance: {Math.round(precedent.relevance_score * 100)}%</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {precedent.description}
                        </p>
                        <div className="space-y-2">
                          <div className="text-xs">
                            <span className="font-medium">Parties:</span> {precedent.parties.join(', ')}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Key Lessons:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {precedent.key_lessons.slice(0, 2).map((lesson, index) => (
                                <li key={index} className="line-clamp-1">{lesson}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {precedent.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="positions" className="flex-1 overflow-hidden">
            <div className="p-4">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {historicalPositions.map(position => (
                    <Card key={position.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium">
                            {position.issue}
                          </CardTitle>
                          <Badge className={getOutcomeColor(position.outcome)}>
                            {getOutcomeIcon(position.outcome)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(position.date).toLocaleDateString()}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs">
                            <span className="font-medium">Stance:</span>
                            <p className="mt-1 text-muted-foreground">{position.stance}</p>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Notes:</span>
                            <p className="mt-1 text-muted-foreground">{position.notes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/50">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Historical data powered by AI analysis</span>
            <Button size="sm" variant="ghost" className="h-6 px-2">
              <ExternalLink className="w-3 h-3 mr-1" />
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
