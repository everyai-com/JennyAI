const BASE_URL = "http://localhost:3001";
import { useVoiceAgentStore } from "@/stores/voiceAgentStore";

export const apiService = {
  // Get voices
  getVoices: async () => {
    try {
      const response = await fetch(`/api/voices`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("API call failed");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      throw error;
    }
  },

  createTwilioCall: async ({
    phoneNumber,
    systemPrompt,
    voice,
  }: {
    phoneNumber: string;
    systemPrompt: string;
    voice: string;
  }) => {
    try {
      const response = await fetch(`/api/tcall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          systemPrompt,
          voice,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      return await response.json();
    } catch (error) {
      console.error("Failed to create call:", error);
      throw error;
    }
  },

  createCall: async ({
    systemPrompt,
    voice,
  }: {
    systemPrompt: string;
    voice: string;
  }) => {
    try {
      const response = await fetch(`/api/call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt,
          voice,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      return await response.json();
    } catch (error) {
      console.error("Failed to create call:", error);
      throw error;
    }
  },
};
