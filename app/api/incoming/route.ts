// /api/incoming

import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(_request: Request) {
  const response = await fetch("https://api.ultravox.ai/api/calls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "VAfcW6VB.driGgc9PJQeIkhtcdOt5XVDhCncBNVfR",
    },
    body: JSON.stringify({
      systemPrompt: "You are a helpful assistant.",
    }),
  });

  const data = await response.json();
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Connect><Stream url="${data.joinUrl}" /></Connect>
  </Response>`;

  console.log(data);

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
