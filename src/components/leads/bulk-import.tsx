/**
 * Bulk Import Component
 * Handles file upload, validation, and batch processing of leads
 */

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  FileUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  FileSpreadsheet,
  Loader2,
  Download,
  Settings,
  Eye,
} from 'lucide-react';
import { bulkImportLeads, detectDuplicates } from './action';
import { LEAD_TYPE, LEAD_TYPE_LABELS, LEAD_SOURCE } from './constant';
import { Lead } from './type';

interface ImportData {
  data: any[];
  headers: string[];
  errors: ValidationError[];
  duplicates: DuplicateInfo[];
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  data: any;
}

interface DuplicateInfo {
  row: number;
  matchField: string;
  existingLead: Partial<Lead>;
  newData: any;
}

interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  errors: ValidationError[];
  averageScore: number;
  importId: string;
}

interface BulkImportProps {
  open: boolean;
  onClose: () => void;
  onComplete: (result: ImportResult) => void;
  defaultType?: keyof typeof LEAD_TYPE;
  defaultSource?: keyof typeof LEAD_SOURCE;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['.csv', '.xlsx', '.xls', '.json'];

export function BulkImport({
  open,
  onClose,
  onComplete,
  defaultType = 'CLIENT',
  defaultSource = 'IMPORT',
}: BulkImportProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'processing' | 'results'>('upload');
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedType, setSelectedType] = useState(defaultType);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  // Field mapping state
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      let data: any[] = [];
      let headers: string[] = [];

