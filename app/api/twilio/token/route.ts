import { NextResponse } from "next/server";
import { AccessToken, VideoGrant } from "@/app/utils/twilio-edge";

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
    const videoGrant: VideoGrant = { room: roomName };

    // Add the video grant to the token
    token.addGrant(videoGrant);

    // Generate the token
    const jwt = await token.toJwt();

    return NextResponse.json({ token: jwt });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
