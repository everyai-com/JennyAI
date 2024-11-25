export interface Voice {
  voiceId: string;
  name: string;
  previewUrl: string;
}

export interface VoiceOption {
  voiceId: string;
  name: string;
  previewUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  extendedProps: {
    description: string;
    customerEmail: string;
    customerName: string;
  };
}
