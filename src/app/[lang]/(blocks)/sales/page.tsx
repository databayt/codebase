"use client";

import { Shadcn } from "@/components/sales/Shadcn";
import { DocsRuntimeProvider } from "./DocsRuntimeProvider";
import { Providers } from "./providers";

export default function HomePage() {
  return (
    <Providers>
      <div className="flex h-screen w-full flex-col overflow-hidden relative">
        <DocsRuntimeProvider>
          <Shadcn />
        </DocsRuntimeProvider>
      </div>
    </Providers>
  );
}