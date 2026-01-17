"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import type {
  ReportType,
  ReportStatus,
  VoltageLevel,
  Report,
  TestData,
} from "./types";

// Types matching Prisma enums
type PrismaReportType =
  | "PROTECTION_RELAY"
  | "TRANSFORMER"
  | "SWITCHGEAR"
  | "CABLE"
  | "GROUNDING";
type PrismaReportStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
type PrismaVoltageLevel = "KV_33" | "KV_13_8";

export interface TcReportWithData {
  id: string;
  reportNumber: string;
  reportType: PrismaReportType;
  status: PrismaReportStatus;
  projectName: string;
  projectNumber: string | null;
  substationName: string;
  voltageLevel: PrismaVoltageLevel;
  location: string | null;
  testDate: Date;
  reportDate: Date;
  equipmentTag: string;
  equipmentType: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  testedBy: string;
  reviewedBy: string | null;
  approvedBy: string | null;
  testData: unknown;
  testResults: unknown;
  ambientTemp: number | null;
  humidity: number | null;
  notes: string | null;
  recommendations: string | null;
  revisionNumber: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateReportInput {
  reportNumber: string;
  reportType: ReportType;
  projectName: string;
  projectNumber?: string;
  substationName: string;
  voltageLevel: VoltageLevel;
  location?: string;
  testDate: Date;
  equipmentTag: string;
  equipmentType: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  testedBy: string;
  reviewedBy?: string;
  ambientTemp?: number;
  humidity?: number;
  testData: TestData;
  notes?: string;
  recommendations?: string;
}

// Get all reports for current user
export async function getReports(page: number = 1, pageSize: number = 10) {
  const user = await currentUser();
  if (!user?.id) {
    return { reports: [], total: 0, totalPages: 0 };
  }

  const [reports, total] = await Promise.all([
    db.tcReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.tcReport.count({ where: { userId: user.id } }),
  ]);

  return {
    reports: reports as TcReportWithData[],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Get reports by type
export async function getReportsByType(
  reportType: ReportType,
  page: number = 1,
  pageSize: number = 10
) {
  const user = await currentUser();
  if (!user?.id) {
    return { reports: [], total: 0, totalPages: 0 };
  }

  const [reports, total] = await Promise.all([
    db.tcReport.findMany({
      where: { userId: user.id, reportType },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.tcReport.count({ where: { userId: user.id, reportType } }),
  ]);

  return {
    reports: reports as TcReportWithData[],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Get single report by ID
export async function getReportById(
  id: string
): Promise<TcReportWithData | null> {
  const user = await currentUser();
  if (!user?.id) return null;

  const report = await db.tcReport.findFirst({
    where: { id, userId: user.id },
  });

  return report as TcReportWithData | null;
}

// Create new report
export async function createReport(input: CreateReportInput) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Extract test results summary from test data
  const testResults = extractTestResults(input.testData);

  try {
    const report = await db.tcReport.create({
      data: {
        reportNumber: input.reportNumber,
        reportType: input.reportType,
        status: "DRAFT",
        projectName: input.projectName,
        projectNumber: input.projectNumber,
        substationName: input.substationName,
        voltageLevel: input.voltageLevel,
        location: input.location,
        testDate: input.testDate,
        equipmentTag: input.equipmentTag,
        equipmentType: input.equipmentType,
        manufacturer: input.manufacturer,
        model: input.model,
        serialNumber: input.serialNumber,
        testedBy: input.testedBy,
        reviewedBy: input.reviewedBy,
        ambientTemp: input.ambientTemp,
        humidity: input.humidity,
        testData: input.testData as object,
        testResults: testResults as object,
        notes: input.notes,
        recommendations: input.recommendations,
        userId: user.id,
      },
    });

    revalidatePath("/blocks/report");
    return { success: true, report };
  } catch (error) {
    console.error("Error creating report:", error);
    return { success: false, error: "Failed to create report" };
  }
}

// Update report
export async function updateReport(id: string, input: CreateReportInput) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const existing = await db.tcReport.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { success: false, error: "Report not found" };
  }

  const testResults = extractTestResults(input.testData);

  try {
    const report = await db.tcReport.update({
      where: { id },
      data: {
        reportNumber: input.reportNumber,
        reportType: input.reportType,
        projectName: input.projectName,
        projectNumber: input.projectNumber,
        substationName: input.substationName,
        voltageLevel: input.voltageLevel,
        location: input.location,
        testDate: input.testDate,
        equipmentTag: input.equipmentTag,
        equipmentType: input.equipmentType,
        manufacturer: input.manufacturer,
        model: input.model,
        serialNumber: input.serialNumber,
        testedBy: input.testedBy,
        reviewedBy: input.reviewedBy,
        ambientTemp: input.ambientTemp,
        humidity: input.humidity,
        testData: input.testData as object,
        testResults: testResults as object,
        notes: input.notes,
        recommendations: input.recommendations,
        revisionNumber: existing.revisionNumber + 1,
      },
    });

    revalidatePath("/blocks/report");
    revalidatePath(`/blocks/report/edit/${id}`);
    return { success: true, report };
  } catch (error) {
    console.error("Error updating report:", error);
    return { success: false, error: "Failed to update report" };
  }
}

// Update report status
export async function updateReportStatus(id: string, status: ReportStatus) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updateData: { status: PrismaReportStatus; approvedBy?: string } = {
      status,
    };

    // Set approvedBy when approved
    if (status === "APPROVED") {
      updateData.approvedBy = user.name || user.email || user.id;
    }

    await db.tcReport.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    revalidatePath("/blocks/report");
    return { success: true };
  } catch (error) {
    console.error("Error updating report status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// Delete report
export async function deleteReport(id: string) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.tcReport.delete({
      where: { id, userId: user.id },
    });

    revalidatePath("/blocks/report");
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { success: false, error: "Failed to delete report" };
  }
}

// Get report statistics
export async function getReportStats() {
  const user = await currentUser();
  if (!user?.id) {
    return {
      total: 0,
      draft: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      byType: {} as Record<ReportType, number>,
    };
  }

  const [total, draft, pendingReview, approved, rejected, byType] =
    await Promise.all([
      db.tcReport.count({ where: { userId: user.id } }),
      db.tcReport.count({ where: { userId: user.id, status: "DRAFT" } }),
      db.tcReport.count({
        where: { userId: user.id, status: "PENDING_REVIEW" },
      }),
      db.tcReport.count({ where: { userId: user.id, status: "APPROVED" } }),
      db.tcReport.count({ where: { userId: user.id, status: "REJECTED" } }),
      db.tcReport.groupBy({
        by: ["reportType"],
        where: { userId: user.id },
        _count: { reportType: true },
      }),
    ]);

  const byTypeMap = byType.reduce(
    (acc, item) => {
      acc[item.reportType as ReportType] = item._count.reportType;
      return acc;
    },
    {} as Record<ReportType, number>
  );

  return {
    total,
    draft,
    pendingReview,
    approved,
    rejected,
    byType: byTypeMap,
  };
}

// Helper: Extract test results summary
function extractTestResults(testData: TestData) {
  if ("testResults" in testData && Array.isArray(testData.testResults)) {
    const results = testData.testResults;
    const passed = results.filter((r) => r.result === "PASS").length;
    const failed = results.filter((r) => r.result === "FAIL").length;
    return {
      totalTests: results.length,
      passed,
      failed,
      passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
      overallResult: failed === 0 ? "PASS" : "FAIL",
    };
  }
  return { totalTests: 0, passed: 0, failed: 0, passRate: 0, overallResult: "N/A" };
}

// Convert database report to UI Report type
export function dbReportToReport(dbReport: TcReportWithData): Report {
  return {
    id: dbReport.id,
    reportNumber: dbReport.reportNumber,
    reportType: dbReport.reportType as ReportType,
    status: dbReport.status as ReportStatus,
    header: {
      reportNumber: dbReport.reportNumber,
      projectName: dbReport.projectName,
      projectNumber: dbReport.projectNumber || undefined,
      substationName: dbReport.substationName,
      voltageLevel: dbReport.voltageLevel as VoltageLevel,
      location: dbReport.location || undefined,
      testDate: dbReport.testDate,
      reportDate: dbReport.reportDate,
      testedBy: dbReport.testedBy,
      reviewedBy: dbReport.reviewedBy || undefined,
      approvedBy: dbReport.approvedBy || undefined,
      revisionNumber: dbReport.revisionNumber,
    },
    equipment: {
      equipmentTag: dbReport.equipmentTag,
      equipmentType: dbReport.equipmentType,
      manufacturer: dbReport.manufacturer || undefined,
      model: dbReport.model || undefined,
      serialNumber: dbReport.serialNumber || undefined,
    },
    environmental: {
      ambientTemp: dbReport.ambientTemp || undefined,
      humidity: dbReport.humidity || undefined,
    },
    testData: dbReport.testData as TestData,
    notes: dbReport.notes || undefined,
    recommendations: dbReport.recommendations || undefined,
    createdAt: dbReport.createdAt,
    updatedAt: dbReport.updatedAt,
    userId: dbReport.userId,
  };
}
