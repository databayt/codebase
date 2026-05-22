/**
 * Server wrapper for the report-issue dialog. Resolves the session (for the
 * captcha gate) and binds the server action, so callers (footers, layouts)
 * just render <ReportIssueButton /> with no props.
 */

import { auth } from "@/auth";

import { reportIssue } from "@/lib/actions/report-issue";
import { ReportIssue, type ReportIssueProps } from "./report-issue";

export async function ReportIssueButton({
  variant,
}: { variant?: ReportIssueProps["variant"] } = {}) {
  const session = await auth().catch(() => null);
  return (
    <ReportIssue
      variant={variant}
      hasSession={Boolean(session?.user)}
      onSubmit={reportIssue}
      turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      signInHref="/login"
    />
  );
}
