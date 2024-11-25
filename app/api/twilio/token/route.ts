import { NextResponse } from "next/server";
import { createToken } from "@/app/utils/edge-jwt";

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

    // Create a custom token payload
    const payload = {
      grants: {
        video: {
          room: roomName,
        },
      },
      sub: twilioAccountSid,
      iss: twilioApiKey,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      jti: `${twilioApiKey}-${Date.now()}`,
    };

    // Generate the token
    const token = await createToken(payload, twilioApiSecret, "1h");

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
