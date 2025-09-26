"use client";

import { ShareIcon } from "lucide-react";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import Image from "next/image";
import { ComponentPropsWithRef, type FC } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Thread } from "./thread";

type ButtonWithTooltipProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: TooltipContentProps["side"];
};

const ButtonWithTooltip: FC<ButtonWithTooltipProps> = ({
  children,
  tooltip,
  side = "top",
  ...rest
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...rest}>
          {children}
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

const Header: FC = () => {
  return (
    <header className="flex gap-2 items-center">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Image
          src='/vercel.svg'
          alt="logo"
          width={16}
          height={16}
          className="inline size-4 dark:hue-rotate-180 dark:invert"
        />
        <span>assistant-ui</span>
      </div>
      <ButtonWithTooltip
        variant="outline"
        size="icon"
        tooltip="Share"
        side="bottom"
        className="ml-auto shrink-0"
      >
        <ShareIcon className="size-4" />
      </ButtonWithTooltip>
    </header>
  );
};

export const Shadcn = () => {
  const sideStyle = "bg-muted/40 px-3 py-2";
  const topStyle = "border-b";

  return (
    <div className="h-full w-full">
      {/* <div className={cn(sideStyle, topStyle)}>
        <Header />
      </div> */}
      <div className="h-full overflow-hidden bg-background">
        <Thread />
      </div>
    </div>
  );
};
