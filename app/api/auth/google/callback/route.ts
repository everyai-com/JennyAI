import { getOAuth2Client } from "@/lib/google-calendar.config";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const oauth2Client = getOAuth2Client();
    const tokens = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens.tokens);

    // Store tokens in session/cookie
    const response = NextResponse.redirect(new URL("/calendar", request.url));

    // Save tokens in cookies
    response.cookies.set("access_token", tokens.tokens.access_token || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("refresh_token", tokens.tokens.refresh_token || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
