"use server";
import { NextResponse } from "next/server";
import twilio from "twilio";
import dotenv from "dotenv";

export const runtime = "edge";

dotenv.config();

async function createCall(joinUrl: string, phoneNumber: string) {
  const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || "";
  const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || "";

  const twilioClient = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("Creating twilio call...");

  try {
    const call = await twilioClient.calls.create({
      twiml: `<Response><Connect><Stream url="${joinUrl}" /></Connect></Response>`,
      from: "+13103402765",
      to: phoneNumber,
    });
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
