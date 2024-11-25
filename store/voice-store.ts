import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Voice } from "@/types";

interface VoiceState {
  voices: Voice[];
  isLoading: boolean;
  setVoices: (voices: Voice[]) => void;
  setIsLoading: (loading: boolean) => void;
  fetchVoices: () => Promise<void>;
}

const initialState = {
  voices: [] as Voice[],
  isLoading: false,
};

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setVoices: (voices) => set({ voices }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      fetchVoices: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/voices");
          const voices = await response.json();
          set({ voices, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch voices:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "voice-storage",
      onRehydrateStorage: () => (state) => {
        // Ensure voices is an array after rehydration
        if (!state?.voices) {
          state.voices = [];
        }
      },
    }
  )
);
