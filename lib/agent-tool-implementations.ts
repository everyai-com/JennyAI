export const calendarToolImplementations = {
  async checkAvailability(date: string, duration?: number) {
    const response = await fetch("/api/calendar/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, duration }),
    });
    return response.json();
  },

  async bookAppointment(appointmentDetails: {
    startTime: string;
    customerName: string;
    customerEmail: string;
    title: string;
  }) {
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: appointmentDetails.title,
        description: `Appointment with ${appointmentDetails.customerName}`,
        startTime: appointmentDetails.startTime,
        endTime: new Date(
          new Date(appointmentDetails.startTime).getTime() + 30 * 60000
        ).toISOString(),
        attendees: [appointmentDetails.customerEmail],
      }),
    });
    return response.json();
  },
};
