/**
 * Export Dialog Component
 * Handles exporting leads to various formats
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileJson, FileText, Loader2 } from 'lucide-react';
import { exportLeads } from './action';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { LEAD_TYPE_LABELS, LEAD_STATUS } from './constant';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  filters?: any;
  selectedLeads?: string[];
}

export function ExportDialog({
  open,
  onClose,
  filters,
  selectedLeads,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [includeFields, setIncludeFields] = useState({
    name: true,
    email: true,
    phone: true,
    company: true,
    title: true,
    type: true,
    status: true,
    score: true,
    source: true,
    website: true,
    linkedinUrl: true,
    location: true,
    industry: true,
    verified: true,
    createdAt: true,
    notes: false,
    tags: false,
  });
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportLeads(filters, format);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Export failed');
      }

      const { data, count } = result.data;

      // Filter fields based on user selection
      const filteredData = data.map((row: any) => {
        const filtered: any = {};
        Object.entries(includeFields).forEach(([field, include]) => {
          if (include && row[field] !== undefined) {
            filtered[field] = row[field];
          }
        });
        return filtered;
      });

      // Generate file based on format
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'json':
          blob = new Blob([JSON.stringify(filteredData, null, 2)], {
            type: 'application/json',
          });
          filename = `leads_export_${Date.now()}.json`;
          break;

        case 'csv':
          const csv = Papa.unparse(filteredData);
          blob = new Blob([csv], { type: 'text/csv' });
          filename = `leads_export_${Date.now()}.csv`;
          break;

        case 'xlsx':
          const ws = XLSX.utils.json_to_sheet(filteredData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Leads');

          // Style the header row
          const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + '1';
            if (!ws[address]) continue;
            ws[address].s = {
              font: { bold: true },
              fill: { fgColor: { rgb: 'FFFFAA00' } },
            };
          }

          const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([xlsxBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          filename = `leads_export_${Date.now()}.xlsx`;
          break;

        default:
          throw new Error('Invalid format');
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${count} leads successfully`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    } finally {
      setExporting(false);
    }
  };

  const formatIcons = {
    csv: <FileText className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
  };

  const formatDescriptions = {
    csv: 'Comma-separated values, compatible with all spreadsheet apps',
    json: 'JavaScript Object Notation, ideal for developers and APIs',
    xlsx: 'Excel format with formatting and multiple sheets support',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Leads</DialogTitle>
          <DialogDescription>
            Choose export format and select fields to include
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              {(['csv', 'json', 'xlsx'] as const).map((fmt) => (
                <div key={fmt} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={fmt} id={fmt} className="mt-1" />
                  <label htmlFor={fmt} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      {formatIcons[fmt]}
                      <span className="uppercase">{fmt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDescriptions[fmt]}
                    </p>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fields to Export</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allTrue = Object.fromEntries(
                    Object.keys(includeFields).map((key) => [key, true])
                  );
                  setIncludeFields(allTrue as any);
                }}
              >
                Select All
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
              {Object.entries(includeFields).map(([field, checked]) => (
                <label key={field} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) =>
                      setIncludeFields({ ...includeFields, [field]: !!checked })
                    }
                  />
                  <span className="text-sm capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Export Scope:</span>
              <span className="font-medium">
                {selectedLeads && selectedLeads.length > 0
                  ? `${selectedLeads.length} selected leads`
                  : filters
                  ? 'Filtered leads'
                  : 'All leads'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Selected Fields:</span>
              <span className="font-medium">
                {Object.values(includeFields).filter(Boolean).length} fields
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={exporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}