import { calendar } from "@/lib/google-calendar.config";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth.config";
import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken.value,
      refresh_token: cookieStore.get("refresh_token")?.value,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Calendar API error:", error);
    return new Response("Error fetching calendar", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = {
      summary: body.summary,
      description: body.description,
      start: {
        dateTime: body.startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: body.endTime,
        timeZone: "UTC",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
