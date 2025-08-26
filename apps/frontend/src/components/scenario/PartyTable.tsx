'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Party {
  id: string;
  name: string;
  type: 'country' | 'organization' | 'individual';
  country?: string;
  organization?: string;
}

interface PartyTableProps {
  parties: Party[];
  onPartiesChange: (parties: Party[]) => void;
}

export function PartyTable({ parties, onPartiesChange }: PartyTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Party>>({
    name: '',
    type: 'organization',
    country: '',
    organization: ''
  });

  const handleAdd = () => {
    if (!formData.name) return;

    const newParty: Party = {
      id: `party_${Date.now()}`,
      name: formData.name,
      type: formData.type || 'organization',
      country: formData.country,
      organization: formData.organization
    };

    onPartiesChange([...parties, newParty]);
    setFormData({ name: '', type: 'organization', country: '', organization: '' });
    setIsAdding(false);
  };

  const handleEdit = (party: Party) => {
    setEditingId(party.id);
    setFormData(party);
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.name) return;

    const updatedParties = parties.map(party =>
      party.id === editingId
        ? { ...party, ...formData }
        : party
    );

    onPartiesChange(updatedParties);
    setEditingId(null);
    setFormData({ name: '', type: 'organization', country: '', organization: '' });
  };

  const handleDelete = (id: string) => {
    onPartiesChange(parties.filter(party => party.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', type: 'organization', country: '', organization: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Negotiation Parties</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Party
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Party' : 'Add New Party'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'country' | 'organization' | 'individual') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g., Department of State"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleSaveEdit : handleAdd}>
                {editingId ? 'Save Changes' : 'Add Party'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Parties ({parties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {parties.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No parties added yet. Click "Add Party" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((party) => (
                  <TableRow key={party.id}>
                    <TableCell className="font-medium">{party.name}</TableCell>
                    <TableCell className="capitalize">{party.type}</TableCell>
                    <TableCell>{party.country || '-'}</TableCell>
                    <TableCell>{party.organization || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(party)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(party.id)}
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
