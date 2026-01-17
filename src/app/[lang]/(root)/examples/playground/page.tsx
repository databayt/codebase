import { type Metadata } from "next"
import Image from "next/image"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export const metadata: Metadata = {
  title: "Playground",
  description: "The AI Playground built using the components.",
}

export default function PlaygroundPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/images/playground-light.png"
          width={1280}
          height={916}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/images/playground-dark.png"
          width={1280}
          height={916}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-1 flex-col md:flex">
        <div className="container flex flex-col items-start justify-between gap-2 py-4 sm:flex-row sm:items-center sm:gap-0 md:h-16">
          <h2 className="pl-0.5 text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full gap-2 sm:justify-end">
            <Select defaultValue="gpt-4">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary">Save</Button>
            <Button variant="secondary">Share</Button>
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex flex-1 flex-col">
          <div className="container flex flex-1 flex-col py-6">
            <div className="grid flex-1 items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="hidden flex-col gap-6 sm:flex md:order-2">
                <div className="grid gap-3">
                  <Label>Mode</Label>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="complete">Complete</TabsTrigger>
                    <TabsTrigger value="insert">Insert</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                  </TabsList>
                </div>
                <div className="grid gap-3">
                  <Label>Temperature</Label>
                  <Slider defaultValue={[0.56]} max={1} step={0.01} />
                </div>
                <div className="grid gap-3">
                  <Label>Max Length</Label>
                  <Slider defaultValue={[256]} max={4000} step={1} />
                </div>
                <div className="grid gap-3">
                  <Label>Top P</Label>
                  <Slider defaultValue={[0.9]} max={1} step={0.01} />
                </div>
              </div>
              <div className="flex flex-1 flex-col md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0 flex-1">
                  <div className="flex h-full flex-col gap-4">
                    <Textarea
                      placeholder="Write a tagline for an ice cream shop"
                      className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <RotateCcw />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="insert"
                  className="mt-0 flex flex-col gap-4 border-0 p-0 flex-1"
                >
                  <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                    <Textarea
                      placeholder="We're writing to [insert]. Congrats from OpenAI!"
                      className="h-full min-h-[300px] p-4 lg:min-h-[700px] xl:min-h-[700px]"
                    />
                    <div className="bg-muted rounded-md border"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <RotateCcw />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent
                  value="edit"
                  className="mt-0 flex flex-col gap-4 border-0 p-0 flex-1"
                >
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor="input" className="sr-only">
                          Input
                        </Label>
                        <Textarea
                          id="input"
                          placeholder="We is going to the market."
                          className="flex-1 p-4 lg:min-h-[580px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea
                          id="instructions"
                          placeholder="Fix the grammar."
                        />
                      </div>
                    </div>
                    <div className="bg-muted min-h-[400px] rounded-md border lg:min-h-[700px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <RotateCcw />
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}
