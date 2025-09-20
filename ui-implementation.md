# AI Sales Agent - ShadCN UI Implementation Guide

## Executive Summary

This guide provides comprehensive implementation patterns for building beautiful, accessible AI-powered interfaces using ShadCN UI components in the Next.js 15 codebase. It follows atomic design principles, supports RTL/LTR layouts, and leverages the OKLCH color system for theme-aware components.

## Core Design Principles

### 1. Atomic Design Structure
```
src/components/
├── atom/ai/                    # Atomic AI components
│   ├── ai-prompt-input.tsx     # Base input with suggestions
│   ├── ai-streaming-text.tsx   # Real-time text streaming
│   ├── ai-status-indicator.tsx # Processing states
│   └── ai-progress-ring.tsx    # Circular progress
├── molecule/ai/                 # Composed AI components
│   ├── ai-chat-message.tsx     # Message bubble with metadata
│   ├── ai-model-selector.tsx   # Provider/model selection
│   └── ai-tool-invocation.tsx  # Tool call visualization
└── organism/ai/                 # Complex AI interfaces
    ├── ai-chat-interface.tsx    # Complete chat system
    ├── ai-proposal-editor.tsx   # Proposal generation UI
    └── ai-analytics-dashboard.tsx # Metrics visualization
```

### 2. Theme System Integration
All AI components use CSS variables in OKLCH format for consistent theming:
```css
--ai-primary: oklch(0.6 0.2 270);      /* AI brand color */
--ai-streaming: oklch(0.7 0.15 200);   /* Streaming indicator */
--ai-success: oklch(0.65 0.2 150);     /* Success states */
--ai-processing: oklch(0.6 0.1 60);    /* Processing states */
```

## AI Component Library

### 1. AiPromptInput Component
**Purpose**: Advanced input field with AI-powered suggestions and templates

