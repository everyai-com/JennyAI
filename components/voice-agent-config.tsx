"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";
import { useVoiceAgentStore } from "@/stores/voiceAgentStore";

export function VoiceAgentConfig() {
  const {
    systemPrompt,
    voice,
    language,
    setSystemPrompt,
    setVoice,
    setLanguage,
  } = useVoiceAgentStore();
  const [voiceOptions, setVoiceOptions] = useState([]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const data = await apiService.getVoices();
        console.log(data.results);
        // You might want to set the voice options here:
        setVoiceOptions(data.results);
      } catch (error) {
        console.error("Failed to fetch voices:", error);
      }
    };

    fetchVoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { systemPrompt, voice, language };
      // await apiService.saveConfig(config);

      console.log("Voice agent configuration saved successfully");
    } catch (error) {
      console.error("Failed to save configuration:", error);
    }
  };

  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl text-gray-800">
          Configure Jenny Voice AI
        </CardTitle>
        <CardDescription>
          Customize your voice assistant's behavior and voice
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="voice"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Voice
            </label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((option) => (
                  <SelectItem key={option.voiceId} value={option.voiceId}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <label
              htmlFor="system-prompt"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              System Prompt
            </label>
            <Textarea
              id="system-prompt"
              placeholder="Enter the system prompt for Jenny AI..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="w-full p-2 border border-zinc-200 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-800"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-200">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Configuration
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
