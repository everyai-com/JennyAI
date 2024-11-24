import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});