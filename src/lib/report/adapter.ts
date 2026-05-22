/**
 * Codebase-specific adapter for the shared report pipeline.
 *
 * Codebase is a low-traffic pattern/registry site. It has NextAuth (contributors)
 * but NO Upstash Redis — so this adapter is STORAGE-LESS: rate-limit, dedup,
 * corroboration, and ban checks all no-op gracefully. The pipeline tolerates
 * this (rate-limit never throws, dedup/corroboration return empty). If spam
 * ever appears, add @upstash/redis + a getRedis() and fill these in.
 *
 * Canonical source of the report module — see ./README.md. Each consuming repo
 * (hogwarts, kun, mkan) ships its own adapter.ts with its auth + storage.
 */

import { createHash } from "crypto";
import { headers } from "next/headers";

import { auth } from "@/auth";

import { type ReportAdapter } from "./adapters/adapter";
import type { PipelineEvent, ReporterContext, ReportInput } from "./types";

const REPO = process.env.GITHUB_REPO || "databayt/codebase";
const SALT = process.env.REPORT_IP_SALT || "codebase-default-salt";

async function getIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    return h.get("x-real-ip") || "0.0.0.0";
  } catch {
    return "0.0.0.0";
  }
}

function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${SALT}`).digest("hex").slice(0, 16);
}

export const codebaseReportAdapter: ReportAdapter = {
  repo: REPO,
  hostAllowlist: [
    "base.databayt.org",
    "codebase.databayt.org",
    "databayt.org",
    "*.databayt.org",
    "localhost",
    "127.0.0.1",
  ],

  async getReporter(_input: ReportInput): Promise<ReporterContext> {
    const ipHash = hashIp(await getIp());
    const session = await auth().catch(() => null);
    if (session?.user?.id) {
      return {
        kind: "authenticated",
        userId: session.user.id,
        role: (session.user.role as string) || "DEVELOPER",
        emailVerified: true,
        accountAgeDays: 365,
        isSuspended: false,
        ipHash,
      };
    }
    return { kind: "anonymous", ipHash };
  },

  // Storage-less: no Redis on codebase. These all no-op safely.
  async checkRateLimit(): Promise<void> {
    /* no rate-limit store; rely on Turnstile (when configured) + scoring */
  },
  async getRecentSelfSubmissions(): Promise<string[]> {
    return [];
  },
  async getCorroborationCount(): Promise<number> {
    return 0;
  },
  async isBanned(): Promise<boolean> {
    return false;
  },
  async recordPipelineEvent(event: PipelineEvent): Promise<void> {
    console.info("[report]", JSON.stringify(event));
  },
  async findExistingForUrl(): Promise<{ issueNumber: number } | null> {
    return null;
  },
};
