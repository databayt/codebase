"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { MinusIcon, PlusIcon } from "lucide-react"

export function AppearanceSettings() {
  const [gpuCount, setGpuCount] = React.useState(8)

  const handleGpuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 99) {
      setGpuCount(value)
    }
  }

  const handleGpuIncrement = (increment: number) => {
    setGpuCount((prev) => Math.min(99, Math.max(1, prev + increment)))
  }

  return (
    <FieldGroup>
      <Field>
        <FieldTitle>Compute Environment</FieldTitle>
        <FieldDescription>
          Choose the environment for your compute resources.
        </FieldDescription>
        <RadioGroup defaultValue="kubernetes" className="mt-2 gap-3">
          <div className="flex items-start gap-2">
            <RadioGroupItem value="kubernetes" id="kubernetes" />
            <div className="grid gap-0.5">
              <Label htmlFor="kubernetes" className="font-medium">
                Kubernetes
              </Label>
              <p className="text-muted-foreground text-sm">
                Container orchestration platform.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem value="vm" id="vm" />
            <div className="grid gap-0.5">
              <Label htmlFor="vm" className="font-medium">
                Virtual Machine
              </Label>
              <p className="text-muted-foreground text-sm">
                Traditional VM-based infrastructure.
              </p>
            </div>
          </div>
        </RadioGroup>
      </Field>
      <Field>
        <FieldTitle>GPU Configuration</FieldTitle>
        <FieldDescription>
          Set the number of GPUs for your workload.
        </FieldDescription>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => handleGpuIncrement(-1)}
            disabled={gpuCount <= 1}
            aria-label="Decrease GPU count"
          >
            <MinusIcon />
          </Button>
          <Input
            type="number"
            value={gpuCount}
            onChange={handleGpuChange}
            className="w-16 text-center"
            min={1}
            max={99}
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => handleGpuIncrement(1)}
            disabled={gpuCount >= 99}
            aria-label="Increase GPU count"
          >
            <PlusIcon />
          </Button>
        </div>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="wallpaper-tinting" className="flex-1">
          <FieldTitle>Wallpaper Tinting</FieldTitle>
          <FieldDescription>
            Allow wallpaper tinting in windows.
          </FieldDescription>
        </FieldLabel>
        <Switch id="wallpaper-tinting" />
      </Field>
    </FieldGroup>
  )
}
