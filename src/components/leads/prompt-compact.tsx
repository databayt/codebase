/**
 * Compact Production-Ready Prompt Interface for Leads
 * Single-row design with inline controls for efficient lead processing
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  Paperclip,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { extractLeadsFromText, bulkImportLeads } from './action';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ProcessingStatus {
  stage: 'idle' | 'processing' | 'complete' | 'error';
  message: string;
  details?: {
    total?: number;
    processed?: number;
    duplicates?: number;
    errors?: number;
    averageScore?: number;
  };
}

export function CompactPrompt() {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>({
    stage: 'idle',
    message: '',
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, isExpanded ? 200 : 60);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input, isExpanded]);

  const handleSubmit = async () => {
    if (!input.trim() && attachedFiles.length === 0) {
      toast.error('Please provide text or attach a file');
      return;
    }

    setIsProcessing(true);
    setStatus({
      stage: 'processing',
      message: 'Initializing...',
    });

    try {
      let totalLeads = 0;
      let duplicatesCount = 0;
      let errorsCount = 0;
      let totalScore = 0;

      // Process text input
      if (input.trim()) {
        setStatus({
          stage: 'processing',
          message: 'Extracting leads from text...',
        });

        const result = await extractLeadsFromText({
          rawText: input,
          source: 'web',
          options: {
            autoScore: true,
            autoEnrich: true,
            deduplication: true,
          },
        });

        if (result.success && result.data) {
          totalLeads += result.data.leads.length;
          totalScore = result.data.leads.reduce((sum, lead) => sum + lead.score, 0);

          setStatus({
            stage: 'processing',
            message: `Found ${result.data.leads.length} leads from text`,
            details: {
              total: result.data.leads.length,
              processed: result.data.leads.length,
              averageScore: Math.round(totalScore / result.data.leads.length),
            },
          });
        }
      }

      // Process attached files
      for (const file of attachedFiles) {
        setStatus({
          stage: 'processing',
          message: `Processing ${file.name}...`,
        });

        const leads = await parseFile(file);
        if (leads.length > 0) {
          const importResult = await bulkImportLeads(leads);
          if (importResult.success && importResult.data) {
            totalLeads += importResult.data.created;
            duplicatesCount += importResult.data.skipped;
          }
        }
      }

      // Final status
      setStatus({
        stage: 'complete',
        message: `Successfully processed ${totalLeads} leads`,
        details: {
          total: totalLeads,
          processed: totalLeads,
          duplicates: duplicatesCount,
          errors: errorsCount,
          averageScore: totalScore > 0 ? Math.round(totalScore / totalLeads) : 0,
        },
      });

      // Show notification
      toast.success(
        <div className="space-y-1">
          <div className="font-medium">Import Complete</div>
          <div className="text-sm text-muted-foreground">
            ✅ {totalLeads} leads imported
            {duplicatesCount > 0 && <> • {duplicatesCount} duplicates skipped</>}
            {status.details?.averageScore && <> • Avg score: {status.details.averageScore}</>}
          </div>
        </div>
      );

      // Reset form after successful processing
      setTimeout(() => {
        setInput('');
        setAttachedFiles([]);
        setStatus({ stage: 'idle', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Processing error:', error);
      setStatus({
        stage: 'error',
        message: 'Failed to process leads',
      });
      toast.error('Failed to process leads. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    try {
      if (extension === '.csv') {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        return result.data;
      } else if (['.xlsx', '.xls'].includes(extension)) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
      } else if (extension === '.json') {
        const text = await file.text();
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      console.error('File parsing error:', error);
    }

    return [];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return ['.csv', '.xlsx', '.xls', '.json'].includes(ext);
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were skipped. Only CSV, Excel, and JSON files are supported.');
    }

    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {/* Main Input Area */}
      <div className="relative bg-background border rounded-lg shadow-sm">
        {/* File Attachments */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b">
            {attachedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                <Paperclip className="h-3 w-3 mr-1" />
                <span className="text-xs max-w-[150px] truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2 p-3">
          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe leads to find, paste data, or attach files..."
              className="resize-none border-0 focus-visible:ring-0 min-h-[40px] pr-2"
              style={{
                height: '40px',
                overflow: isExpanded ? 'auto' : 'hidden',
              }}
              disabled={isProcessing}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Mic Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isProcessing}
              onClick={() => toast.info('Voice input coming soon!')}
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Attach Button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.json"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Send Button */}
            <Button
              size="icon"
              className="h-8 w-8"
              onClick={handleSubmit}
              disabled={isProcessing || (!input.trim() && attachedFiles.length === 0)}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {status.stage !== 'idle' && (
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status.stage === 'processing' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {status.stage === 'complete' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {status.stage === 'error' && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm font-medium">{status.message}</span>
            </div>

            {status.details && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {status.details.total && (
                  <span>
                    <span className="font-medium text-foreground">{status.details.total}</span> leads
                  </span>
                )}
                {status.details.duplicates !== undefined && status.details.duplicates > 0 && (
                  <span>
                    <span className="font-medium text-yellow-600">{status.details.duplicates}</span> duplicates
                  </span>
                )}
                {status.details.averageScore !== undefined && (
                  <span>
                    Score: <span className="font-medium text-foreground">{status.details.averageScore}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {status.stage === 'processing' && status.details?.total && (
            <Progress
              value={(status.details.processed || 0) / status.details.total * 100}
              className="h-1"
            />
          )}
        </div>
      )}

      {/* Keyboard Shortcut Hint */}
      <div className="text-xs text-muted-foreground text-center">
        Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Cmd</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send
      </div>
    </div>
  );
}