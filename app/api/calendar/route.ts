import {
  getOAuth2Client,
  getCalendarClient,
} from "@/lib/google-calendar.config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { calendar_v3 } from "googleapis";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
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
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { summary, description, startTime, endTime, attendees } = body;

    if (!summary || !attendees || attendees.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields (title or attendees)" },
        { status: 400 }
      );
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = getCalendarClient(oauth2Client);

    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "UTC",
      },
      attendees: attendees.map((email: string) => ({ email })),
      guestsCanModify: false,
      guestsCanInviteOthers: false,
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

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
    await calendar.events.delete({
      calendarId: "primary",
      eventId: params.eventId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
