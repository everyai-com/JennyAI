import { NextResponse } from "next/server";
import { AccessToken } from "@/app/utils/twilio-edge";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!;
    const twilioApiKey = process.env.TWILIO_API_KEY!;
    const twilioApiSecret = process.env.TWILIO_API_SECRET!;
    const twilioAppSid = process.env.TWILIO_APP_SID!;

    // Create an access token
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: `user-${Math.random().toString(36).substring(7)}` }
    );

    // Create a voice grant
    const voiceGrant = {
      outgoing: {
        application_sid: twilioAppSid,
      },
      incoming: {
        allow: true,
      },
    };

    // Add the voice grant to the token
    token.addGrant(voiceGrant);

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
