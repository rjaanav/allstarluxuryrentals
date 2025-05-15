"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function EnvSetupGuide() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const envVars = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site URL (used for authentication redirects)
NEXT_PUBLIC_SITE_URL=https://allstarluxuryrentals-jaanavs-projects.vercel.app`

  const handleCopy = () => {
    navigator.clipboard.writeText(envVars)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Environment variables copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Environment Setup</CardTitle>
        <CardDescription>Add these environment variables to your Vercel project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{envVars}</pre>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy to Clipboard"}</Button>
      </CardFooter>
    </Card>
  )
}
