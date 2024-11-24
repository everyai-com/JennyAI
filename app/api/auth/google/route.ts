import { oauth2Client } from "@/lib/google-calendar.config";
import { NextResponse } from "next/server";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const runtime = "edge";

export async function GET() {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      include_granted_scopes: true,
      state: process.env.GOOGLE_STATE_SECRET || crypto.randomUUID(),
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
