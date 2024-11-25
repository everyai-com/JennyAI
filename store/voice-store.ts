import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Voice {
  id: string;
  name: string;
  language: string;
}

interface VoiceState {
  voices: Voice[];
  currentVoice: string | null;
  isLoading: boolean;
  hasLoaded: boolean;
  setVoices: (voices: Voice[]) => void;
  setCurrentVoice: (voice: string) => void;
  setIsLoading: (loading: boolean) => void;
  setHasLoaded: (loaded: boolean) => void;
  initialize: () => void;
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      voices: [],
      currentVoice: null,
      isLoading: false,
      hasLoaded: false,
      setVoices: (voices) => set({ voices, hasLoaded: true }),
      setCurrentVoice: (voice) => set({ currentVoice: voice }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
      initialize: () => set({ hasLoaded: false, voices: [] }),
    }),
    {
      name: "voice-store",
      onRehydrateStorage: () => {
        console.log("Voice store hydrated");
        return (state) => {
          console.log("Hydrated state:", state);
        };
      },
    }
  )
);
