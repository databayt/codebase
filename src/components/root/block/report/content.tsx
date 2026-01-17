"use client";

import { useState, useTransition } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  FileIcon,
  Download,
  RefreshCw,
  Zap,
} from "lucide-react";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import type { Report, ReportType } from "./types";
import { REPORT_TYPES, REPORT_TYPE_LABELS, VOLTAGE_LEVELS } from "./types";
import { generateRandomReportFormData, generateTestData } from "./random-values";
import { generateReportNumber } from "./validation";
import { ReportPDF } from "./pdf-template";
import { generateReportDocx } from "./docx-generator";

interface ReportBlockContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

// Demo mode - generates and previews reports without database
export default function ReportBlockContent({
  dictionary,
  lang,
}: ReportBlockContentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<ReportType>("PROTECTION_RELAY");
  const [demoReport, setDemoReport] = useState<Report | null>(null);

  const generateDemoReport = () => {
    startTransition(() => {
      const formData = generateRandomReportFormData(selectedType);
      const report: Report = {
        id: `demo-${Date.now()}`,
        reportNumber: formData.reportNumber,
        reportType: formData.reportType,
        status: "DRAFT",
        header: {
          reportNumber: formData.reportNumber,
          projectName: formData.projectName,
          projectNumber: formData.projectNumber,
          substationName: formData.substationName,
          voltageLevel: formData.voltageLevel,
          location: formData.location,
          testDate: formData.testDate,
          reportDate: new Date(),
          testedBy: formData.testedBy,
          reviewedBy: formData.reviewedBy,
          revisionNumber: 1,
        },
        equipment: {
          equipmentTag: formData.equipmentTag,
          equipmentType: formData.equipmentType,
          manufacturer: formData.manufacturer,
          model: formData.model,
          serialNumber: formData.serialNumber,
        },
        environmental: {
          ambientTemp: formData.ambientTemp,
          humidity: formData.humidity,
        },
        testData: formData.testData,
        notes: formData.notes,
        recommendations: formData.recommendations,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDemoReport(report);
    });
  };

  const downloadPDF = async () => {
    if (!demoReport) return;

    startTransition(async () => {
      const blob = await pdf(<ReportPDF report={demoReport} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${demoReport.reportNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const downloadDOCX = async () => {
    if (!demoReport) return;

    startTransition(async () => {
      const blob = await generateReportDocx(demoReport);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${demoReport.reportNumber}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">T&C Report Block</h2>
          <p className="text-muted-foreground">
            Electrical Testing & Commissioning Reports for 33kV/13.8kV Substations
          </p>
        </div>
        <Badge variant="secondary">Demo Mode</Badge>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Demo Report</CardTitle>
          <CardDescription>
            Select a report type and generate a sample report with random values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as ReportType)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={generateDemoReport} disabled={isPending}>
              {isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Generate Random Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Preview */}
      {demoReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{demoReport.reportNumber}</CardTitle>
                <CardDescription>
                  {REPORT_TYPE_LABELS[demoReport.reportType]} |{" "}
                  {demoReport.header.projectName}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPDF}
                  disabled={isPending}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadDOCX}
                  disabled={isPending}
                >
                  <FileIcon className="mr-2 h-4 w-4" />
                  DOCX
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Project Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Project Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Project:</dt>
                    <dd className="font-medium">{demoReport.header.projectName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Substation:</dt>
                    <dd className="font-medium">{demoReport.header.substationName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Voltage Level:</dt>
                    <dd className="font-medium">
                      {VOLTAGE_LEVELS[demoReport.header.voltageLevel].label}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location:</dt>
                    <dd className="font-medium">
                      {demoReport.header.location || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Test Date:</dt>
                    <dd className="font-medium">
                      {demoReport.header.testDate.toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Equipment Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Equipment Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tag:</dt>
                    <dd className="font-medium">{demoReport.equipment.equipmentTag}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type:</dt>
                    <dd className="font-medium">{demoReport.equipment.equipmentType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Manufacturer:</dt>
                    <dd className="font-medium">
                      {demoReport.equipment.manufacturer || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Model:</dt>
                    <dd className="font-medium">{demoReport.equipment.model || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tested By:</dt>
                    <dd className="font-medium">{demoReport.header.testedBy}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Test Results Summary */}
            {"testResults" in demoReport.testData &&
              Array.isArray(demoReport.testData.testResults) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-3">
                    Test Results Summary
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Test</th>
                          <th className="text-right py-2 font-medium">Setting</th>
                          <th className="text-right py-2 font-medium">Measured</th>
                          <th className="text-right py-2 font-medium">Dev %</th>
                          <th className="text-center py-2 font-medium">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoReport.testData.testResults.map((result, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2">{result.testName}</td>
                            <td className="text-right py-2">
                              {result.settingValue.toFixed(3)}
                            </td>
                            <td className="text-right py-2">
                              {result.measuredValue.toFixed(3)}
                            </td>
                            <td className="text-right py-2">
                              {result.deviation.toFixed(2)}%
                            </td>
                            <td className="text-center py-2">
                              <Badge
                                variant={
                                  result.result === "PASS" ? "default" : "destructive"
                                }
                                className="text-xs"
                              >
                                {result.result}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Report Types Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-colors ${
              selectedType === key ? "border-primary" : ""
            }`}
            onClick={() => setSelectedType(key as ReportType)}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium text-sm">{label}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>T&C Report Block</strong> generates professional testing and
              commissioning reports for electrical substations in Saudi Arabia.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                5 report types: Protection Relay, Transformer, Switchgear, Cable,
                Grounding
              </li>
              <li>
                Dual output formats: PDF (for distribution) and DOCX (for editing)
              </li>
              <li>IEC/IEEE compliant test values and tolerances</li>
              <li>Clean print-friendly layout with light borders</li>
              <li>Random value generation for demo and testing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
