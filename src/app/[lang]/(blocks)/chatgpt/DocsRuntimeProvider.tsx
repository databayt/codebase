"use client";
import { WeatherSearchToolUI } from "@/components/chatgpt/weather-tool";
import { GeocodeLocationToolUI } from "@/components/chatgpt/weather-tool";
import {
  AssistantRuntimeProvider,
  WebSpeechSynthesisAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useCurrentUser } from "@/components/auth/use-current-user";
import { useEffect, useState } from "react";

export function DocsRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');

  // Debug logging
  console.log("[DocsRuntimeProvider] Initializing...");
  console.log("[DocsRuntimeProvider] User:", user ? user.name : "anonymous");
  console.log("[DocsRuntimeProvider] API endpoint: /api/chat");

  // Update selected model from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedModel');
      if (stored) {
        setSelectedModel(stored);
        console.log("[DocsRuntimeProvider] Model from localStorage:", stored);
      }

      // Listen for model changes
      const handleStorageChange = () => {
        const newModel = localStorage.getItem('selectedModel') || 'llama-3.3-70b-versatile';
        setSelectedModel(newModel);
        console.log("[DocsRuntimeProvider] Model changed to:", newModel);
      };

      window.addEventListener('storage', handleStorageChange);

      // Also listen for custom event
      window.addEventListener('modelChanged', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('modelChanged', handleStorageChange);
      };
    }
  }, []);

  // Configure runtime to use your API endpoint
  const runtime = useChatRuntime({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onError: (error: any) => {
      console.error("[DocsRuntimeProvider] Runtime error:", error);
    },
  });

  // Store runtime globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && runtime) {
      (window as any).__ASSISTANT_RUNTIME__ = runtime;
      console.log("[DocsRuntimeProvider] Runtime stored globally for debugging");
    }
  }, [runtime]);

  // Debug: Log runtime state changes
  useEffect(() => {
    if (runtime) {
      console.log("[DocsRuntimeProvider] Runtime created successfully");
      console.log("[DocsRuntimeProvider] Runtime type:", runtime.constructor.name);

      // Subscribe to runtime changes if possible
      const unsubscribe = runtime.subscribe?.(() => {
        console.log("[DocsRuntimeProvider] Runtime state changed:", {
          isRunning: runtime.isRunning,
          messages: runtime.messages?.length || 0,
        });
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
      <WeatherSearchToolUI />
      <GeocodeLocationToolUI />
    </AssistantRuntimeProvider>
  );
}