import { getTokens } from "@/lib/google-calendar.config";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const tokens = await getTokens(code);
    const response = NextResponse.redirect(new URL("/calendar", request.url));

    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
