import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken, listEvents, createEvent } from "@/lib/edge-calendar";
import { getOAuth2Client } from "@/lib/google-calendar.config";

export const runtime = "edge";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const newAccessToken = await getAccessToken(refreshToken);
    const events = await listEvents(newAccessToken);
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAccessToken = await getAccessToken(refreshToken);
    const event = {
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

    const response = await createEvent(newAccessToken, event);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
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
