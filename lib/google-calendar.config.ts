import { storage } from "./token-storage";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const tokens = await storage.get("google_tokens");
    if (!tokens) return null;
    return tokens.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

export async function refreshAccessToken(
  refresh_token: string
): Promise<TokenResponse | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens = await response.json();
    await storage.set("google_tokens", tokens);
    return tokens;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}


const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export async function getTokens(code: string) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
      code,
    }),
  });
  return response.json();
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export function generateAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: process.env.GOOGLE_STATE_SECRET || crypto.randomUUID(),
  });

  return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
}

export function getAuthUrl() {
  return generateAuthUrl();
}

export async function exchangeCodeForTokens(
  code: string
): Promise<TokenResponse | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return null;
  }
}
