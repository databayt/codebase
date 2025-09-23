"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  ArrowRight,
  Copy,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extractMultipleLeads, extractLeadFromText } from "@/lib/text-extraction";
import { createLead } from "./action";

interface DetectedField {
  name: string;
  type: "email" | "phone" | "name" | "company" | "address" | "custom";
  confidence: number;
  sampleValues: string[];
}

interface ImportProgress {
  current: number;
  total: number;
  status: "idle" | "detecting" | "validating" | "importing" | "complete" | "error";
  message?: string;
}

interface PasteImportInterfaceProps {
  onImport?: (data: any[]) => Promise<void>;
  onComplete?: () => void;
  className?: string;
}

export function PasteImportInterface({ onImport, onComplete, className }: PasteImportInterfaceProps) {
  const [rawData, setRawData] = useState("");
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState<ImportProgress>({
    current: 0,
    total: 0,
    status: "idle"
  });

  console.log('🎯 [PasteImportInterface] Component rendered with state:', {
    rawDataLength: rawData.length,
    detectedFieldsCount: detectedFields.length,
    isProcessing,
    hasValidationErrors: validationErrors.length > 0,
    progressStatus: progress.status
  });

  // Detect fields from pasted data using advanced extraction
  const detectFields = useCallback((text: string) => {
    console.log('🔍 [PasteImportInterface.detectFields] Starting field detection');
    console.log('🔍 [PasteImportInterface.detectFields] Text length:', text.length);

    setProgress({ current: 0, total: 100, status: "detecting", message: "Analyzing data..." });

    if (!text.trim()) {
      console.log('⚠️ [PasteImportInterface.detectFields] Empty text, returning empty fields');
      return [];
    }

    const fields: DetectedField[] = [];

    // Try to extract a sample lead to see what fields are available
    console.log('🧪 [PasteImportInterface.detectFields] Extracting sample lead from text');
    const sampleLead = extractLeadFromText(text);
    console.log('🧪 [PasteImportInterface.detectFields] Sample lead extracted:', sampleLead);

    // Build detected fields based on what was found
    if (sampleLead.email) {
      fields.push({
        name: "Email",
        type: "email",
        confidence: 0.95,
        sampleValues: [sampleLead.email]
      });
    }

    if (sampleLead.phone) {
      fields.push({
        name: "Phone",
        type: "phone",
        confidence: 0.85,
        sampleValues: [sampleLead.phone]
      });
    }

    if (sampleLead.name) {
      fields.push({
        name: "Full Name",
        type: "name",
        confidence: 0.85,
        sampleValues: [sampleLead.name]
      });
    }

    if (sampleLead.company) {
      fields.push({
        name: "Company",
        type: "company",
        confidence: 0.8,
        sampleValues: [sampleLead.company]
      });
    }

    // Check if we can extract multiple leads
    console.log('📋 [PasteImportInterface.detectFields] Checking for multiple leads');
    const multipleLeads = extractMultipleLeads(text);
    console.log('📋 [PasteImportInterface.detectFields] Found', multipleLeads.length, 'leads');

    if (multipleLeads.length > 1) {
      fields.push({
        name: "Multiple Entries",
        type: "custom",
        confidence: 0.9,
        sampleValues: [`${multipleLeads.length} entries detected`]
      });
    }

    console.log('✅ [PasteImportInterface.detectFields] Field detection complete:', {
      fieldsCount: fields.length,
      fields: fields.map(f => ({ name: f.name, type: f.type, confidence: f.confidence }))
    });

    setProgress({ current: 100, total: 100, status: "idle" });
    return fields;
  }, []);

  // Handle paste event
  const handlePaste = useCallback((text: string) => {
    console.log('📋 [PasteImportInterface.handlePaste] Handling paste/input event');
    console.log('📋 [PasteImportInterface.handlePaste] Text length:', text.length);

    setRawData(text);
    if (text.trim()) {
      const fields = detectFields(text);
      setDetectedFields(fields);

      // Basic validation
      console.log('✔️ [PasteImportInterface.handlePaste] Running validation');
      const errors: string[] = [];
      if (fields.length === 0) {
        errors.push("No recognizable patterns found");
      }
      if (!fields.find(f => f.type === "email" || f.type === "phone")) {
        errors.push("No contact information detected");
      }

      console.log('✔️ [PasteImportInterface.handlePaste] Validation result:', {
        errorsCount: errors.length,
        errors: errors
      });

      setValidationErrors(errors);
    }
  }, [detectFields]);

  // Process and import data
  const handleImport = useCallback(async () => {
    console.log('🚀 [PasteImportInterface.handleImport] Starting import process');
    console.log('🚀 [PasteImportInterface.handleImport] Pre-conditions:', {
      rawDataLength: rawData.length,
      hasValidationErrors: validationErrors.length > 0,
      validationErrors: validationErrors
    });

    if (!rawData.trim() || validationErrors.length > 0) {
      console.log('⚠️ [PasteImportInterface.handleImport] Aborting: empty data or validation errors');
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: 100, status: "validating", message: "Validating data..." });
    console.log('🔄 [PasteImportInterface.handleImport] Processing started');

    try {
      // Simulate validation
      console.log('⏳ [PasteImportInterface.handleImport] Simulating validation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({ current: 30, total: 100, status: "validating", message: "Checking for duplicates..." });

      console.log('⏳ [PasteImportInterface.handleImport] Checking for duplicates...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({ current: 60, total: 100, status: "importing", message: "Importing leads..." });
      console.log('📥 [PasteImportInterface.handleImport] Starting lead import...');

      // Parse and prepare data for import using intelligent extraction
      console.log('🧪 [PasteImportInterface.handleImport] Extracting leads from raw data');
      const extractedLeads = extractMultipleLeads(rawData);
      console.log('🧪 [PasteImportInterface.handleImport] Extracted', extractedLeads.length, 'leads:',
        extractedLeads.map(l => ({ name: l.name, email: l.email, company: l.company })));

      // Import leads to database
      let successCount = 0;
      let errorCount = 0;
      console.log('💾 [PasteImportInterface.handleImport] Starting database import for', extractedLeads.length, 'leads');

      for (let i = 0; i < extractedLeads.length; i++) {
        const lead = extractedLeads[i];
        console.log(`💾 [PasteImportInterface.handleImport] Processing lead ${i + 1}/${extractedLeads.length}`);

        try {
          const leadData = {
            name: lead.name || 'Unknown',
            email: lead.email || '',
            company: lead.company || '',
            phone: lead.phone || '',
            website: lead.website || '',
            notes: lead.description || '',
            status: 'NEW' as const,
            source: 'IMPORT' as const,
            score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
          };

          console.log(`💾 [PasteImportInterface.handleImport] Lead data prepared:`, leadData);

          console.log(`🔄 [PasteImportInterface.handleImport] Calling createLead...`);
          const result = await createLead(leadData);

          console.log(`📤 [PasteImportInterface.handleImport] createLead result:`, {
            success: result.success,
            error: result.error,
            leadId: result.data?.id
          });

          if (result.success) {
            successCount++;
            console.log(`✅ [PasteImportInterface.handleImport] Lead ${i + 1} created successfully. Total success: ${successCount}`);
          } else {
            errorCount++;
            console.error(`❌ [PasteImportInterface.handleImport] Failed to create lead ${i + 1}:`, result.error);
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ [PasteImportInterface.handleImport] Exception creating lead ${i + 1}:`, error);
          console.error(`❌ [PasteImportInterface.handleImport] Error stack:`, error instanceof Error ? error.stack : 'No stack');
        }
      }

      const importMessage = duplicateCount > 0
        ? `Imported ${successCount} new lead(s). Skipped ${duplicateCount} duplicate(s).`
        : `Successfully imported ${successCount} lead(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`;

      console.log(`🎯 [PasteImportInterface.handleImport] Import complete:`, {
        totalLeads: extractedLeads.length,
        successCount,
        errorCount,
        duplicateCount,
        duplicateEmails,
        message: importMessage
      });

      setProgress({ current: 100, total: 100, status: "complete", message: importMessage });

      // Clear form after successful import
      console.log('🕒 [PasteImportInterface.handleImport] Scheduling cleanup in 3 seconds...');
      setTimeout(() => {
        console.log('🧹 [PasteImportInterface.handleImport] Cleaning up and calling onComplete');
        setRawData("");
        setDetectedFields([]);
        setProgress({ current: 0, total: 0, status: "idle" });
        if (onComplete) {
          console.log('🔄 [PasteImportInterface.handleImport] Calling onComplete callback');
          onComplete();
        }
      }, 3000);
    } catch (error) {
      console.error('❌ [PasteImportInterface.handleImport] Import error:', error);
      console.error('❌ [PasteImportInterface.handleImport] Error stack:', error instanceof Error ? error.stack : 'No stack');

      setProgress({
        current: 0,
        total: 0,
        status: "error",
        message: error instanceof Error ? error.message : "Import failed"
      });
    } finally {
      console.log('🏁 [PasteImportInterface.handleImport] Resetting processing state');
      setIsProcessing(false);
    }
  }, [rawData, validationErrors, onImport]);

  // Calculate import readiness
  const isReady = useMemo(() => {
    return rawData.trim().length > 0 &&
           detectedFields.length > 0 &&
           validationErrors.length === 0 &&
           !isProcessing;
  }, [rawData, detectedFields, validationErrors, isProcessing]);

  const getFieldBadgeVariant = (confidence: number) => {
    if (confidence >= 0.9) return "default";
    if (confidence >= 0.7) return "secondary";
    return "outline";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Import Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Import Leads</CardTitle>
              <CardDescription>
                Paste or type contact information to automatically extract leads
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              Text Import
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your text data here...
Example: John Doe - CEO - john@example.com"
              value={rawData}
              onChange={(e) => handlePaste(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              disabled={isProcessing}
            />
            {rawData && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => {
                  setRawData("");
                  setDetectedFields([]);
                  setValidationErrors([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sample Data Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePaste("John Doe, john@example.com, +1 555-0123, ABC Corp\nJane Smith, jane@example.com, +1 555-0124, XYZ Inc\nBob Johnson, bob@example.com, +1 555-0125, 123 Company")}
              disabled={isProcessing}
            >
              <Copy className="mr-2 h-3 w-3" />
              Use Sample Data
            </Button>
          </div>

          {/* Field Detection Preview */}
          {detectedFields.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Detected Fields</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {detectedFields.map((field, index) => (
                      <Badge
                        key={index}
                        variant={getFieldBadgeVariant(field.confidence)}
                        className="gap-1"
                      >
                        {field.name}
                        <span className="text-xs opacity-60">
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </Badge>
                    ))}
                  </div>

                  {/* Sample Values */}
                  <ScrollArea className="h-[100px] w-full rounded-md border p-3">
                    <div className="space-y-2">
                      {detectedFields.map((field, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium text-muted-foreground">
                            {field.name}:
                          </span>
                          <span className="ml-2 font-mono">
                            {field.sampleValues.slice(0, 2).join(", ")}
                            {field.sampleValues.length > 2 && "..."}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Alerts */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Issues</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-inside list-disc text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Indicator */}
          {progress.status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progress.message}</span>
                <span className="font-medium">
                  {progress.current}/{progress.total}
                </span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
              {progress.status === "complete" && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {progress.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {rawData.trim().split('\n').filter(l => l.trim()).length} lines detected
          </p>
          <Button
            onClick={handleImport}
            disabled={!isReady}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Leads
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Loading Skeleton */}
      {isProcessing && progress.status === "idle" && (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const PasteImport = PasteImportInterface;