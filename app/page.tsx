"use client";

import Template from "@/components/template";
import { VoiceAgentConfig } from "@/components/voice-agent-config";
import { CallInterface } from "@/components/call-interface";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }

  return (
    <Template>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          Jenny Voice AI Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VoiceAgentConfig />
          <CallInterface />
        </div>
      </div>
    </Template>
  );
}
