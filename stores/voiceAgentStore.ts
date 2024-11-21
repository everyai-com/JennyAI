import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VoiceAgentState {
  systemPrompt: string;
  voice: string | undefined;
  language: string;
  setSystemPrompt: (prompt: string) => void;
  setVoice: (voice: string) => void;
  setLanguage: (language: string) => void;
}

export const useVoiceAgentStore = create<VoiceAgentState>()(
  persist(
    (set) => ({
      systemPrompt: "",
      voice: undefined,
      language: "English",
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setVoice: (voice) => set({ voice }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "voice-agent-storage",
    }
  )
);
