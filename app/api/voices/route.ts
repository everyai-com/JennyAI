"use server";

import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const BASE_URL = "https://api.ultravox.ai/api";
  const API_KEY = "VAfcW6VB.driGgc9PJQeIkhtcdOt5XVDhCncBNVfR";

  try {
    const voices = await fetch(`${BASE_URL}/voices`, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    const data = await voices.json();

    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 }
    );
  }
}
