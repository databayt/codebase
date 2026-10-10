"use client"

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/atom/prompt-input"

export default function PromptInputDemo() {
  return (
    <PromptInput className="w-full max-w-lg" onSubmit={() => {}}>
      <PromptInputTextarea placeholder="Ask anything..." />
      <PromptInputToolbar className="justify-end">
        <PromptInputSubmit />
      </PromptInputToolbar>
    </PromptInput>
  )
}
