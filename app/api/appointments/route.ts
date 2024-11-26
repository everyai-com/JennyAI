import { NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/calendar-utils";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const appointmentDetails = await request.json();
    const cookies = request.headers.get("cookie") || "";

    // Validate appointment details
    if (
      !appointmentDetails.appointmentType ||
      !appointmentDetails.preferredDate ||
      !appointmentDetails.preferredTime ||
      !appointmentDetails.firstName ||
      !appointmentDetails.lastName ||
      !appointmentDetails.email
    ) {
      return NextResponse.json(
        { error: "Missing required appointment details" },
        { status: 400 }
      );
    }

    // Create calendar event
    const calendarEvent = await createGoogleCalendarEvent(
      appointmentDetails,
      cookies
    );

    return NextResponse.json({
      success: true,
      message: "Appointment scheduled successfully",
      eventId: calendarEvent.id,
    });
  } catch (error) {
    console.error("Error processing appointment:", error);
    if (
      error instanceof Error &&
      error.message.includes("Authentication tokens not found")
    ) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to schedule appointment" },
      { status: 500 }
    );
  }
}
