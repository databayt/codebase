"use client";
import { type FC, useState } from "react";
import { AILogoIcon, AIBrainIcon } from "@/components/atom/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const ModelPicker: FC = () => {
  const [selectedModel, setSelectedModel] = useState<'groq' | 'claude'>('groq');

  // Handle model change
  const handleModelChange = (value: 'groq' | 'claude') => {
    setSelectedModel(value);

    // Store selected model in localStorage for the runtime to use
    if (typeof window !== 'undefined') {
      const modelValue = value === 'groq' ? 'llama-3.3-70b-versatile' : 'claude-3-5-sonnet-20241022';
      localStorage.setItem('selectedModel', modelValue);
      // Dispatch custom event to notify runtime
      window.dispatchEvent(new Event('modelChanged'));
    }
  };

  return (
    <Select value={selectedModel} onValueChange={(value) => handleModelChange(value as 'groq' | 'claude')}>
      <SelectTrigger
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent h-8 gap-1.5 rounded-full px-2.5 text-muted-foreground hover:text-foreground w-auto min-w-[100px]"
        size="sm"
      >
        <div className="flex items-center gap-1.5">
          {selectedModel === 'groq' ? (
            <>
              <AILogoIcon className="h-4 w-4" />
              <span>Groq</span>
            </>
          ) : (
            <>
              <AIBrainIcon className="h-4 w-4" />
              <span>Claude</span>
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="groq">
          <div className="flex items-center gap-2">
            <AILogoIcon className="h-4 w-4" />
            <span>Groq</span>
          </div>
        </SelectItem>
        <SelectItem value="claude">
          <div className="flex items-center gap-2">
            <AIBrainIcon className="h-4 w-4" />
            <span>Claude</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};