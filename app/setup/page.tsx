import { EnvSetupGuide } from "@/components/env-setup"

export default function SetupPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Environment Setup</h1>
      <EnvSetupGuide />
    </div>
  )
}
