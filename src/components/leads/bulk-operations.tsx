/**
 * Bulk operations component for leads
 * Handles bulk actions on multiple selected leads
 */

'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Mail,
  Tag,
  UserX,
  Download,
  Archive,
  Trash2,
  CheckSquare,
} from 'lucide-react';
import { deleteLead, bulkUpdateLeads } from './action';
import type { Lead } from './type';

interface BulkOperationsProps {
  selectedLeads: string[];
  onComplete?: () => void;
}

export function BulkOperations({ selectedLeads, onComplete }: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      // Process deletions one by one
      await Promise.all(
        selectedLeads.map(leadId => deleteLead(leadId))
      );
      onComplete?.();
    } catch (error) {
      console.error('Bulk delete failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatusUpdate = async (status: Lead['status']) => {
    setIsProcessing(true);
    try {
      // Use bulk update function
      await bulkUpdateLeads({
        leadIds: selectedLeads,
        updates: { status }
      });
      onComplete?.();
    } catch (error) {
      console.error('Bulk status update failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting leads:', selectedLeads);
    // In a real app, this would generate and download a CSV/Excel file
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        <CheckSquare className="h-3 w-3 mr-1" />
        {selectedLeads.length} selected
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            disabled={isProcessing}
          >
            Bulk Actions
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleBulkStatusUpdate('contacted')}>
            <Mail className="h-4 w-4 mr-2" />
            Mark as Contacted
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleBulkStatusUpdate('qualified')}>
            <Tag className="h-4 w-4 mr-2" />
            Mark as Qualified
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleBulkStatusUpdate('unqualified')}>
            <UserX className="h-4 w-4 mr-2" />
            Mark as Unqualified
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleBulkStatusUpdate('archived')}>
            <Archive className="h-4 w-4 mr-2" />
            Archive Selected
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleBulkDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}