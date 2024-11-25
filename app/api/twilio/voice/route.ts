import { NextResponse } from "next/server";
import twilio from "twilio";

export const runtime = "edge";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const twiml = new VoiceResponse();

  try {
    const { assistantId, customerEmail } = await request.json();

    // Add your desired TwiML instructions
    twiml.say("Welcome to the call. Please wait while we connect you.");

    // Create a conference room named after the customer email or a unique ID
    const conferenceName = `conf-${customerEmail}-${Date.now()}`;
    const dial = twiml.dial();
    dial.conference(conferenceName, {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
      maxParticipants: 2,
      record: "record-from-start",
    });

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error generating TwiML:", error);
    twiml.say("An error occurred. Please try again later.");
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
      status: 500,
    });
  }
}
