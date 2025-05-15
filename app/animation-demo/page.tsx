"use client"

import { useState } from "react"
import { BackgroundAnimation } from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnimationDemoPage() {
  const [variant, setVariant] = useState<"racing-lines" | "speedometer" | "particles" | "grid" | "minimal">(
    "racing-lines",
  )
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium")

  return (
    <div className="container mx-auto px-4 py-32">
      <BackgroundAnimation variant={variant} intensity={intensity} />

      <Card className="mx-auto max-w-3xl bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl">Background Animation Demo</CardTitle>
          <CardDescription>Explore different background animations for your luxury car rental website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Animation Style</h3>
              <Tabs defaultValue="racing-lines" onValueChange={(value) => setVariant(value as any)}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="racing-lines">Racing</TabsTrigger>
                  <TabsTrigger value="speedometer">Speedometer</TabsTrigger>
                  <TabsTrigger value="particles">Particles</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="minimal">Minimal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Animation Intensity</h3>
              <Select value={intensity} onValueChange={(value) => setIntensity(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Animation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Racing Lines</h4>
                <p className="text-sm text-muted-foreground">
                  Dynamic racing lines that flow across the screen, reminiscent of race tracks and speed.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Speedometer</h4>
                <p className="text-sm text-muted-foreground">
                  Animated dials and gauges that mimic car dashboards and instrument clusters.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Particles</h4>
                <p className="text-sm text-muted-foreground">
                  Interactive particle system that creates a sense of motion and connectivity.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Grid</h4>
                <p className="text-sm text-muted-foreground">
                  Animated grid pattern inspired by race tracks and technical blueprints.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Minimal</h4>
                <p className="text-sm text-muted-foreground">
                  Subtle gradient animations that add depth without distraction, perfect for content-heavy pages.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
