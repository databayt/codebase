"use client"

import { FileTextIcon } from "lucide-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"

export function ChatPrimitivesPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>

      <MessageGroup>
        <Message>
          <MessageAvatar>
            <span className="p-2 text-xs font-medium">AI</span>
          </MessageAvatar>
          <MessageContent>
            Hello! I found the report you asked for.
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>Great — send it over.</MessageContent>
        </Message>
      </MessageGroup>

      <Attachment>
        <AttachmentMedia>
          <FileTextIcon className="size-4" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
          <AttachmentDescription>2.4 MB · PDF</AttachmentDescription>
        </AttachmentContent>
      </Attachment>

      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Bubbles group short exchanges</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>and mirror correctly in RTL.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