      if (extension === '.csv') {
        // Parse CSV
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        data = result.data;
        headers = result.meta.fields || [];
      } else if (['.xlsx', '.xls'].includes(extension)) {
        // Parse Excel
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length > 0) {
          headers = jsonData[0].map(h => String(h || '').trim());
          data = jsonData.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
        }
      } else if (extension === '.json') {
        // Parse JSON
        const text = await file.text();
        const jsonData = JSON.parse(text);
        data = Array.isArray(jsonData) ? jsonData : [jsonData];
        headers = data.length > 0 ? Object.keys(data[0]) : [];
      }

      // Initial validation
      const errors = validateData(data);

      // Auto-detect field mapping
      const mapping = autoDetectMapping(headers);
      setFieldMapping(mapping);

      setImportData({
        data,
        headers,
        errors,
        duplicates: [],
      });

      setStep('mapping');
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('Failed to parse file. Please check the format.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  // Validate imported data
  const validateData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      // Check required fields
      if (!row.name && !row.Name && !row.NAME) {
        errors.push({
          row: index + 2, // +2 because row 1 is headers
          field: 'name',
          message: 'Name is required',
          data: row,
        });
      }

      // Validate email if present
      const email = row.email || row.Email || row.EMAIL;
      if (email && !isValidEmail(email)) {
        errors.push({
          row: index + 2,
          field: 'email',
          message: 'Invalid email format',
          data: row,
        });
      }

      // Validate phone if present
      const phone = row.phone || row.Phone || row.PHONE;
      if (phone && !isValidPhone(phone)) {
        errors.push({
          row: index + 2,
          field: 'phone',
          message: 'Invalid phone format',
          data: row,
        });
      }
    });

    return errors;
  };

  // Auto-detect field mapping
  const autoDetectMapping = (headers: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {};
    const fieldPatterns = {
      name: /^(name|full_?name|contact|person)$/i,
      email: /^(email|e-?mail|email_?address)$/i,
      phone: /^(phone|tel|telephone|mobile|cell)$/i,
      company: /^(company|org|organization|business)$/i,
      title: /^(title|role|position|job_?title)$/i,
      website: /^(website|url|site|web)$/i,
      linkedinUrl: /^(linkedin|linkedin_?url)$/i,
      location: /^(location|address|city|region)$/i,
      industry: /^(industry|sector|field)$/i,
      notes: /^(notes|description|comments|details)$/i,
    };

    headers.forEach(header => {
      Object.entries(fieldPatterns).forEach(([field, pattern]) => {
        if (pattern.test(header)) {
          mapping[header] = field;
        }
      });
    });

    return mapping;
  };

  // Check for duplicates
  const checkDuplicates = async () => {
    if (!importData) return;

    setProcessing(true);
    try {
      const mappedData = importData.data.map(row => mapRowToLead(row));
      const duplicates = await detectDuplicates(mappedData);

      setImportData({
        ...importData,
        duplicates,
      });

      setStep('preview');
    } catch (error) {
      toast.error('Failed to check for duplicates');
    } finally {
      setProcessing(false);
    }
  };

  // Map row data to lead structure
  const mapRowToLead = (row: any): Partial<Lead> => {
    const mapped: any = {
      type: selectedType,
      source: defaultSource,
      score: 0,
      verified: false,
    };

    Object.entries(fieldMapping).forEach(([sourceField, targetField]) => {
      if (row[sourceField]) {
        mapped[targetField] = row[sourceField];
      }
    });

    return mapped;
  };

  // Process import
  const processImport = async () => {
    if (!importData) return;

    setStep('processing');
    setProcessing(true);
    setProgress(0);

    try {
      const validData = importData.data
        .filter((_, index) => !importData.errors.find(e => e.row === index + 2))
        .filter((_, index) => !skipDuplicates || !importData.duplicates.find(d => d.row === index + 2));

      const mappedData = validData.map(row => ({
        ...mapRowToLead(row),
        importId: `import_${Date.now()}`,
        importedAt: new Date(),
      }));

      // Simulate progress for demo
      const chunkSize = 50;
      let processed = 0;

      for (let i = 0; i < mappedData.length; i += chunkSize) {
        const chunk = mappedData.slice(i, i + chunkSize);

        // Process chunk
        await bulkImportLeads(chunk as any);

        processed += chunk.length;
        setProgress((processed / mappedData.length) * 100);
      }

      const result: ImportResult = {
        success: validData.length,
        failed: importData.errors.length,
        duplicates: skipDuplicates ? importData.duplicates.length : 0,
        errors: importData.errors,
        averageScore: 65, // Calculate from actual data
        importId: `import_${Date.now()}`,
      };

      setResult(result);
      setStep('results');

      toast.success(`Successfully imported ${result.success} leads`);
      onComplete(result);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Utility functions
  const isValidEmail = (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  // Download error report
  const downloadErrorReport = () => {
    if (!result) return;

    const csv = Papa.unparse(result.errors.map(e => ({
      Row: e.row,
      Field: e.field,
      Error: e.message,
      Data: JSON.stringify(e.data),
    })));

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_errors_${result.importId}.csv`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bulk Import Leads</DialogTitle>
          <DialogDescription>
            Import multiple leads from CSV, Excel, or JSON files
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                `}
              >
                <input {...getInputProps()} />
                <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, Excel (XLSX/XLS), and JSON files up to 10MB
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Lead Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as keyof typeof LEAD_TYPE)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {Object.entries(LEAD_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Import Options</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Skip duplicate leads</span>
                  </label>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  File should contain columns for: name (required), email, phone, company, title, etc.
                  First row should be column headers.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step === 'mapping' && importData && (
            <div className="space-y-4">
              <h3 className="font-medium">Field Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Map your file columns to lead fields
              </p>

              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-2">
                  {importData.headers.map(header => (
                    <div key={header} className="flex items-center gap-4">
                      <span className="w-1/3 text-sm font-medium">{header}</span>
                      <span className="text-muted-foreground">→</span>
                      <select
                        value={fieldMapping[header] || ''}
                        onChange={(e) => setFieldMapping({
                          ...fieldMapping,
                          [header]: e.target.value,
                        })}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Skip this column</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="company">Company</option>
                        <option value="title">Title</option>
                        <option value="website">Website</option>
                        <option value="linkedinUrl">LinkedIn</option>
                        <option value="location">Location</option>
                        <option value="industry">Industry</option>
                        <option value="notes">Notes</option>
                      </select>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-between">
                <div className="text-sm">
                  <span className="font-medium">{importData.data.length}</span> rows found
                  {importData.errors.length > 0 && (
                    <span className="text-destructive ml-2">
                      ({importData.errors.length} with errors)
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={checkDuplicates} disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check Duplicates
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && importData && (
            <div className="space-y-4">
              <Tabs defaultValue="valid" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="valid">
                    Valid ({importData.data.length - importData.errors.length - importData.duplicates.length})
                  </TabsTrigger>
                  <TabsTrigger value="duplicates">
                    Duplicates ({importData.duplicates.length})
                  </TabsTrigger>
                  <TabsTrigger value="errors">
                    Errors ({importData.errors.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="valid">
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.data
                          .slice(0, 10)
                          .filter((_, index) =>
                            !importData.errors.find(e => e.row === index + 2) &&
                            !importData.duplicates.find(d => d.row === index + 2)
                          )
                          .map((row, index) => {
                            const mapped = mapRowToLead(row);
                            return (
                              <TableRow key={index}>
                                <TableCell>{index + 2}</TableCell>
                                <TableCell>{mapped.name || '-'}</TableCell>
                                <TableCell>{mapped.email || '-'}</TableCell>
                                <TableCell>{mapped.company || '-'}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    {importData.data.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Showing first 10 of {importData.data.length} rows
                      </p>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="duplicates">
                  <ScrollArea className="h-[300px]">
                    {importData.duplicates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No duplicates detected
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Match Field</TableHead>
                            <TableHead>Existing Lead</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importData.duplicates.map((dup, index) => (
                            <TableRow key={index}>
                              <TableCell>{dup.row}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{dup.matchField}</Badge>
                              </TableCell>
                              <TableCell>{dup.existingLead.name}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="errors">
                  <ScrollArea className="h-[300px]">
                    {importData.errors.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No errors found
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importData.errors.map((error, index) => (
                            <TableRow key={index}>
                              <TableCell>{error.row}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{error.field}</Badge>
                              </TableCell>
                              <TableCell className="text-destructive">
                                {error.message}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('mapping')}>
                  Back
                </Button>
                <Button
                  onClick={processImport}
                  disabled={processing || importData.data.length === importData.errors.length}
                >
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Import {importData.data.length - importData.errors.length - (skipDuplicates ? importData.duplicates.length : 0)} Leads
                </Button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Importing Leads...</h3>
                <p className="text-muted-foreground">Please wait while we process your data</p>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          )}

          {step === 'results' && result && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Import Complete!</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.success}
                  </p>
                  <p className="text-sm text-muted-foreground">Successfully Imported</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {result.duplicates}
                  </p>
                  <p className="text-sm text-muted-foreground">Duplicates Skipped</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {result.failed}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Average Lead Score</p>
                  <p className="text-2xl font-bold">{result.averageScore}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Import ID</p>
                  <p className="text-sm font-mono text-muted-foreground">{result.importId}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.errors.length} rows failed validation.
                    <Button
                      variant="link"
                      size="sm"
                      onClick={downloadErrorReport}
                      className="ml-2"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Error Report
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}