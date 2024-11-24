import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");

  return NextResponse.json({
    isAuthenticated: !!accessToken,
  });
}
