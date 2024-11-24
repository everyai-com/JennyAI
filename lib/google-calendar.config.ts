import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// Ensure environment variables are available
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_REDIRECT_URI: string;
    }
  }
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// Initialize OAuth2Client only when needed
export function getOAuth2Client() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Initialize calendar client only when needed
export function getCalendarClient(auth: OAuth2Client) {
  return google.calendar({ version: "v3", auth });
}

// Export the auth URL generator
export function generateAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent screen to ensure refresh token
  });
}
