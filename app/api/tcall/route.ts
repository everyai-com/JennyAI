import { NextResponse } from "next/server";

export const runtime = "edge";

async function createCall(joinUrl: string, phoneNumber: string) {
  const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || "";
  const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || "";

  try {
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          Twiml: `<Response><Connect><Stream url="${joinUrl}" /></Connect></Response>`,
          From: "+13103402765",
          To: phoneNumber,
        }),
      }
    );
  } catch (error) {
    console.error("Failed to create twilio call:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log("Creating Twilio call...");
  try {
    const body = await request.json();
    const { systemPrompt, voice, phoneNumber } = body;

    const response = await fetch("https://api.ultravox.ai/api/calls", {
      method: "POST",
      headers: {
        "X-API-Key": "VAfcW6VB.driGgc9PJQeIkhtcdOt5XVDhCncBNVfR",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        voice,
        medium: {
          twilio: {},
        },
        initiator: "INITIATOR_AGENT",
      }),
    });

    const data = await response.json();
    // console.log(data);

    await createCall(data.joinUrl, phoneNumber);

    return NextResponse.json({ message: "Call created successfully" });
  } catch (error) {
    console.error("Failed to create Twilio call:", error);
    throw error;
  }
}
