import { create } from "zustand";
import { CalendarEvent } from "@/types";

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  isLoading: false,
  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        throw new Error("Failed to fetch calendar events");
      }
      const events = await response.json();
      set({ events, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      set({ isLoading: false, events: [] });
    }
  },
}));
