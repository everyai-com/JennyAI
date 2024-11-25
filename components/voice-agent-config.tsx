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
import { Input } from "./ui/input";

export function VoiceAgentConfig() {
  const {
    systemPrompt,
    voice,
    language,
    setSystemPrompt,
    setVoice,
    setLanguage,
    phoneNumber,
    setPhoneNumber,
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

  const handleStartTwilioCall = async () => {
    await apiService.createTwilioCall(phoneNumber);
  };

  return (
    <Card className=" border-border">
      <CardHeader className="bg-gray-800 border-b-gray-700 border-border rounded-t-lg">
        <CardTitle className="text-zinc-50">Configure Jenny Voice AI</CardTitle>
        <CardDescription className="text-zinc-400">
          Customize your voice assistant's behavior and voice
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/95 border-gray-700 border-b rounded-b-lg"
      >
        <CardContent className="space-y-4 pt-4">
          <div>
            <label
              htmlFor="voice"
              className="block text-sm font-medium mb-1 text-zinc-300"
            >
              Voice
            </label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 max-w-screen-sm">
                {voiceOptions.map((option: any) => (
                  <SelectItem key={option.voiceId} value={option.voiceId}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium mb-1 text-zinc-300"
            >
              Phone Number
            </label>
            <Input
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div>
            <label
              htmlFor="system-prompt"
              className="block text-sm font-medium mb-1 text-zinc-300"
            >
              System Prompt
            </label>
            <Textarea
              id="system-prompt"
              placeholder="Enter the system prompt for Jenny AI..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="bg-zinc-800 border-zinc-700 overflow-y-auto"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-zinc-900/95 border-t border-border rounded-b-lg flex gap-4 pt-6">
          <Button
            type="submit"
            variant="secondary"
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            Save Configuration
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleStartTwilioCall}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            Start Twilio Call
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
