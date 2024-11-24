import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken, deleteEvent, getEvent } from "@/lib/edge-calendar";

export const runtime = "edge";

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
    const newAccessToken = await getAccessToken(refreshToken);

    // Verify the event exists
    try {
      await getEvent(newAccessToken, params.eventId);
    } catch (error) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete the event
    await deleteEvent(newAccessToken, params.eventId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
