import { useEffect } from "react";
import { useCalendarStore } from "@/store/calendar-store";

export function useCalendarEvents() {
  const { events, isLoading, fetchEvents } = useCalendarStore();

  useEffect(() => {
    // Only fetch if we don't have events and we're not currently loading
    if (!isLoading) {
      fetchEvents();
    }
  }, [isLoading, fetchEvents]);

  return { events, isLoading };
}
