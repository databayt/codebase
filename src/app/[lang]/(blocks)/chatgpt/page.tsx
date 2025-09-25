"use client";

import { Shadcn } from "@/components/chatgpt/Shadcn";
import { Button, buttonVariants } from "@/components/ui/button";
// import Link from "next/link";
// import { TESTIMONIALS } from "@/components/testimonials/testimonials";
// import { DiscordLogoIcon } from "@radix-ui/react-icons";
// import { TestimonialContainer } from "../../components/testimonials/TestimonialContainer";
// import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import athenaintel from "./logos/cust/athenaintel.png";
import browseruse from "./logos/cust/browseruse.svg";
import entelligence from "./logos/cust/entelligence.svg";
import langchain from "./logos/cust/langchain.svg";
import stack from "./logos/cust/stack.svg";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DocsRuntimeProvider } from "./DocsRuntimeProvider";
import { Providers } from "./providers";
// import { Marquee } from "@/components/magicui/marquee";
// import { useMediaQuery } from "@/lib/useMediaQuery";
// import { StarPill } from "./home/StarPill";
import ycombinator from "./logos/ycombinator.svg";
import { useState, useEffect } from "react";

// import { TestChat } from "@/components/chatgpt/test-chat";

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<any>(null);

  // Check API status on mount
  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        console.log("[HomePage] API Status:", data);
        setApiStatus(data);
      })
      .catch(err => console.error("[HomePage] Failed to check API status:", err));
  }, []);

  // Add debug logging
  console.log("[HomePage] Rendering ChatGPT page");
  console.log("[HomePage] Client-side check - no access to server env vars");

  // Normal chat UI with debug button
  return (
    <Providers>
      <div className="flex h-screen w-full flex-col overflow-hidden relative">
        {/* API Status Indicator */}
        {apiStatus && (
          <div className="absolute top-2 left-2 z-50 bg-background border rounded p-2 text-xs">
            <div className="font-semibold mb-1">API Status:</div>
            <div className={`flex items-center gap-1 ${apiStatus.groq?.configured ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${apiStatus.groq?.configured ? 'bg-green-600' : 'bg-red-600'}`} />
              Groq: {apiStatus.groq?.configured ? `✓ (${apiStatus.groq.keyLength} chars)` : '✗ Not configured'}
            </div>
            <div className={`flex items-center gap-1 ${apiStatus.anthropic?.configured ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${apiStatus.anthropic?.configured ? 'bg-green-600' : 'bg-red-600'}`} />
              Claude: {apiStatus.anthropic?.configured ? `✓ (${apiStatus.anthropic.keyLength} chars)` : '✗ Not configured'}
            </div>
          </div>
        )}

        {/* Debug button */}
        <button
          onClick={async () => {
            console.log("=== DEBUG: Testing API directly ===");

            // Get selected model from localStorage
            const selectedModel = localStorage.getItem('selectedModel') || 'llama-3.3-70b-versatile';
            console.log("DEBUG: Using model:", selectedModel);

            try {
              const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  messages: [{ role: "user", content: "Hello, test message" }],
                  model: selectedModel
                }),
              });

              console.log("DEBUG: Response status:", response.status);
              console.log("DEBUG: Response headers:", Object.fromEntries(response.headers.entries()));

              if (!response.ok) {
                const error = await response.text();
                console.error("DEBUG: Error response:", error);
                alert(`API Error: ${error}`);
              } else {
                console.log("DEBUG: API call successful, reading stream...");
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let result = "";

                if (reader) {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    result += chunk;
                    console.log("DEBUG: Received chunk:", chunk.substring(0, 100));
                  }
                  console.log("DEBUG: Full response length:", result.length);
                  alert("API Test Successful! Check console for details.");
                }
              }
            } catch (error) {
              console.error("DEBUG: Test failed:", error);
              alert(`Test failed: ${error}`);
            }
          }}
          className="absolute top-2 right-2 z-50 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Test API
        </button>

        <DocsRuntimeProvider>
          <Shadcn />
        </DocsRuntimeProvider>
      </div>
    </Providers>
  );
}

