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
    appointmentBooking: {
      enabled: boolean;
      calendarId: string;
      availabilityStart: string;
      availabilityEnd: string;
      appointmentDuration: number;
      timezone: string;
    };
  };
  conversationHistory: Array<{
    id: string;
    timestamp: string;
    duration: number;
    customerEmail: string;
    success: boolean;
  }>;
}

interface AppointmentEvent {
  id: string;
  summary: string;
  startTime: string;
  endTime: string;
  attendeeEmail: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface BotState {
  bots: Bot[];
  activeBotId: string | null;
  isLoading: boolean;
  appointments: AppointmentEvent[];
  setActiveBotId: (id: string | null) => void;
  addBot: (bot: Bot) => void;
  removeBot: (id: string) => void;
  updateBot: (id: string, updates: Partial<Bot>) => void;
  updateBotStats: (
    id: string,
    callData: { duration: number; success: boolean }
  ) => void;
  deleteBot: (id: string) => void;
  scheduleAppointment: (
    botId: string,
    appointmentDetails: {
      summary: string;
      description: string;
      startTime: string;
      endTime: string;
      attendeeEmail: string;
    }
  ) => Promise<any>;
  checkAvailability: (
    botId: string,
    startTime: string,
    endTime: string
  ) => Promise<any>;
}

export const useBotStore = create<BotState>()(
  persist<BotState>(
    (set, get) => ({
      bots: [] as Bot[],
      activeBotId: null,
      isLoading: false,
      appointments: [] as AppointmentEvent[],
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
      scheduleAppointment: async (
        botId: string,
        appointmentDetails: {
          summary: string;
          description: string;
          startTime: string;
          endTime: string;
          attendeeEmail: string;
        }
      ) => {
        const state = get();
        const bot = state.bots.find((b) => b.id === botId);

        if (!bot?.settings?.appointmentBooking?.calendarId) {
          throw new Error("No calendar ID configured");
        }

        try {
          const response = await fetch("/api/call-with-tools", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "schedule_appointment",
              calendarId: bot.settings.appointmentBooking.calendarId,
              ...appointmentDetails,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to schedule appointment");
          }

          const data = await response.json();

          set((state) => ({
            appointments: [
              ...state.appointments,
              {
                id: data.event.id,
                ...appointmentDetails,
                status: "confirmed",
              },
            ],
          }));

          return data;
        } catch (error) {
          console.error("Failed to schedule appointment:", error);
          throw error;
        }
      },
      checkAvailability: async (
        botId: string,
        startTime: string,
        endTime: string
      ) => {
        const state = get();
        const bot = state.bots.find((b) => b.id === botId);

        if (!bot?.settings?.appointmentBooking?.calendarId) {
          throw new Error("No calendar ID configured");
        }

        try {
          const response = await fetch("/api/call-with-tools", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "check_availability",
              calendarId: bot.settings.appointmentBooking.calendarId,
              startTime,
              endTime,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to check availability");
          }

          return await response.json();
        } catch (error) {
          console.error("Failed to check availability:", error);
          throw error;
        }
      },
    }),
    {
      name: "bot-store",
    }
  )
);
