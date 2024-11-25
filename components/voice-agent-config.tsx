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
import { Input } from "./ui/input";
import { useVoices } from "@/hooks/use-voices";
import { Bot, useBotStore } from "@/store/bot-store";
import { useToast } from "@/components/ui/use-toast";
import { Voice, VoiceOption } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VoiceAgentConfigProps {
  bot: Bot;
}

export function VoiceAgentConfig({ bot }: VoiceAgentConfigProps) {
  const { updateBot, bots, deleteBot } = useBotStore();
  const { voices: voiceOptions, isLoading } = useVoices();
  const { toast } = useToast();

  // Initialize localSettings with all required fields
  const [localSettings, setLocalSettings] = useState({
    voice: bot.voice || { voiceId: "", name: "", previewUrl: "" },
    phoneNumber: bot.settings?.phoneNumber || "",
    systemPrompt: bot.settings?.systemPrompt || "",
  });

  // Update local settings when bot changes
  useEffect(() => {
    if (bot) {
      setLocalSettings({
        voice: bot.voice || { voiceId: "", name: "", previewUrl: "" },
        phoneNumber: bot.settings?.phoneNumber || "",
        systemPrompt: bot.settings?.systemPrompt || "",
      });
    }
  }, [bot.id]); // Only depend on bot.id to prevent unnecessary updates

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find the selected voice details from voiceOptions
      const selectedVoice = voiceOptions?.find(
        (v) => v.voiceId === localSettings.voice.voiceId
      );

      // Create the updated voice object
      const updatedVoice: Voice = {
        voiceId: selectedVoice?.voiceId || localSettings.voice.voiceId,
        name: selectedVoice?.name || localSettings.voice.name,
        previewUrl: selectedVoice?.previewUrl || localSettings.voice.previewUrl,
      };

      // Create the complete updated bot object
      const updatedBot: Bot = {
        ...bot,
        voice: updatedVoice,
        settings: {
          ...bot.settings,
          phoneNumber: localSettings.phoneNumber,
          systemPrompt: localSettings.systemPrompt,
        },
      };

      // Update the bot in the store
      updateBot(bot.id, updatedBot);

      toast({
        title: "Success",
        description: "Assistant configuration saved successfully",
      });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteBot(bot.id);
      toast({
        title: "Success",
        description: "Assistant deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete assistant:", error);
      toast({
        title: "Error",
        description: "Failed to delete assistant",
        variant: "destructive",
      });
    }
  };

  // Log current state for debugging
  useEffect(() => {
    console.log("Current bot settings:", bot.settings);
    console.log("Local settings:", localSettings);
  }, [bot.settings, localSettings]);

  return (
    <Card className="border-border">
      <CardHeader className="bg-gray-800 border-b-gray-700 border-border rounded-t-lg">
        <CardTitle className="text-zinc-50">Configure {bot.name}</CardTitle>
        <CardDescription className="text-zinc-400">
          Customize your assistant's behavior and voice
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
            <Select
              value={localSettings?.voice?.voiceId}
              onValueChange={(value) => {
                const selectedVoice = voiceOptions?.find(
                  (v) => v.voiceId === value
                );
                setLocalSettings({
                  ...localSettings,
                  voice: {
                    voiceId: selectedVoice?.voiceId || "",
                    name: selectedVoice?.name || "",
                    previewUrl: selectedVoice?.previewUrl || "",
                  },
                });
              }}
            >
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 max-w-screen-sm">
                {voiceOptions?.map((option: VoiceOption) => (
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
              value={localSettings.phoneNumber}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  phoneNumber: e.target.value,
                })
              }
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
              placeholder={`Enter the system prompt for ${bot.name}...`}
              value={localSettings.systemPrompt}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  systemPrompt: e.target.value,
                })
              }
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

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive" className="flex-1">
                Delete Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 text-white">
              <DialogHeader>
                <DialogTitle>Delete Assistant</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Are you sure you want to delete {bot.name}? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </form>
    </Card>
  );
}
