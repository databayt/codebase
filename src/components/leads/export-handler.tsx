/**
 * Simple export handler for leads
 * Adds export functionality without changing existing UI
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { exportLeads } from './action';
import { downloadAsCSV, downloadAsJSON } from './import-utils';

interface ExportHandlerProps {
  filters?: any;
  selectedLeads?: string[];
}

export function ExportHandler({ filters, selectedLeads }: ExportHandlerProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true);
    try {
      const result = await exportLeads(format, filters);

      if (result.success && result.data) {
        const { data, count } = result.data;

        if (format === 'csv') {
          downloadAsCSV(data, `leads_export_${Date.now()}.csv`);
        } else {
          downloadAsJSON(data, `leads_export_${Date.now()}.json`);
        }

        toast.success(`Exported ${count} leads successfully`);
      } else {
        toast.error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}