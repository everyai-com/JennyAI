export const calendarTools = {
  checkAvailability: {
    name: "checkAvailability",
    description: "Check available appointment slots for a given date",
    parameters: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "The date to check availability for (ISO string)",
        },
        duration: {
          type: "number",
          description: "Duration of the appointment in minutes (default: 30)",
        },
      },
      required: ["date"],
    },
  },
  bookAppointment: {
    name: "bookAppointment",
    description: "Book an appointment at the specified time",
    parameters: {
      type: "object",
      properties: {
        startTime: {
          type: "string",
          description: "Start time of the appointment (ISO string)",
        },
        customerName: {
          type: "string",
          description: "Name of the customer",
        },
        customerEmail: {
          type: "string",
          description: "Email of the customer",
        },
        title: {
          type: "string",
          description: "Title/purpose of the appointment",
        },
      },
      required: ["startTime", "customerName", "customerEmail", "title"],
    },
  },
};
