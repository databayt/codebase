"use client";

import { FC, useState } from "react";
import {
  ThreadListPrimitive,
  ThreadListItemPrimitive,
} from "@assistant-ui/react";
import { MessageSquare, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Component for rendering individual thread items
const ThreadItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="w-full">
      <ThreadListItemPrimitive.Trigger asChild>
        <DropdownMenuItem className="cursor-pointer">
          <MessageSquare className="mr-2 size-3.5" />
          <span className="truncate">
            <ThreadListItemPrimitive.Title fallback="New Chat" />
          </span>
        </DropdownMenuItem>
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
};

export const ThreadSelector: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <ThreadListPrimitive.Root>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 rounded-full bg-background border-border hover:bg-blue-100 hover:border-transparent dark:hover:bg-blue-950 transition-colors"
          >
            <MessageSquare className="size-3.5" />
            <span>Threads</span>
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* New Thread Option */}
          <ThreadListPrimitive.New asChild>
            <DropdownMenuItem className="cursor-pointer">
              <Plus className="mr-2 size-3.5" />
              <span>New Thread</span>
            </DropdownMenuItem>
          </ThreadListPrimitive.New>

          <DropdownMenuSeparator />

          {/* Thread List */}
          <div className="max-h-64 overflow-y-auto">
            <ThreadListPrimitive.Items
              components={{
                ThreadListItem: ThreadItem
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThreadListPrimitive.Root>
  );
};