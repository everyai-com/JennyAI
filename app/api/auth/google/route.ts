import { generateAuthUrl } from "@/lib/google-calendar.config";

import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const authUrl = generateAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Google OAuth" },
      { status: 500 }
    );
  }
}
