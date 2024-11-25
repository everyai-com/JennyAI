import { useState, useEffect } from "react";
import { VoiceOption } from "@/types";
import { apiService } from "@/services/api";

export function useVoices() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voicesData = await apiService.getVoices();
        setVoices(voicesData);
      } catch (error) {
        console.error("Failed to fetch voices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return { voices, isLoading };
}
