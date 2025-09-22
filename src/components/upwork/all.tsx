'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Filter,
  FileText,
  Eye,
  Edit,
  Trash2,
  Send,
  Copy,
  Download,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useSavedProposals } from './use-upwork';
import { PROPOSAL_STATUS_OPTIONS, PROPOSAL_TONES } from './constant';
import type { Proposal, ProposalStatus, ProposalTone } from './type';

export function ProposalList() {
  const {
    proposals,
    selectedProposal,
    setSelectedProposal,
    deleteProposal,
    updateProposal,
  } = useSavedProposals();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [toneFilter, setToneFilter] = useState<ProposalTone | 'all'>('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingContent, setEditingContent] = useState('');

  // Filter proposals
  const filteredProposals = proposals.filter(proposal => {
    if (search && !proposal.content.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && proposal.status !== statusFilter) {
      return false;
    }
    if (toneFilter !== 'all' && proposal.tone !== toneFilter) {
      return false;
    }
    return true;
  });

  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleEdit = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setEditingContent(proposal.content);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedProposal) {
      updateProposal(selectedProposal.id, { content: editingContent });
      setShowEditDialog(false);
      setSelectedProposal(null);
    }
  };

  const handleStatusChange = (proposalId: string, status: ProposalStatus) => {
    updateProposal(proposalId, { status });
  };

  const handleDelete = (proposalId: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      deleteProposal(proposalId);
    }
  };

  const exportToFile = () => {
    const data = JSON.stringify(filteredProposals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposals-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: ProposalStatus) => {
    const option = PROPOSAL_STATUS_OPTIONS.find(o => o.value === status);
    return option ? (
      <Badge className={option.color}>
        {option.label}
      </Badge>
    ) : null;
  };

  const getToneBadge = (tone: ProposalTone) => {
    const option = PROPOSAL_TONES.find(o => o.value === tone);
    return option ? (
      <Badge variant="outline">
        {option.icon} {option.label}
      </Badge>
    ) : null;
  };

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved proposals yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Generate and save proposals from the Generate tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {PROPOSAL_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={toneFilter} onValueChange={(v) => setToneFilter(v as any)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tones</SelectItem>
            {PROPOSAL_TONES.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={exportToFile}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Saved Proposals ({filteredProposals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tone</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id} className="cursor-pointer" onClick={() => handleView(proposal)}>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate text-sm">{proposal.content.substring(0, 100)}...</p>
                    {proposal.keyPoints.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {proposal.keyPoints.slice(0, 3).map((point, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={proposal.status}
                      onValueChange={(v) => handleStatusChange(proposal.id, v as ProposalStatus)}
                    >
                      <SelectTrigger className="border-0 p-0 h-auto">
                        {getStatusBadge(proposal.status)}
                      </SelectTrigger>
                      <SelectContent>
                        {PROPOSAL_STATUS_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{getToneBadge(proposal.tone)}</TableCell>
                  <TableCell>
                    {proposal.score ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {proposal.score}%
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(proposal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(proposal.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(proposal.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      {selectedProposal && !showEditDialog && (
        <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Proposal Details</DialogTitle>
              <DialogDescription>
                Created on {new Date(selectedProposal.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                {getStatusBadge(selectedProposal.status)}
                {getToneBadge(selectedProposal.tone)}
                {selectedProposal.score && (
                  <Badge variant="outline">
                    Score: {selectedProposal.score}%
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Content</h4>
                <div className="prose dark:prose-invert max-w-none text-sm bg-muted p-4 rounded-lg">
                  {selectedProposal.content}
                </div>
              </div>

              {selectedProposal.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Points</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProposal.keyPoints.map((point, i) => (
                      <Badge key={i} variant="secondary">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProposal.questions && selectedProposal.questions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Questions</h4>
                  <ul className="space-y-1">
                    {selectedProposal.questions.map((question, i) => (
                      <li key={i} className="text-sm">• {question}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedProposal(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEdit(selectedProposal)}>
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {showEditDialog && selectedProposal && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Proposal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}