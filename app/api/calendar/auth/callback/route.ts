import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/calendar?error=no_code");
  }

  try {
    // Handle the OAuth token exchange here
    // Store the tokens securely (e.g., in your database)

    // Redirect to calendar page with success
    return NextResponse.redirect("/calendar?success=true");
  } catch (error) {
    console.error("Error in calendar auth callback:", error);
    return NextResponse.redirect("/calendar?error=auth_failed");
  }
}
