"use client"

import * as React from "react"
import { Send } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Types
export interface ChatMessage {
  id?: string
  role: "user" | "agent" | "system"
  content: string
  timestamp?: Date
}

export interface ChatUser {
  name: string
  email?: string
  avatar?: string
}

// Context
interface ChatContextValue {
  messages: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, "id">) => void
  clearMessages: () => void
  user?: ChatUser
}

const ChatContext = React.createContext<ChatContextValue | null>(null)

export function useChatContext() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a Chat component")
  }
  return context
}

// Root Component
export interface ChatProps extends React.ComponentProps<typeof Card> {
  messages?: ChatMessage[]
  onMessagesChange?: (messages: ChatMessage[]) => void
  user?: ChatUser
  children?: React.ReactNode
}

export function Chat({
  messages: messagesProp,
  onMessagesChange,
  user,
  children,
  className,
  ...props
}: ChatProps) {
  const [internalMessages, setInternalMessages] = React.useState<ChatMessage[]>(
    messagesProp ?? []
  )

  const messages = messagesProp ?? internalMessages

  const addMessage = React.useCallback(
    (message: Omit<ChatMessage, "id">) => {
      const newMessage: ChatMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      }
      if (onMessagesChange) {
        onMessagesChange([...messages, newMessage])
      } else {
        setInternalMessages((prev) => [...prev, newMessage])
      }
    },
    [messages, onMessagesChange]
  )

  const clearMessages = React.useCallback(() => {
    if (onMessagesChange) {
      onMessagesChange([])
    } else {
      setInternalMessages([])
    }
  }, [onMessagesChange])

  const contextValue = React.useMemo<ChatContextValue>(
    () => ({
      messages,
      addMessage,
      clearMessages,
      user,
    }),
    [messages, addMessage, clearMessages, user]
  )

  return (
    <ChatContext.Provider value={contextValue}>
      <Card
        data-slot="chat"
        className={cn("shadow-none border", className)}
        {...props}
      >
        {children}
      </Card>
    </ChatContext.Provider>
  )
}

// Header Component
export interface ChatHeaderProps extends React.ComponentProps<typeof CardHeader> {
  user?: ChatUser
  actions?: React.ReactNode
}

export function ChatHeader({
  user,
  actions,
  children,
  className,
  ...props
}: ChatHeaderProps) {
  return (
    <CardHeader
      data-slot="chat-header"
      className={cn("flex flex-row items-center", className)}
      {...props}
    >
      {user ? (
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{user.name}</p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
      ) : (
        children
      )}
      {actions && <div className="ml-auto">{actions}</div>}
    </CardHeader>
  )
}

// Messages Container
export interface ChatMessagesProps extends React.ComponentProps<typeof CardContent> {}

export function ChatMessages({
  children,
  className,
  ...props
}: ChatMessagesProps) {
  const { messages } = useChatContext()

  return (
    <CardContent data-slot="chat-messages" className={className} {...props}>
      <div className="space-y-4">
        {children ??
          messages.map((message, index) => (
            <ChatMessage key={message.id ?? index} message={message} />
          ))}
      </div>
    </CardContent>
  )
}

// Single Message
export interface ChatMessageProps extends React.ComponentProps<"div"> {
  message: ChatMessage
}

export function ChatMessage({ message, className, ...props }: ChatMessageProps) {
  return (
    <div
      data-slot="chat-message"
      data-role={message.role}
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        message.role === "user"
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted",
        className
      )}
      {...props}
    >
      {message.content}
    </div>
  )
}

// Input Component
export interface ChatInputProps extends React.ComponentProps<typeof CardFooter> {
  placeholder?: string
  onSend?: (message: string) => void
}

export function ChatInput({
  placeholder = "Type your message...",
  onSend,
  className,
  ...props
}: ChatInputProps) {
  const { addMessage } = useChatContext()
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (inputLength === 0) return

    if (onSend) {
      onSend(input)
    } else {
      addMessage({
        role: "user",
        content: input,
      })
    }
    setInput("")
  }

  return (
    <CardFooter data-slot="chat-input" className={className} {...props}>
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <Input
          id="message"
          placeholder={placeholder}
          className="flex-1"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit" size="icon" disabled={inputLength === 0}>
          <Send />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </CardFooter>
  )
}

// Export all components
export {
  Chat as ChatRoot,
  ChatHeader,
  ChatMessages,
  ChatMessage,
  ChatInput,
}
