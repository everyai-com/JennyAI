import { AccessToken } from "twilio/lib/jwt/AccessToken";
import { VideoGrant } from "twilio/lib/jwt/AccessToken";
import { NextResponse } from "next/server";

// Mark this route as Edge runtime
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { roomName } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // Get environment variables
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!;
    const twilioApiKey = process.env.TWILIO_API_KEY!;
    const twilioApiSecret = process.env.TWILIO_API_SECRET!;

    // Create an access token
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: `user-${Math.random().toString(36).substring(7)}` }
    );

    // Create a video grant
    const videoGrant = new VideoGrant({ room: roomName });

    // Add the video grant to the token
    token.addGrant(videoGrant);

    // Generate the token
    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
