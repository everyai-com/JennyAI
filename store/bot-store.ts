import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Voice } from "@/types";

export interface Bot {
  id: string;
  name: string;
  description: string;
  voice: Voice;
  model: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
  stats: {
    totalCalls: number;
    totalDuration: number;
    successRate: number;
  };
  settings: {
    greeting: string;
    language: string;
    personality: string;
    responseTime: number;
    phoneNumber?: string;
    systemPrompt?: string;
  };
  conversationHistory: Array<{
    id: string;
    timestamp: string;
    duration: number;
    customerEmail: string;
    success: boolean;
  }>;
}

interface BotState {
  bots: Bot[];
  activeBotId: string | null;
  isLoading: boolean;
  setActiveBotId: (id: string | null) => void;
  addBot: (bot: Bot) => void;
  removeBot: (id: string) => void;
  updateBot: (id: string, updates: Partial<Bot>) => void;
  updateBotStats: (
    id: string,
    callData: { duration: number; success: boolean }
  ) => void;
  deleteBot: (id: string) => void;
}

export const useBotStore = create<BotState>()(
  persist(
    (set) => ({
      bots: [],
      activeBotId: null,
      isLoading: false,
      setActiveBotId: (id) => set({ activeBotId: id }),
      addBot: (bot) => set((state) => ({ bots: [...state.bots, bot] })),
      removeBot: (id) =>
        set((state) => ({
          bots: state.bots.filter((b) => b.id !== id),
          activeBotId: state.activeBotId === id ? null : state.activeBotId,
        })),
      updateBot: (id, updates) =>
        set((state) => ({
          bots: state.bots.map((bot) =>
            bot.id === id
              ? {
                  ...bot,
                  ...updates,
                  settings: {
                    ...bot.settings,
                    ...(updates.settings || {}),
                  },
                }
              : bot
          ),
        })),
      updateBotStats: (id, { duration, success }) =>
        set((state) => ({
          bots: state.bots.map((bot) => {
            if (bot.id === id) {
              const newTotalCalls = bot.stats.totalCalls + 1;
              const newTotalDuration = bot.stats.totalDuration + duration;
              const successCount = bot.conversationHistory.filter(
                (c) => c.success
              ).length;

              return {
                ...bot,
                stats: {
                  totalCalls: newTotalCalls,
                  totalDuration: newTotalDuration,
                  successRate: (successCount / newTotalCalls) * 100,
                },
                conversationHistory: [
                  ...bot.conversationHistory,
                  {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    duration,
                    customerEmail: "customer@example.com", // You'll want to pass this in
                    success,
                  },
                ],
              };
            }
            return bot;
          }),
        })),
      deleteBot: (id) =>
        set((state) => ({
          bots: state.bots.filter((bot) => bot.id !== id),
        })),
    }),
    {
      name: "bot-store",
    }
  )
);
