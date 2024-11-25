"use client";

import { useVoiceStore } from "@/store/voice-store";
import { useVoices } from "@/hooks/use-voices";

export function DebugVoices() {
  const { voices, isLoading, hasLoaded } = useVoiceStore();
  useVoices(); // This will trigger the fetch if needed

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs">
      <pre>
        {JSON.stringify(
          {
            voiceCount: voices.length,
            isLoading,
            hasLoaded,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
