interface AppointmentDetails {
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  firstName: string;
  lastName: string;
  email: string;
  notes?: string;
}

async function refreshAccessToken(refreshToken: string) {
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

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function createGoogleCalendarEvent(
  appointmentDetails: AppointmentDetails,
  cookies: string
) {
  try {
    // Parse cookies
    const cookieMap = new Map(
      cookies.split(";").map((cookie) => {
        const [key, value] = cookie.trim().split("=");
        return [key, value];
      })
    );

    let accessToken = cookieMap.get("access_token");
    const refreshToken = cookieMap.get("refresh_token");

    if (!accessToken || !refreshToken) {
      throw new Error("Authentication tokens not found");
    }

    // Ensure valid date format
    const startDateTime = new Date(
      `${appointmentDetails.preferredDate}T${appointmentDetails.preferredTime}`
    );

    if (isNaN(startDateTime.getTime())) {
      throw new Error("Invalid date or time format");
    }

    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour

    const event = {
      summary: `${appointmentDetails.appointmentType} with ${appointmentDetails.firstName} ${appointmentDetails.lastName}`,
      description: appointmentDetails.notes || "No additional notes",
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [{ email: appointmentDetails.email }],
    };

    let response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    // If token expired, refresh and retry
    if (response.status === 401) {
      accessToken = await refreshAccessToken(refreshToken);
      response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );
    }

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