// function Hero() {
//   return (
//     <div className="relative z-[2] flex flex-col overflow-hidden px-6 py-12 text-center md:pt-16">
//       <h1 className="mb-8 text-4xl font-medium md:hidden">
//         UX of ChatGPT in your own app
//       </h1>
//       <h1 className="mb-8 text-5xl font-medium max-md:hidden">
//         UX of ChatGPT in your own app
//       </h1>
//       <p className="mb-8 text-muted-foreground md:text-xl">
//         assistant-ui is the TypeScript/React library for{" "}
//         <span className="text-foreground">AI Chat</span>.<br />
//         Built on <span className="text-foreground">shadcn/ui</span> and{" "}
//         <span className="text-foreground">Tailwind</span>.
//       </p>
//
//       <div className="mx-auto mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row">
//         <CopyCommandButton />
//
//         <a
//           href="https://cal.com/simon-farshid/assistant-ui"
//           className={cn(
//             buttonVariants({
//               size: "lg",
//               variant: "outline",
//               className: "h-12 self-center bg-background",
//             }),
//           )}
//         >
//           Contact Sales
//         </a>
//       </div>
//
//       <div className="mt-8 text-muted-foreground">
//         <p>
//           Backed by{" "}
//           <Image
//             src={ycombinator}
//             alt="Y Combinator"
//             className="mb-1 inline"
//             width={140}
//           />
//         </p>
//       </div>
//       {/* <Image
//         // src={Img}
//         alt="preview"
//         className="animate-in fade-in slide-in-from-bottom-12 mb-[-250px] mt-12 min-w-[800px] select-none duration-1000 md:mb-[-340px] md:min-w-[1100px]"
//         priority
//       /> */}
//     </div>
//   );
// }

// const Logos = () => {
//   const isMobile = useMediaQuery("(max-width: 1080px)");
//
//   const content = (
//     <div className="flex w-full items-center justify-around rounded pt-6">
//       <Image
//         src={langchain}
//         alt="Langchain"
//         className="inline-block h-[28px] w-auto opacity-50 invert transition-opacity hover:opacity-100 dark:invert-0"
//       />
//       <Image
//         src={athenaintel}
//         alt="Athena Intelligence"
//         className="inline-block h-11 w-auto opacity-50 invert transition-opacity hover:opacity-100 dark:invert-0"
//       />
//       <Image
//         src={browseruse}
//         alt="Browseruse"
//         className="inline-block h-[26px] w-auto opacity-50 invert transition-opacity hover:opacity-100 dark:invert-0"
//       />
//       <Image
//         src={entelligence}
//         alt="Entelligence"
//         className="mt-1 inline-block h-[22px] w-auto opacity-50 invert transition-opacity hover:opacity-100 dark:invert-0"
//       />
//       <Image
//         src={stack}
//         alt="Stack"
//         className="mt-0.5 inline-block h-[22px] w-auto opacity-50 invert transition-opacity hover:opacity-100 dark:invert-0"
//       />
//     </div>
//   );
//
//   if (isMobile) {
//     return (
//       <div className="w-full overflow-clip">
//         <Marquee repeat={4}>
//           <div className="flex w-[1000px]">{content}</div>
//         </Marquee>
//       </div>
//     );
//   }
//
//   return content;
// };
//
// function CopyCommandButton() {
//   const [copied, setCopied] = useState(false);
//
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText("npx assistant-ui init");
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
//
//   return (
//     <button
//       onClick={copyToClipboard}
//       className={buttonVariants({
//         size: "lg",
//         variant: "outline",
//         className:
//           "group relative flex h-12 items-center gap-2 rounded-lg border bg-background px-4 py-3 font-mono text-sm font-bold transition-all",
//       })}
//     >
//       <span>$ npx assistant-ui init</span>
//       <div className="ml-2 flex h-5 w-5 items-center justify-center text-muted-foreground">
//         {copied ? (
//           <CheckIcon className="h-3 w-3 text-green-500" />
//         ) : (
//           <CopyIcon className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100" />
//         )}
//       </div>
//     </button>
//   );
// }
