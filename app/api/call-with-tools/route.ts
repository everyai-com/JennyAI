import { DemoConfig, ParameterLocation, SelectedTool } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "edge";

async function createCall(joinUrl: string, phoneNumber: string) {
  const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || "";
  const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || "";

  try {
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          Twiml: `<Response><Connect><Stream url="${joinUrl}" /></Connect></Response>`,
          From: "+13103402765",
          To: phoneNumber,
        }),
      }
    );
  } catch (error) {
    console.error("Failed to create twilio call:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, systemPrompt, voice, tools } = body;
    console.log(body);

    const response = await fetch("https://api.ultravox.ai/api/calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.ULTRAVOX_API_KEY || "",
      },
      body: JSON.stringify({
        ...callConfig.callConfig,
        medium: {
          twilio: {},
        },
      }),
    });

    const data = await response.json();
    console.log("Call response:", data);

    const joinUrl = data.joinUrl;
    await createCall(joinUrl, phoneNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in call-with-tools:", error);
    return NextResponse.json(
      { error: "Failed to process call request" },
      { status: 500 }
    );
  }
}

const selectedTools: SelectedTool[] = [
  {
    temporaryTool: {
      modelToolName: "bookAppointment",
      description:
        "Book an appointment for the customer. Use this when a customer wants to schedule a visit.",
      dynamicParameters: [
        {
          name: "appointmentDetails",
          location: ParameterLocation.BODY,
          schema: {
            type: "object",
            properties: {
              appointmentType: {
                type: "string",
                enum: ["consultation", "follow_up", "general", "urgent"],
              },
              preferredDate: {
                type: "string",
                format: "date",
              },
              preferredTime: {
                type: "string",
                pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
              },
              firstName: {
                type: "string",
              },
              lastName: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
              notes: {
                type: "string",
              },
            },
            required: [
              "appointmentType",
              "preferredDate",
              "preferredTime",
              "firstName",
              "lastName",
              "email",
            ],
          },
          required: true,
        },
      ],
      http: {
        baseUrlPattern: `https://b1b9-183-83-225-164.ngrok-free.app/api/bookAppointment`,
        httpMethod: "POST",
      },
    },
  },
];

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # Appointment Booking System Configuration

  ## Agent Role
  - Name: Appointment Assistant
  - Context: Voice-based appointment booking system with TTS output
  - Current time: ${new Date()}

  ## Available Appointment Types
  - Consultation (60 minutes)
  - Follow-up (30 minutes)
  - General (45 minutes)
  - Urgent (30 minutes)

  ## Business Hours
  Monday - Friday: 9:00 AM - 5:00 PM
  Saturday: 10:00 AM - 2:00 PM
  Sunday: Closed

  ## Conversation Flow
  1. Greeting -> Collect Appointment Type -> Schedule Time -> Collect Contact Info -> Confirmation

  ## Response Guidelines
  1. Voice-Optimized Format
    - Use natural speech patterns
    - Speak dates and times clearly
    - Confirm information step by step

  2. Conversation Management
    - Keep responses brief (1-2 sentences)
    - Use clarifying questions for ambiguity
    - Guide user through the booking process
    - Always collect email address for confirmation

  3. Appointment Booking Process
    - Verify appointment type
    - Check preferred date and time
    - Collect full name and email
    - Confirm all details before finalizing

  4. Required Information Collection
    - First Name
    - Last Name
    - Email Address (must be valid format)
    - Preferred Date
    - Preferred Time
    - Appointment Type
    - Any special requirements

  5. Email Collection
    - Ask for email address clearly
    - Confirm email by repeating back
    - Explain that confirmation will be sent

  ## Error Handling
  1. Invalid Times
    - Explain business hours
    - Suggest alternative times
  2. Unclear Input
    - Request clarification
    - Offer specific options
  3. Invalid Email
    - Ask for correction
    - Explain format if needed

  ## State Management
  - Track appointment details
  - Maintain conversation context
  - Remember previous clarifications
  - Use the "bookAppointment" tool when all required information is collected

  ## IMPORTANT BOOKING RULES
  - You MUST use the bookAppointment tool to actually create the appointment
  - Do NOT claim an appointment is booked until the bookAppointment tool returns success
  - If the bookAppointment tool fails, inform the user there was a problem and try again
  
  ## Booking Process Steps
  1. Collect all required information
  2. Call bookAppointment tool with collected information
  3. Only confirm booking after successful tool response
  4. If tool call fails, explain the error and try to resolve the issue

  ## CRITICAL TOOL USAGE INSTRUCTIONS
  You MUST follow these steps IN ORDER:
  1. Collect all required information:
     - appointmentType (must be one of: consultation, follow_up, general, urgent)
     - preferredDate (YYYY-MM-DD format)
     - preferredTime (HH:MM format)
     - firstName
     - lastName
     - email
     - notes (optional)

  2. Once ALL information is collected:
     - Say "Let me try to book that appointment for you..."
     - Make ONE attempt to call the bookAppointment tool
     - If it fails, you may make ONE MORE attempt only
     - Maximum 2 total attempts allowed per booking

  3. Tool Usage Format:
     CALL bookAppointment WITH {
       "appointmentDetails": {
         "appointmentType": "<collected_type>",
         "preferredDate": "<collected_date>",
         "preferredTime": "<collected_time>",
         "firstName": "<collected_first_name>",
         "lastName": "<collected_last_name>",
         "email": "<collected_email>",
         "notes": "<collected_notes>"
       }
     }

  4. Handle Response:
     - SUCCESS: Tell user "Your appointment has been confirmed"
     - FIRST FAILURE: Say "I apologize, there was an issue. Let me try once more"
     - SECOND FAILURE: Say "I'm sorry, but I'm unable to book the appointment right now. Please try again later"

  STRICT RULES:
  - Maximum 2 API calls per booking attempt
  - Must wait for each response before trying again
  - After 2 failures, do NOT attempt additional calls
  - Never claim success without a successful tool response

  YOU MUST NOT:
  - Skip calling the bookAppointment tool
  - Say the appointment is booked before getting a successful tool response
  - Proceed without all required information

  EXAMPLE FLOW:
  1. Collect information
  2. Say "Let me book that appointment for you..."
  3. Call bookAppointment tool
  4. Wait for response
  5. Only then confirm booking

  ## Tool Usage
  - The bookAppointment tool is REQUIRED to create appointments
  - Never skip the tool call
  - Always verify tool response before confirming booking to user
  `;

  sysPrompt = sysPrompt.replace(/"/g, '"').replace(/\n/g, "\n");

  return sysPrompt;
}

const callConfig: DemoConfig = {
  title: "Appointment Booking Assistant",
  overview: "Book an appointment for the customer.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    voice: "Mark",
    temperature: 0.4,
    selectedTools: selectedTools,
  },
};