```tsx
"use client";
import { useState, useCallback } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, Hash } from "lucide-react";

interface AiPromptInputProps {
  onSubmit: (prompt: string, metadata?: Record<string, any>) => void;
  suggestions?: string[];
  templates?: { label: string; prompt: string; category?: string }[];
  placeholder?: string;
  className?: string;
  locale?: "en" | "ar";
}

export function AiPromptInput({
  onSubmit,
  suggestions = [],
  templates = [],
  placeholder = "Ask AI anything...",
  className,
  locale = "en"
}: AiPromptInputProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = locale === "ar";

  return (
    <div className={cn(
      "relative w-full",
      isRTL && "rtl",
      className
    )}>
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Sparkles className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none"
          />
          <Button
            onClick={() => onSubmit(value)}
            size="sm"
            className="ml-2"
            disabled={!value.trim()}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {isOpen && (
          <CommandList className="max-h-[300px] overflow-y-auto p-2">
            {templates.map((template) => (
              <CommandItem
                key={template.label}
                onSelect={() => {
                  setValue(template.prompt);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm">{template.label}</span>
                {template.category && (
                  <Badge variant="secondary" className="ml-2">
                    {template.category}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setValue(suggestion)}
              className="text-xs"
            >
              <Hash className="mr-1 h-3 w-3" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. AiStreamingText Component
**Purpose**: Display AI-generated text with real-time streaming effect

```tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface AiStreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
  showCursor?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export function AiStreamingText({
  text,
  isStreaming,
  className,
  showCursor = true,
  speed = 30,
  onComplete
}: AiStreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isStreaming && text) {
      // Instant display when not streaming
      setDisplayedText(text);
      onComplete?.();
      return;
    }

    if (isStreaming && text.length > indexRef.current) {
      setIsTyping(true);
      const timer = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.substring(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(timer);
    }
  }, [text, isStreaming, speed, onComplete]);

  return (
    <div className={cn("relative", className)}>
      {isStreaming && displayedText.length === 0 && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="prose prose-sm dark:prose-invert max-w-none"
        >
          {displayedText}
          {showCursor && (isTyping || isStreaming) && (
            <span className="inline-block w-1 h-4 ml-1 bg-primary animate-blink" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### 3. AiObjectGenerator Component
**Purpose**: Generate and display structured data with loading states

```tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiObjectGeneratorProps<T> {
  generator: () => Promise<T>;
  onComplete: (data: T) => void;
  onError?: (error: Error) => void;
  schema?: Record<string, any>;
  className?: string;
  title?: string;
  showProgress?: boolean;
}

export function AiObjectGenerator<T extends Record<string, any>>({
  generator,
  onComplete,
  onError,
  schema,
  className,
  title = "Generating Data",
  showProgress = true
}: AiObjectGeneratorProps<T>) {
  const [status, setStatus] = useState<"idle" | "generating" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<Partial<T>>({});
  const [error, setError] = useState<string>("");

  const generate = async () => {
    setStatus("generating");
    setProgress(0);

    // Simulate progressive generation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await generator();
      clearInterval(progressInterval);
      setProgress(100);
      setData(result);
      setStatus("complete");
      onComplete(result);
    } catch (err) {
      clearInterval(progressInterval);
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Generation failed";
      setError(errorMessage);
      onError?.(err as Error);
    }
  };

  useEffect(() => {
    if (status === "idle") {
      generate();
    }
  }, []);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            {status === "generating" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {status === "complete" && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {status === "error" && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <Badge variant={
              status === "complete" ? "default" :
              status === "error" ? "destructive" :
              "secondary"
            }>
              {status}
            </Badge>
          </div>
        </div>

        {showProgress && status === "generating" && (
          <Progress value={progress} className="mt-2 h-2" />
        )}
      </CardHeader>

      <CardContent>
        {status === "generating" && (
          <div className="space-y-3">
            {schema && Object.keys(schema).map((key) => (
              <div key={key} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {key}
                </div>
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
            {!schema && (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </>
            )}
          </div>
        )}

        {status === "complete" && data && (
          <div className="space-y-3">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {key}
                </div>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {JSON.stringify(value, null, 2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. AiChatInterface Component
**Purpose**: Complete chat interface with message history and streaming responses

```tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AiPromptInput } from "./ai-prompt-input";
import { AiStreamingText } from "./ai-streaming-text";
import { Badge } from "@/components/ui/badge";
import { Bot, User, RefreshCw, Download, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  isStreaming?: boolean;
}

interface AiChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  initialMessages?: Message[];
  className?: string;
  height?: string;
  showTimestamp?: boolean;
  enableExport?: boolean;
  locale?: "en" | "ar";
}

export function AiChatInterface({
  onSendMessage,
  initialMessages = [],
  className,
  height = "600px",
  showTimestamp = true,
  enableExport = true,
  locale = "en"
}: AiChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await onSendMessage(content);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: response, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const exportChat = () => {
    const chatData = JSON.stringify(messages, null, 2);
    const blob = new Blob([chatData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  return (
    <Card className={cn("flex flex-col", className)} style={{ height }}>
      <CardHeader className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Assistant</h3>
            <Badge variant="outline" className="ml-2">
              {messages.length} messages
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMessages([])}
              disabled={messages.length === 0}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {enableExport && (
              <Button
                variant="ghost"
                size="icon"
                onClick={exportChat}
                disabled={messages.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea ref={scrollRef} className="h-full px-6 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "mb-4 flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[80%] gap-3",
                    message.role === "user" && "flex-row-reverse",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.isStreaming ? (
                        <AiStreamingText
                          text={message.content}
                          isStreaming={true}
                          showCursor={true}
                        />
                      ) : (
                        <div className="text-sm">{message.content}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-1">
                      {showTimestamp && (
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      )}
                      {message.role === "assistant" && !message.isStreaming && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-4 w-4 animate-pulse" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <AiPromptInput
          onSubmit={handleSendMessage}
          placeholder="Type your message..."
          className="w-full"
          locale={locale}
          suggestions={[
            "Help me write a proposal",
            "Analyze this job posting",
            "Generate email template"
          ]}
        />
      </CardFooter>
    </Card>
  );
}
```

### 5. AiModelSelector Component
**Purpose**: Provider and model selection with cost indicators

```tsx
"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Model {
  id: string;
  name: string;
  provider: string;
  costPer1k: number;
  speed: "fast" | "medium" | "slow";
  quality: "high" | "medium" | "low";
  maxTokens: number;
}

interface AiModelSelectorProps {
  models: Model[];
  value?: string;
  onChange: (modelId: string) => void;
  className?: string;
  showCost?: boolean;
  showSpecs?: boolean;
}

export function AiModelSelector({
  models,
  value,
  onChange,
  className,
  showCost = true,
  showSpecs = true
}: AiModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    models.find((m) => m.id === value)
  );

  const handleChange = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    setSelectedModel(model);
    onChange(modelId);
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "slow": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "high": return "bg-green-500/10 text-green-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "low": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        <Label htmlFor="model-select">AI Model</Label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger id="model-select" className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {model.provider}
                    </Badge>
                  </div>
                  {showCost && (
                    <span className="text-xs text-muted-foreground ml-4">
                      ${model.costPer1k}/1k
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showSpecs && selectedModel && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Provider:</span>
              <Badge variant="secondary">{selectedModel.provider}</Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Speed:</span>
              <span className={getSpeedColor(selectedModel.speed)}>
                {selectedModel.speed}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quality:</span>
              <Badge className={getQualityColor(selectedModel.quality)}>
                {selectedModel.quality}
              </Badge>
            </div>

            {showCost && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost:</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">${selectedModel.costPer1k}</span>
                  <span className="text-muted-foreground">/1k tokens</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Estimated cost per 1,000 tokens
                          <br />
                          Max tokens: {selectedModel.maxTokens.toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Implementation Patterns

### 1. Loading States & Skeletons
```tsx
// Consistent skeleton patterns for AI components
export const AiLoadingStates = {
  // Text generation skeleton
  TextSkeleton: () => (
    <div className="space-y-2 animate-pulse">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  ),

  // Data generation skeleton
  DataSkeleton: () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  ),

  // Card skeleton for AI results
  CardSkeleton: () => (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
};
```

### 2. Status Indicators
```tsx
// Reusable AI status components
export const AiStatusIndicators = {
  Processing: ({ text = "Processing..." }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  ),

  StreamingIndicator: () => (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
      <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-75" />
      <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150" />
    </div>
  ),

  ProgressRing: ({ progress, size = 40 }) => (
    <svg className="transform -rotate-90" width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size - 4) / 2}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size - 4) / 2}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeDasharray={`${2 * Math.PI * ((size - 4) / 2)}`}
        strokeDashoffset={`${2 * Math.PI * ((size - 4) / 2) * (1 - progress / 100)}`}
        className="text-primary transition-all duration-300 ease-in-out"
      />
    </svg>
  )
};
```

### 3. Responsive AI Layouts
```tsx
// Responsive grid for AI blocks
export function AiBlockGrid({ children, columns = { sm: 1, md: 2, lg: 3 } }) {
  return (
    <div className={cn(
      "grid gap-4",
      `grid-cols-${columns.sm}`,
      `md:grid-cols-${columns.md}`,
      `lg:grid-cols-${columns.lg}`,
      "layout-container" // Use existing container system
    )}>
      {children}
    </div>
  );
}

// AI dashboard layout with sidebar
export function AiDashboardLayout({ sidebar, main }) {
  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-sidebar">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="layout-container py-6">
          {main}
        </div>
      </main>
    </div>
  );
}
```

### 4. Accessibility Patterns
```tsx
// Accessible AI component patterns
export const AccessibilityPatterns = {
  // Screen reader announcements for AI updates
  AiAnnouncement: ({ message, priority = "polite" }) => (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  ),

  // Loading state with ARIA
  LoadingState: ({ label }) => (
    <div
      role="status"
      aria-label={label}
      className="flex items-center gap-2"
    >
      <Spinner className="animate-spin" />
      <span aria-hidden="true">{label}</span>
    </div>
  ),

  // Keyboard navigation for AI suggestions
  useFocusTrap: (containerRef) => {
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          // Close suggestions
        } else if (e.key === "ArrowDown") {
          // Navigate down
        } else if (e.key === "ArrowUp") {
          // Navigate up
        }
      };

      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }, [containerRef]);
  }
};
```

### 5. Theme-Aware Components
```tsx
// OKLCH color system integration
export const AiThemeVariables = {
  light: {
    "--ai-primary": "oklch(0.6 0.2 270)",
    "--ai-secondary": "oklch(0.7 0.15 200)",
    "--ai-success": "oklch(0.65 0.2 150)",
    "--ai-warning": "oklch(0.7 0.25 60)",
    "--ai-error": "oklch(0.6 0.25 25)",
    "--ai-surface": "oklch(0.98 0 0)",
    "--ai-surface-hover": "oklch(0.96 0 0)",
    "--ai-text": "oklch(0.2 0 0)",
    "--ai-text-muted": "oklch(0.5 0 0)"
  },
  dark: {
    "--ai-primary": "oklch(0.7 0.2 270)",
    "--ai-secondary": "oklch(0.6 0.15 200)",
    "--ai-success": "oklch(0.55 0.2 150)",
    "--ai-warning": "oklch(0.6 0.25 60)",
    "--ai-error": "oklch(0.5 0.25 25)",
    "--ai-surface": "oklch(0.15 0 0)",
    "--ai-surface-hover": "oklch(0.2 0 0)",
    "--ai-text": "oklch(0.95 0 0)",
    "--ai-text-muted": "oklch(0.65 0 0)"
  }
};
```

### 6. RTL Support
```tsx
// RTL-aware AI component wrapper
export function AiComponentWrapper({
  children,
  locale = "en",
  className
}) {
  const isRTL = locale === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "relative",
        isRTL && "text-right",
        className
      )}
    >
      {children}
    </div>
  );
}

// RTL-aware positioning utilities
export const rtlUtils = {
  getAlignment: (locale: string, defaultAlign: string) => {
    if (locale === "ar") {
      return defaultAlign === "left" ? "right" : "left";
    }
    return defaultAlign;
  },

  getMargin: (locale: string, side: string, value: string) => {
    if (locale === "ar") {
      if (side === "left") return { marginRight: value };
      if (side === "right") return { marginLeft: value };
    }
    return { [`margin${side.charAt(0).toUpperCase()}${side.slice(1)}`]: value };
  }
};
```

## Integration Examples

### 1. AI-Powered Lead Generation Form
```tsx
export function LeadGenerationForm() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Generate Leads</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <AiPromptInput
          placeholder="Describe your ideal customer..."
          templates={[
            { label: "B2B SaaS Companies", prompt: "Find B2B SaaS companies with 50-200 employees", category: "Technology" },
            { label: "E-commerce Stores", prompt: "Find e-commerce stores with $1M+ revenue", category: "Retail" },
            { label: "Healthcare Providers", prompt: "Find healthcare providers in major cities", category: "Healthcare" }
          ]}
          onSubmit={async (prompt) => {
            // Handle lead generation
          }}
        />

        <AiObjectGenerator
          title="Extracting Lead Data"
          generator={async () => {
            // AI-powered lead extraction
            return {
              company: "Example Corp",
              contact: "John Doe",
              email: "john@example.com",
              score: 85
            };
          }}
          onComplete={(leads) => {
            // Process generated leads
          }}
          schema={{
            company: "string",
            contact: "string",
            email: "string",
            score: "number"
          }}
        />
      </CardContent>
    </Card>
  );
}
```

### 2. Proposal Writer Interface
```tsx
export function ProposalWriter() {
  const [proposal, setProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Job Details</h3>
        </CardHeader>
        <CardContent>
          <AiPromptInput
            placeholder="Paste job description..."
            className="mb-4"
            onSubmit={async (jobDescription) => {
              setIsGenerating(true);
              // Generate proposal
              const response = await generateProposal(jobDescription);
              setProposal(response);
              setIsGenerating(false);
            }}
          />

          <AiModelSelector
            models={[
              { id: "claude-3.5", name: "Claude 3.5 Sonnet", provider: "Anthropic", costPer1k: 0.003, speed: "medium", quality: "high", maxTokens: 200000 },
              { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", costPer1k: 0.005, speed: "medium", quality: "high", maxTokens: 128000 },
              { id: "groq-llama", name: "Llama 3 70B", provider: "Groq", costPer1k: 0.0007, speed: "fast", quality: "medium", maxTokens: 8192 }
            ]}
            onChange={(modelId) => {
              // Update model selection
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Generated Proposal</h3>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <AiLoadingStates.TextSkeleton />
          ) : (
            <AiStreamingText
              text={proposal}
              isStreaming={isGenerating}
              className="prose prose-sm"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## Best Practices

### 1. Performance Optimization
- Use React.memo for expensive AI components
- Implement virtual scrolling for large chat histories
- Debounce AI API calls for real-time inputs
- Cache AI responses with React Query or SWR

### 2. Error Handling
- Always provide fallback UI for AI failures
- Implement retry logic with exponential backoff
- Show clear error messages with recovery actions
- Log errors for monitoring and debugging

### 3. User Experience
- Show progress indicators for long-running operations
- Provide cancel buttons for AI operations
- Implement undo/redo for AI-generated content
- Save drafts automatically during generation

### 4. Accessibility
- Ensure all AI status updates are announced to screen readers
- Provide keyboard navigation for all interactive elements
- Include descriptive labels and ARIA attributes
- Test with screen readers and keyboard-only navigation

### 5. Internationalization
- Support RTL layouts for Arabic locale
- Translate all UI strings including AI prompts
- Format dates and numbers according to locale
- Test thoroughly in both LTR and RTL modes

## Testing Strategy

### 1. Component Testing
```tsx
// Example test for AiPromptInput
describe("AiPromptInput", () => {
  it("should handle RTL layout for Arabic locale", () => {
    render(<AiPromptInput locale="ar" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("dir", "rtl");
  });

  it("should submit prompt on button click", async () => {
    const onSubmit = jest.fn();
    render(<AiPromptInput onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("Ask AI anything...");
    await userEvent.type(input, "Test prompt");
    await userEvent.click(screen.getByRole("button"));

    expect(onSubmit).toHaveBeenCalledWith("Test prompt");
  });
});
```

### 2. Integration Testing
- Test AI component interactions with API endpoints
- Verify streaming updates work correctly
- Test error recovery and retry mechanisms
- Validate theme switching and persistence

### 3. Accessibility Testing
- Use axe-core for automated accessibility checks
- Test with NVDA/JAWS screen readers
- Verify keyboard navigation paths
- Check color contrast ratios

## Deployment Checklist

- [ ] All AI components support both light/dark themes
- [ ] RTL layout works correctly for Arabic locale
- [ ] Loading states and skeletons are implemented
- [ ] Error boundaries protect against component crashes
- [ ] API rate limiting is configured
- [ ] Cost monitoring is in place for AI API calls
- [ ] Analytics tracking for AI interactions
- [ ] Performance monitoring for streaming responses
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed

## Conclusion

This comprehensive guide provides everything needed to implement beautiful, accessible AI-powered interfaces using ShadCN UI components. The modular architecture, atomic design patterns, and extensive component library enable rapid development of sophisticated AI features while maintaining consistency with the existing design system.

The combination of Vercel AI SDK v5, ShadCN UI components, and the OKLCH color system creates a powerful foundation for building production-ready AI sales agent interfaces that are both beautiful and functional.