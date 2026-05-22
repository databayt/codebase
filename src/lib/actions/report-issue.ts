"use server";

/**
 * Report-issue server action — thin wrapper around the shared pipeline.
 *
 * All quality gating (Zod, hard filters, captcha, dedup, AI triage, scoring)
 * lives in runReportPipeline. The client receives a symmetric success shape so
 * spammers can't probe the filter.
 */

import { headers } from "next/headers";

import { runReportPipeline } from "@/lib/report";
import { codebaseReportAdapter } from "@/lib/report/adapter";

import type {
  ReportIssueSubmitInput,
  ReportIssueSubmitResult,
} from "@/components/report-issue";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    return h.get("x-real-ip") || "0.0.0.0";
  } catch {
    return "0.0.0.0";
  }
}

export async function reportIssue(
  data: ReportIssueSubmitInput
): Promise<ReportIssueSubmitResult> {
  const ip = await clientIp();
  const result = await runReportPipeline(
    {
      description: data.description,
      pageUrl: data.pageUrl,
      category: data.category,
      reproSteps: data.reproSteps,
      expected: data.expected,
      actual: data.actual,
      severityHint: data.severityHint,
      viewport: data.viewport,
      direction: data.direction,
      browser: data.browser,
      hasScreenshot: data.hasScreenshot,
      captchaToken: data.captchaToken,
    },
    codebaseReportAdapter,
    { ip }
  );

  if (result.ok && result.bucket === "verified-report" && result.issueNumber) {
    return { ok: true, issueNumber: result.issueNumber };
  }
  if (result.ok) return { ok: true };
  return { ok: false };
}
