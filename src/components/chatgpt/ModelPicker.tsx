"use client";
import {} from "@radix-ui/react-select";
import Image from "next/image";
import { type FC, useState, useEffect } from "react";
import anthropic from "./providers/anthropic.svg";
import fireworks from "./providers/fireworks.svg";
import google from "./providers/google.svg";
import deepseek from "./providers/deepseek.svg";
import meta from "./providers/meta.svg";
import mistral from "./providers/mistral.svg";
import openai from "./providers/openai.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useThreadRuntime } from "@assistant-ui/react";

// Groq models (using Meta icon for Llama models)
const groqModels = [
  {
    name: "Llama 3.3 70B",
    value: "llama-3.3-70b-versatile",
    icon: meta,
    provider: "groq",
  },
  {
    name: "Llama 3.2 90B",
    value: "llama-3.2-90b-text-preview",
    icon: meta,
    provider: "groq",
  },
  {
    name: "Mixtral 8x7B",
    value: "mixtral-8x7b-32768",
    icon: mistral,
    provider: "groq",
  },
  {
    name: "Gemma 2 9B",
    value: "gemma2-9b-it",
    icon: google,
    provider: "groq",
  },
];

// Claude models
const claudeModels = [
  {
    name: "Claude 3.5 Sonnet",
    value: "claude-3-5-sonnet-20241022",
    icon: anthropic,
    provider: "claude",
  },
  {
    name: "Claude 3.5 Haiku",
    value: "claude-3-5-haiku-20241022",
    icon: anthropic,
    provider: "claude",
  },
  {
    name: "Claude 3 Opus",
    value: "claude-3-opus-20240229",
    icon: anthropic,
    provider: "claude",
  },
];

// Combine all models
const allModels = [...groqModels, ...claudeModels];
export const ModelPicker: FC = () => {
  const [selectedModel, setSelectedModel] = useState(groqModels[0]?.value ?? "");
  const threadRuntime = useThreadRuntime();

  // Log when model changes
  useEffect(() => {
    console.log("[ModelPicker] Selected model:", selectedModel);
  }, [selectedModel]);

  // Handle model change
  const handleModelChange = (value: string) => {
    console.log("[ModelPicker] Changing model to:", value);
    setSelectedModel(value);

    // Store selected model in localStorage for the runtime to use
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedModel', value);
      console.log("[ModelPicker] Model saved to localStorage:", value);

      // Dispatch custom event to notify runtime
      window.dispatchEvent(new Event('modelChanged'));
    }

    // Notify about model change
    const model = allModels.find(m => m.value === value);
    if (model) {
      console.log(`[ModelPicker] Using ${model.provider} provider:`, model.name);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Select value={selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger className="max-w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Groq Models</div>
          {groqModels.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <Image
                  src={model.icon}
                  alt={model.name}
                  className="inline size-4"
                />
                <span>{model.name}</span>
              </span>
            </SelectItem>
          ))}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">Claude Models</div>
          {claudeModels.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <Image
                  src={model.icon}
                  alt={model.name}
                  className="inline size-4"
                />
                <span>{model.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground px-1">
        {selectedModel && `Model: ${selectedModel}`}
      </div>
    </div>
  );
};
