import { NextResponse } from "next/server";

export const runtime = "edge";

// This would typically interact with your database
// For now, we'll store in memory (note: not persistent in edge functions)
let assistants: any[] = [];

export async function GET() {
  return NextResponse.json({ assistants });
}

export async function POST(request: Request) {
  try {
    const assistant = await request.json();

    // Add validation here
    if (!assistant.name || !assistant.voice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add the assistant with a unique ID
    const newAssistant = {
      id: Date.now().toString(),
      ...assistant,
      createdAt: new Date().toISOString(),
    };

    assistants.push(newAssistant);

    return NextResponse.json(newAssistant);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create assistant" },
      { status: 500 }
    );
  }
}
