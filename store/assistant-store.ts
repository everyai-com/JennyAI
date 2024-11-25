import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Assistant {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  voice: string;
  createdAt: string;
}

interface AssistantState {
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  setAssistants: (assistants: Assistant[]) => void;
  setCurrentAssistant: (assistant: Assistant) => void;
  addAssistant: (assistant: Assistant) => void;
  removeAssistant: (id: string) => void;
  updateAssistant: (id: string, updates: Partial<Assistant>) => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      assistants: [],
      currentAssistant: null,
      setAssistants: (assistants) => set({ assistants }),
      setCurrentAssistant: (assistant) => set({ currentAssistant: assistant }),
      addAssistant: (assistant) =>
        set((state) => ({ assistants: [...state.assistants, assistant] })),
      removeAssistant: (id) =>
        set((state) => ({
          assistants: state.assistants.filter((a) => a.id !== id),
        })),
      updateAssistant: (id, updates) =>
        set((state) => ({
          assistants: state.assistants.map((assistant) =>
            assistant.id === id ? { ...assistant, ...updates } : assistant
          ),
        })),
    }),
    {
      name: "assistant-store",
    }
  )
);
