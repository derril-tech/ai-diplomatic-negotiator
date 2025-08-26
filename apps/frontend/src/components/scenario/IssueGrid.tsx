'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

interface IssueGridProps {
  issues: Issue[];
  onIssuesChange: (issues: Issue[]) => void;
}

export function IssueGrid({ issues, onIssuesChange }: IssueGridProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Issue>>({
    title: '',
    description: '',
    type: 'distributive',
    weight: 0,
    minValue: 0,
    maxValue: 100,
    unit: ''
  });

  const handleAdd = () => {
    if (!formData.title || !formData.description) return;

    const newIssue: Issue = {
      id: `issue_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type || 'distributive',
      weight: formData.weight || 0,
      minValue: formData.minValue || 0,
      maxValue: formData.maxValue || 100,
      unit: formData.unit
    };

    onIssuesChange([...issues, newIssue]);
    setFormData({
      title: '',
      description: '',
      type: 'distributive',
      weight: 0,
      minValue: 0,
      maxValue: 100,
      unit: ''
    });
    setIsAdding(false);
  };

  const handleEdit = (issue: Issue) => {
    setEditingId(issue.id);
    setFormData(issue);
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.title || !formData.description) return;

    const updatedIssues = issues.map(issue =>
      issue.id === editingId
        ? { ...issue, ...formData }
        : issue
    );

    onIssuesChange(updatedIssues);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      type: 'distributive',
      weight: 0,
      minValue: 0,
      maxValue: 100,
      unit: ''
    });
  };

  const handleDelete = (id: string) => {
    onIssuesChange(issues.filter(issue => issue.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      type: 'distributive',
      weight: 0,
      minValue: 0,
      maxValue: 100,
      unit: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Negotiation Issues</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Issue
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Issue' : 'Add New Issue'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Tariff Rates"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue and its importance..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">Issue Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'distributive' | 'integrative' | 'linked') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributive">Distributive (Zero-sum)</SelectItem>
                    <SelectItem value="integrative">Integrative (Expandable)</SelectItem>
                    <SelectItem value="linked">Linked (Connected)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Default Weight (%)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="minValue">Minimum Value</Label>
                <Input
                  id="minValue"
                  type="number"
                  value={formData.minValue}
                  onChange={(e) => setFormData({ ...formData, minValue: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">Maximum Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={formData.maxValue}
                  onChange={(e) => setFormData({ ...formData, maxValue: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., %, $, tons"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleSaveEdit : handleAdd}>
                {editingId ? 'Save Changes' : 'Add Issue'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Issues ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No issues added yet. Click "Add Issue" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{issue.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {issue.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{issue.type}</TableCell>
                    <TableCell>{issue.weight}%</TableCell>
                    <TableCell>
                      {issue.minValue} - {issue.maxValue}
                    </TableCell>
                    <TableCell>{issue.unit || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(issue)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(issue.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
