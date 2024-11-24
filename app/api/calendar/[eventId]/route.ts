import {
  getOAuth2Client,
  getCalendarClient,
} from "@/lib/google-calendar.config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = getCalendarClient(oauth2Client);

    // Verify the event exists first
    try {
      await calendar.events.get({
        calendarId: "primary",
        eventId: params.eventId,
      });
    } catch (error) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete the event
    await calendar.events.delete({
      calendarId: "primary",
      eventId: params.eventId,
      sendUpdates: "all",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json(
      {
        error: "Failed to delete event",
        details: error.message,
      },
      { status: error.code || 500 }
    );
  }
}
