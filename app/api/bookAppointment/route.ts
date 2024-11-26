import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/edge-calendar";
import { AppointmentDetails } from "@/types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);
    const { appointmentDetails } = body;
    console.log("appointmentDetails", appointmentDetails);

    // Parse the appointment details if it's a string
    const details: AppointmentDetails =
      typeof appointmentDetails === "string"
        ? JSON.parse(appointmentDetails)
        : appointmentDetails;

    // Parse date and time
    let startDateTime = new Date();
    if (details.preferredDate.toLowerCase() === "tomorrow") {
      startDateTime.setDate(startDateTime.getDate() + 1);
    } else {
      startDateTime = new Date(details.preferredDate);
    }

    // Set the time
    const [hours, minutes] = details.preferredTime.split(":");
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Calculate end time
    const endDateTime = new Date(startDateTime.getTime());
    const durationMap = {
      consultation: 60,
      follow_up: 30,
      general: 45,
      urgent: 30,
    } as const;

    const duration =
      durationMap[details.appointmentType as keyof typeof durationMap] || 60;
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    // Create event object
    const event = {
      summary: `${details.appointmentType.toUpperCase()} - ${
        details.firstName
      } ${details.lastName}`,
      description: `Appointment Type: ${details.appointmentType}\nNotes: ${
        details.notes || "None"
      }`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [{ email: details.email }],
      reminders: {
        useDefault: true,
      },
      metadata: {
        status: "confirmed",
      },
    };

    const createdEvent = await createCalendarEvent(event);

    return NextResponse.json({
      success: true,
      eventId: createdEvent.id,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
