"use client"

import * as React from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InfoIcon, StarIcon } from "lucide-react"

export function InputGroupButtonExample() {
  const [isFavorite, setIsFavorite] = React.useState(false)
  return (
    <div className="w-full max-w-sm [--radius:9999px]">
      <InputGroup>
        <InputGroupInput placeholder="example.com" className="!pl-1" />
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                className="rounded-full"
                size="icon-xs"
                aria-label="Info"
              >
                <InfoIcon />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="text-sm" side="top">
              Your connection is not secure
            </PopoverContent>
          </Popover>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite)}
            data-favorite={isFavorite}
            className="rounded-full data-[favorite=true]:text-yellow-500 data-[favorite=true]:[&>svg]:fill-current"
            size="icon-xs"
            aria-label="Add to favorites"
            aria-pressed={isFavorite}
          >
            <StarIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
