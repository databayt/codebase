/**
 * All leads list view component
 * Displays all leads in a table format with filtering and sorting
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Search, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Lead, LeadFilters } from './type';
import { LEAD_STATUS, LEAD_SOURCE, LEAD_SCORE_RANGES } from './constant';
import { Detail } from './detail';
import { Form } from './form';
import { deleteLead } from './action';

interface AllProps {
  leads: Lead[];
  isLoading: boolean;
  filters: LeadFilters;
  showFilters: boolean;
  onFiltersChange: (filters: LeadFilters) => void;
  selectedLeads: string[];
  onSelectionChange: (ids: string[]) => void;
  onRefresh: () => void;
}

export function All({
  leads,
  isLoading,
  filters,
  showFilters,
  onFiltersChange,
  selectedLeads,
  onSelectionChange,
  onRefresh,
}: AllProps) {
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(leads.map(l => l.id));
    }
  };

  // Handle single selection
  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      onSelectionChange(selectedLeads.filter(lid => lid !== id));
    } else {
      onSelectionChange([...selectedLeads, id]);
    }
  };

  // Sort leads
  const sortedLeads = useMemo(() => {
    const sorted = [...leads].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [leads, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const result = await deleteLead(id);
      if (result.success) {
        onRefresh();
      }
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= LEAD_SCORE_RANGES.HOT.min) return 'destructive';
    if (score >= LEAD_SCORE_RANGES.WARM.min) return 'warning';
    if (score >= LEAD_SCORE_RANGES.COOL.min) return 'default';
    return 'secondary';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'default';
      case 'CONTACTED': return 'secondary';
      case 'QUALIFIED': return 'outline';
      case 'PROPOSAL': return 'default';
      case 'NEGOTIATION': return 'warning';
      case 'CLOSED_WON': return 'success';
      case 'CLOSED_LOST': return 'destructive';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading leads...</div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      {showFilters && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {filters.status ? LEAD_STATUS[filters.status] : 'All Statuses'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onFiltersChange({ ...filters, status: undefined })}>
                  All Statuses
                </DropdownMenuItem>
                {Object.entries(LEAD_STATUS).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onFiltersChange({ ...filters, status: key as any })}
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {filters.source ? LEAD_SOURCE[filters.source] : 'All Sources'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onFiltersChange({ ...filters, source: undefined })}>
                  All Sources
                </DropdownMenuItem>
                {Object.entries(LEAD_SOURCE).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onFiltersChange({ ...filters, source: key as any })}
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={() => onFiltersChange({})}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
                Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('score')}>
                Score {sortField === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email || '-'}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getScoreColor(lead.score)}>
                    {lead.score}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(lead.status)}>
                    {LEAD_STATUS[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>{LEAD_SOURCE[lead.source]}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailLead(lead)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditLead(lead)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(lead.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {leads.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No leads found. Create your first lead to get started.
          </div>
        )}
      </div>

      {/* Modals */}
      {detailLead && (
        <Detail
          lead={detailLead}
          open={!!detailLead}
          onClose={() => setDetailLead(null)}
          onEdit={() => {
            setEditLead(detailLead);
            setDetailLead(null);
          }}
        />
      )}

      {editLead && (
        <Form
          open={!!editLead}
          onClose={() => setEditLead(null)}
          onSuccess={() => {
            setEditLead(null);
            onRefresh();
          }}
          lead={editLead}
          mode="edit"
        />
      )}
    </>
  );
}