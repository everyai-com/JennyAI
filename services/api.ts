const BASE_URL = "http://localhost:3001";
import { useVoiceAgentStore } from "@/stores/voiceAgentStore";

export const apiService = {
  // Get voices
  getVoices: async () => {
    try {
      const response = await fetch(`${BASE_URL}/voices`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("API call failed");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      throw error;
    }
  },

  createCall: async () => {
    try {
      const response = await fetch(`${BASE_URL}/call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt: useVoiceAgentStore.getState().systemPrompt,
          voice: useVoiceAgentStore.getState().voice,
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
