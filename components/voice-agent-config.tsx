"use client";

import { useEffect, useState, memo } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VoiceAgentConfigProps {
  bot: Bot;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = memo(({ isOpen, onToggle }: SidebarProps) => {
  return (
    <div className={`transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <button onClick={onToggle}>{/* Your toggle button content */}</button>
      {/* Rest of your sidebar content */}
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export function VoiceAgentConfig({ bot }: VoiceAgentConfigProps) {
  const { updateBot, bots, deleteBot } = useBotStore();
  const { voices: voiceOptions, isLoading } = useVoices();
  const { toast } = useToast();

  // Initialize localSettings with all required fields
  const [localSettings, setLocalSettings] = useState({
    voice: bot.voice || { voiceId: "", name: "", previewUrl: "" },
    phoneNumber: bot.settings?.phoneNumber || "",
    systemPrompt: bot.settings?.systemPrompt || "",
    appointmentBooking: {
      enabled: bot.settings?.appointmentBooking?.enabled || false,
      calendarId: bot.settings?.appointmentBooking?.calendarId || "",
      availabilityStart:
        bot.settings?.appointmentBooking?.availabilityStart || "09:00",
      availabilityEnd:
        bot.settings?.appointmentBooking?.availabilityEnd || "17:00",
      appointmentDuration:
        bot.settings?.appointmentBooking?.appointmentDuration || 30,
      timezone:
        bot.settings?.appointmentBooking?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  // Update local settings when bot changes
  useEffect(() => {
    if (bot) {
      setLocalSettings({
        voice: bot.voice || { voiceId: "", name: "", previewUrl: "" },
        phoneNumber: bot.settings?.phoneNumber || "",
        systemPrompt: bot.settings?.systemPrompt || "",
        appointmentBooking: {
          enabled: bot.settings?.appointmentBooking?.enabled || false,
          calendarId: bot.settings?.appointmentBooking?.calendarId || "",
          availabilityStart:
            bot.settings?.appointmentBooking?.availabilityStart || "09:00",
          availabilityEnd:
            bot.settings?.appointmentBooking?.availabilityEnd || "17:00",
          appointmentDuration:
            bot.settings?.appointmentBooking?.appointmentDuration || 30,
          timezone:
            bot.settings?.appointmentBooking?.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
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
          appointmentBooking: localSettings.appointmentBooking,
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

          <Accordion type="single" collapsible className="w-full border-none">
            <AccordionItem value="appointment-settings" className="border-none">
              <AccordionTrigger className="text-zinc-300 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Appointment Booking Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Main Toggle Section */}
                <div className="mb-6 p-4 bg-gradient-to-b from-zinc-800/40 to-zinc-800/20 rounded-xl border border-zinc-700/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <svg
                          className="w-5 h-5 text-zinc-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-zinc-100 font-medium">
                          Appointment Scheduling
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Enable calendar integration for bookings
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="appointment-enabled"
                      checked={localSettings.appointmentBooking.enabled}
                      onCheckedChange={(checked) =>
                        setLocalSettings({
                          ...localSettings,
                          appointmentBooking: {
                            ...localSettings.appointmentBooking,
                            enabled: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {localSettings.appointmentBooking.enabled && (
                  <div className="space-y-6">
                    {/* Calendar ID Section */}
                    <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                        <Label className="text-zinc-200 font-medium">
                          Calendar ID
                        </Label>
                      </div>
                      <Input
                        value={localSettings.appointmentBooking.calendarId}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            appointmentBooking: {
                              ...localSettings.appointmentBooking,
                              calendarId: e.target.value,
                            },
                          })
                        }
                        className="bg-zinc-800/40 border-zinc-700/50 focus:border-blue-500/50 focus:ring-blue-500/20"
                        placeholder="your.calendar@gmail.com"
                      />
                    </div>

                    {/* Business Hours Section */}
                    <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                          <svg
                            className="w-4 h-4 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <Label className="text-zinc-200 font-medium">
                          Business Hours
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-zinc-400">
                            Start Time
                          </Label>
                          <Input
                            type="time"
                            value={
                              localSettings.appointmentBooking.availabilityStart
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                appointmentBooking: {
                                  ...localSettings.appointmentBooking,
                                  availabilityStart: e.target.value,
                                },
                              })
                            }
                            className="bg-zinc-800/40 border-zinc-700/50 focus:border-purple-500/50 focus:ring-purple-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-zinc-400">
                            End Time
                          </Label>
                          <Input
                            type="time"
                            value={
                              localSettings.appointmentBooking.availabilityEnd
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                appointmentBooking: {
                                  ...localSettings.appointmentBooking,
                                  availabilityEnd: e.target.value,
                                },
                              })
                            }
                            className="bg-zinc-800/40 border-zinc-700/50 focus:border-purple-500/50 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Duration Section */}
                    <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                          <svg
                            className="w-4 h-4 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <Label className="text-zinc-200 font-medium">
                          Duration
                        </Label>
                      </div>
                      <Select
                        value={localSettings.appointmentBooking.appointmentDuration.toString()}
                        onValueChange={(value) =>
                          setLocalSettings({
                            ...localSettings,
                            appointmentBooking: {
                              ...localSettings.appointmentBooking,
                              appointmentDuration: parseInt(value),
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-full bg-zinc-800/40 border-zinc-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20">
                          <SelectValue placeholder="Select appointment length" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Help Text */}
                    <div className="px-4 py-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-blue-400 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-blue-300">
                        Your assistant will only schedule appointments during
                        business hours and according to the specified duration.
                      </p>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
