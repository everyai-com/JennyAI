import { NextResponse } from "next/server";
import twilio from "twilio";

export const runtime = "edge";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

export async function POST(request: Request) {
  try {
    const { identity } = await request.json();

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create an access token which we will sign and return to the client
    const token = new AccessToken(
      accountSid!,
      apiKey!,
      apiSecret!,
      { identity } // Pass identity as an option
    );

    // Grant access to Voice
    const grant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(grant);

    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
