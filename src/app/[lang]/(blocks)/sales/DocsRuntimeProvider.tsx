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

  // Update selected model from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedModel');
      if (stored) {
        setSelectedModel(stored);
      }

      // Listen for model changes
      const handleStorageChange = () => {
        const newModel = localStorage.getItem('selectedModel') || 'llama-3.3-70b-versatile';
        setSelectedModel(newModel);
      };

      window.addEventListener('storage', handleStorageChange);
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
      console.error("Chat error:", error);
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
      <WeatherSearchToolUI />
      <GeocodeLocationToolUI />
    </AssistantRuntimeProvider>
  );
}