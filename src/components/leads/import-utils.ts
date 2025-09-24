/**
 * Utility functions for importing leads
 */

import { toast } from 'sonner';
import { bulkImportLeads } from './action';

/**
 * Process CSV text and import leads
 */
export async function processCSVFile(
  csvText: string,
  source = 'CSV_IMPORT'
): Promise<{ imported: number; duplicates: number; errors: number }> {
  try {
    // Parse CSV
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast.error('CSV file is empty or invalid');
      return { imported: 0, duplicates: 0, errors: 0 };
    }

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
    const leads = [];

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
      if (values.length !== headers.length) continue;

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Only add if has essential data
      if (row.name || row.Name || row.email || row.Email) {
        leads.push(row);
      }
    }

    if (leads.length === 0) {
      toast.error('No valid leads found in CSV');
      return { imported: 0, duplicates: 0, errors: 0 };
    }

    // Import leads using bulk import
    const result = await bulkImportLeads(leads, source);

    if (result.success && result.data) {
      // Show detailed notification
      toast.success(
        <div>
          <div className="font-medium">Import Complete!</div>
          <div className="text-sm text-muted-foreground mt-1">
            ✅ Imported: {result.data.imported} leads<br />
            ⚠️ Duplicates skipped: {result.data.duplicates}<br />
            📊 Total processed: {result.data.total}
          </div>
        </div>
      );

      return {
        imported: result.data.imported,
        duplicates: result.data.duplicates,
        errors: result.data.total - result.data.imported - result.data.duplicates,
      };
    } else {
      toast.error(result.error || 'Import failed');
      return { imported: 0, duplicates: 0, errors: leads.length };
    }
  } catch (error) {
    console.error('CSV processing error:', error);
    toast.error('Failed to process CSV file');
    return { imported: 0, duplicates: 0, errors: 0 };
  }
}

/**
 * Process JSON file and import leads
 */
export async function processJSONFile(
  jsonText: string,
  source = 'JSON_IMPORT'
): Promise<{ imported: number; duplicates: number; errors: number }> {
  try {
    const data = JSON.parse(jsonText);
    const leads = Array.isArray(data) ? data : [data];

    if (leads.length === 0) {
      toast.error('No leads found in JSON');
      return { imported: 0, duplicates: 0, errors: 0 };
    }

    // Import leads
    const result = await bulkImportLeads(leads, source);

    if (result.success && result.data) {
      toast.success(
        <div>
          <div className="font-medium">JSON Import Complete!</div>
          <div className="text-sm text-muted-foreground mt-1">
            ✅ Imported: {result.data.imported} leads<br />
            ⚠️ Duplicates: {result.data.duplicates}
          </div>
        </div>
      );

      return {
        imported: result.data.imported,
        duplicates: result.data.duplicates,
        errors: result.data.total - result.data.imported - result.data.duplicates,
      };
    } else {
      toast.error(result.error || 'Import failed');
      return { imported: 0, duplicates: 0, errors: leads.length };
    }
  } catch (error) {
    console.error('JSON processing error:', error);
    toast.error('Invalid JSON format');
    return { imported: 0, duplicates: 0, errors: 0 };
  }
}

/**
 * Process Excel-like data
 */
export async function processExcelData(
  data: any[],
  source = 'EXCEL_IMPORT'
): Promise<{ imported: number; duplicates: number; errors: number }> {
  try {
    if (!data || data.length === 0) {
      toast.error('No data found in file');
      return { imported: 0, duplicates: 0, errors: 0 };
    }

    // Import leads
    const result = await bulkImportLeads(data, source);

    if (result.success && result.data) {
      toast.success(
        <div>
          <div className="font-medium">Excel Import Complete!</div>
          <div className="text-sm text-muted-foreground mt-1">
            ✅ Imported: {result.data.imported} leads<br />
            ⚠️ Duplicates: {result.data.duplicates}
          </div>
        </div>
      );

      return {
        imported: result.data.imported,
        duplicates: result.data.duplicates,
        errors: result.data.total - result.data.imported - result.data.duplicates,
      };
    } else {
      toast.error(result.error || 'Import failed');
      return { imported: 0, duplicates: 0, errors: data.length };
    }
  } catch (error) {
    console.error('Excel processing error:', error);
    toast.error('Failed to process Excel data');
    return { imported: 0, duplicates: 0, errors: 0 };
  }
}

/**
 * Download leads as CSV
 */
export function downloadAsCSV(data: any[], filename = 'leads_export.csv') {
  try {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Build CSV content
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${data.length} leads as CSV`);
  } catch (error) {
    console.error('CSV download error:', error);
    toast.error('Failed to download CSV');
  }
}

/**
 * Download leads as JSON
 */
export function downloadAsJSON(data: any[], filename = 'leads_export.json') {
  try {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${data.length} leads as JSON`);
  } catch (error) {
    console.error('JSON download error:', error);
    toast.error('Failed to download JSON');
  }
}