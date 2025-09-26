"use client";
import { type FC, useState } from "react";
import { Claude } from "@/components/atom/icons";
import { Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useThreadRuntime } from "@assistant-ui/react";

// Simplified model options
const models = [
  {
    name: "Groq",
    value: "llama-3.3-70b-versatile",
    icon: Bot, // Using Bot icon for Groq since there's no specific Groq icon
  },
  {
    name: "Claude",
    value: "claude-3-5-sonnet-20241022",
    icon: Claude,
  },
];
export const ModelPicker: FC = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]?.value ?? "");
  const threadRuntime = useThreadRuntime();

  // Handle model change
  const handleModelChange = (value: string) => {
    setSelectedModel(value);

    // Store selected model in localStorage for the runtime to use
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedModel', value);
      // Dispatch custom event to notify runtime
      window.dispatchEvent(new Event('modelChanged'));
    }
  };

  const selectedModelData = models.find(m => m.value === selectedModel);

  return (
    <Select value={selectedModel} onValueChange={handleModelChange}>
      <SelectTrigger className="h-8 w-[100px] rounded-full bg-background border-border hover:bg-blue-100 hover:border-transparent dark:hover:bg-blue-950 transition-colors" size="sm">
        <SelectValue>
          {selectedModelData && (
            <span className="flex items-center gap-1.5">
              <selectedModelData.icon className="size-3.5" />
              <span>{selectedModelData.name}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            <span className="flex items-center gap-2">
              <model.icon className="size-3.5" />
              <span>{model.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
