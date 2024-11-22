"use server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    console.log("Creating call...");

    const body = await request.json();
    const { systemPrompt, voice } = body;

    const response = await fetch("https://api.ultravox.ai/api/calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "VAfcW6VB.driGgc9PJQeIkhtcdOt5XVDhCncBNVfR",
      },
      body: JSON.stringify({
        systemPrompt,
        voice,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to make call");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Call error:", error);
    return NextResponse.json(
      { error: "Failed to initiate call" },
      { status: 500 }
    );
  }
}
