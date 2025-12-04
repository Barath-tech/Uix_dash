"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { AgentDetail } from "@/components/agents/agent-detail"
import { Button } from "@/components/ui/button"
import { mockAgents } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

interface AgentDetailPageProps {
  params: Promise<{ id: string }>
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const agent = mockAgents.find((a) => a.id === id)

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Agent Not Found" />
        <div className="p-6">
          <p className="text-muted-foreground">The requested agent could not be found.</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push("/agents")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={agent.name} subtitle="Agent Details & Analytics" />

      <div className="p-6">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.push("/agents")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Button>

        <AgentDetail agent={agent} />
      </div>
    </div>
  )
}
