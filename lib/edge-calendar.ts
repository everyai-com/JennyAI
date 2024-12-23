const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export async function getAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function listEvents(accessToken: string) {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=10&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}

export async function createEvent(accessToken: string, eventData: any) {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    }
  );

  return response.json();
}

export async function deleteEvent(accessToken: string, eventId: string) {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}?sendUpdates=all`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.status === 204;
}

export async function getEvent(accessToken: string, eventId: string) {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: { email: string }[];
  reminders?: {
    useDefault: boolean;
  };
  metadata?: {
    status: string;
  };
}

export async function createCalendarEvent(event: CalendarEvent) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create calendar event: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
