"use client"

import * as React from "react"
import { useMemo } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ArrowUpIcon,
  AtSignIcon,
  ChevronDownIcon,
  FileIcon,
  PaperclipIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"

const SAMPLE_PAGES = [
  { id: "1", title: "Getting Started", icon: FileIcon },
  { id: "2", title: "Project Overview", icon: FileIcon },
  { id: "3", title: "API Documentation", icon: FileIcon },
  { id: "4", title: "Design System", icon: FileIcon },
  { id: "5", title: "Component Library", icon: FileIcon },
]

const SAMPLE_USERS = [
  { id: "1", name: "shadcn", avatar: "https://github.com/shadcn.png" },
  { id: "2", name: "maxleiter", avatar: "https://github.com/maxleiter.png" },
  { id: "3", name: "evilrabbit", avatar: "https://github.com/evilrabbit.png" },
]

const MODELS = [
  { id: "auto", name: "Auto" },
  { id: "agent", name: "Agent Mode" },
  { id: "plan", name: "Plan Mode" },
]

export function NotionPromptForm() {
  const [mentions, setMentions] = React.useState<
    Array<{ type: "page" | "user"; id: string }>
  >([])
  const [mentionOpen, setMentionOpen] = React.useState(false)
  const [modelOpen, setModelOpen] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState(MODELS[0])

  const availablePages = useMemo(() => {
    const mentionedPageIds = mentions
      .filter((m) => m.type === "page")
      .map((m) => m.id)
    return SAMPLE_PAGES.filter((p) => !mentionedPageIds.includes(p.id))
  }, [mentions])

  const availableUsers = useMemo(() => {
    const mentionedUserIds = mentions
      .filter((m) => m.type === "user")
      .map((m) => m.id)
    return SAMPLE_USERS.filter((u) => !mentionedUserIds.includes(u.id))
  }, [mentions])

  const removeMention = (type: "page" | "user", id: string) => {
    setMentions((prev) =>
      prev.filter((m) => !(m.type === type && m.id === id))
    )
  }

  return (
    <div className="w-full max-w-md">
      <InputGroup>
        <InputGroupTextarea placeholder="Ask AI anything..." rows={3} />
        <InputGroupAddon align="block-start">
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {mentions.map((mention) => {
                if (mention.type === "page") {
                  const page = SAMPLE_PAGES.find((p) => p.id === mention.id)
                  if (!page) return null
                  return (
                    <Badge
                      key={`page-${mention.id}`}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <page.icon className="size-3" />
                      {page.title}
                      <button
                        onClick={() => removeMention("page", mention.id)}
                        className="hover:bg-muted rounded-sm p-0.5"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  )
                }
                if (mention.type === "user") {
                  const user = SAMPLE_USERS.find((u) => u.id === mention.id)
                  if (!user) return null
                  return (
                    <Badge
                      key={`user-${mention.id}`}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <Avatar className="size-4">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      @{user.name}
                      <button
                        onClick={() => removeMention("user", mention.id)}
                        className="hover:bg-muted rounded-sm p-0.5"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  )
                }
                return null
              })}
            </div>
          )}
        </InputGroupAddon>
        <InputGroupAddon align="block-end">
          <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <InputGroupButton
                    variant="outline"
                    className="rounded-full"
                    size="icon-xs"
                    aria-label="Mention"
                  >
                    <AtSignIcon />
                  </InputGroupButton>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Add mention</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-64 p-0" align="start" side="top">
              <Command>
                <CommandInput placeholder="Search pages or users..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {availablePages.length > 0 && (
                    <CommandGroup heading="Pages">
                      {availablePages.map((page) => (
                        <CommandItem
                          key={page.id}
                          onSelect={() => {
                            setMentions((prev) => [
                              ...prev,
                              { type: "page", id: page.id },
                            ])
                            setMentionOpen(false)
                          }}
                        >
                          <page.icon className="mr-2 size-4" />
                          {page.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {availableUsers.length > 0 && (
                    <CommandGroup heading="Users">
                      {availableUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            setMentions((prev) => [
                              ...prev,
                              { type: "user", id: user.id },
                            ])
                            setMentionOpen(false)
                          }}
                        >
                          <Avatar className="mr-2 size-4">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          @{user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                aria-label="Attach file"
              >
                <PaperclipIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
          <DropdownMenu open={modelOpen} onOpenChange={setModelOpen}>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="ml-auto gap-1">
                <SparklesIcon className="size-3" />
                {selectedModel.name}
                <ChevronDownIcon className="size-3" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end">
              {MODELS.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onSelect={() => {
                    setSelectedModel(model)
                    setModelOpen(false)
                  }}
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
