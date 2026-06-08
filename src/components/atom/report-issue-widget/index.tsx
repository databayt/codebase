"use client"

import { useState } from "react"
import { Bug } from "lucide-react"

import { reportIssue } from "./action"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ReportIssueProps {
  variant?: "text" | "icon"
  labels?: {
    link?: string
    title?: string
    placeholder?: string
    submit?: string
    submitting?: string
    success?: string
    error?: string
  }
}

function parseBrowser(ua: string): string {
  const os = ua.includes("Mac OS")
    ? "macOS"
    : ua.includes("Windows")
    ? "Windows"
    : ua.includes("Android")
    ? "Android"
    : ua.includes("iPhone") || ua.includes("iPad")
    ? "iOS"
    : ua.includes("Linux")
    ? "Linux"
    : "Unknown"
  if (ua.includes("Firefox/")) return `Firefox / ${os}`
  if (ua.includes("Edg/")) return `Edge / ${os}`
  if (ua.includes("Chrome/")) return `Chrome / ${os}`
  if (ua.includes("Safari/")) return `Safari / ${os}`
  return ua.slice(0, 50)
}

export function ReportIssue({ variant = "text", labels }: ReportIssueProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const t = {
    link: labels?.link ?? "Report an issue",
    title: labels?.title ?? "Report an issue",
    placeholder: labels?.placeholder ?? "Describe the issue...",
    submit: labels?.submit ?? "Submit",
    submitting: labels?.submitting ?? "Submitting...",
    success: labels?.success ?? "Submitted. Thank you!",
    error: labels?.error ?? "Something went wrong. Try again.",
  }

  async function handleSubmit() {
    if (!description.trim()) return
    setStatus("loading")
    try {
      await reportIssue({
        description,
        pageUrl: window.location.href,
        meta: {
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          direction: document.documentElement.dir || "ltr",
          browser: parseBrowser(navigator.userAgent),
        },
      })
      setStatus("success")
      setDescription("")
      setTimeout(() => {
        setOpen(false)
        setStatus("idle")
      }, 1500)
    } catch {
      setStatus("error")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setStatus("idle")
      }}
    >
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <button className="cursor-pointer" aria-label={t.link}>
            <Bug className="h-6 w-6" strokeWidth={0.75} />
          </button>
        ) : (
          <button className="cursor-pointer font-medium underline underline-offset-4">
            {t.link}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <textarea
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
          placeholder={t.placeholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {status === "error" && (
          <p className="text-destructive text-sm">{t.error}</p>
        )}
        {status === "success" ? (
          <p className="text-sm text-green-600">{t.success}</p>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!description.trim() || status === "loading"}
          >
            {status === "loading" ? t.submitting : t.submit}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
