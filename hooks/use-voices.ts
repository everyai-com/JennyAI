import { useEffect } from "react";
import { useVoiceStore } from "@/store/voice-store";

export function useVoices() {
  const { voices, isLoading, fetchVoices } = useVoiceStore();

  useEffect(() => {
    if (voices.length === 0 && !isLoading) {
      fetchVoices();
    }
  }, [voices.length, isLoading, fetchVoices]);

  return { voices, isLoading };
}
