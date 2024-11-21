import { VoiceAgentConfig } from "@/components/voice-agent-config"
import { CallInterface } from "@/components/call-interface"

export default function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Jenny Voice AI Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VoiceAgentConfig />
        <CallInterface />
      </div>
    </div>
  )
}

