import { NextResponse } from "next/server";
import { getCalendarEvents } from "@/lib/google-calendar.config";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { date, duration = 30 } = await request.json();

    const startTime = new Date(date);
    startTime.setHours(8, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(20, 0, 0);

    const events = await getCalendarEvents(
      startTime.toISOString(),
      endTime.toISOString()
    );

    const availableSlots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      const hasConflict = events.items?.some((event: any) => {
        const eventStart = new Date(
          event.start?.dateTime || event.start?.date || ""
        );
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || "");
        return (
          (currentTime >= eventStart && currentTime < eventEnd) ||
          (slotEnd > eventStart && slotEnd <= eventEnd)
        );
      });

      if (!hasConflict) {
        availableSlots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
