import { NextResponse } from "next/server";


export const runtime = "edge";

export async function GET() {
  // Handle GET request
  return NextResponse.json({ message: "Hello from the API!" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Handle the POST request with the configuration data
    // You can add your logic here to save the configuration

    return NextResponse.json({ message: "Configuration saved successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
