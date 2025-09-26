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
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent h-8 gap-1.5 rounded-full px-2.5 text-muted-foreground hover:text-foreground w-auto"
          >
            <span>Threads</span>
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