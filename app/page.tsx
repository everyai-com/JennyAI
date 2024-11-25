"use client";

import Template from "@/components/template";
import { useBotStore } from "@/store/bot-store";
import { useVoices } from "@/hooks/use-voices";
import { Button } from "@/components/ui/button";
import { VoiceAgentConfig } from "@/components/voice-agent-config";
import { CallInterface } from "@/components/call-interface";
import { Plus, Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Voice } from "@/types";

export default function Home() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { bots, addBot, activeBotId, setActiveBotId, updateBot } =
    useBotStore();
  const { voices, isLoading: voicesLoading } = useVoices();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeBot = bots.find((bot) => bot.id === activeBotId);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  if (isLoginPage) {
    return null;
  }

  const handleCreateBot = () => {
    if (!newBotName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a bot name",
        variant: "destructive",
      });
      return;
    }

    const firstVoice = voices?.[0];
    const defaultVoice: Voice = {
      voiceId: firstVoice?.voiceId || "",
      name: firstVoice?.name || "",
      previewUrl: firstVoice?.previewUrl || "",
    };

    const newBot = {
      id: Date.now().toString(),
      name: newBotName,
      description: `AI Assistant - ${newBotName}`,
      voice: defaultVoice,
      model: "gpt-4",
      avatar: "",
      status: "online" as const,
      stats: {
        totalCalls: 0,
        totalDuration: 0,
        successRate: 0,
      },
      settings: {
        greeting: "",
        language: "en-US",
        personality: "professional",
        responseTime: 1000,
        systemPrompt: "",
        phoneNumber: "",
        appointmentBooking: {
          enabled: false,
          calendarId: "",
          availabilityStart: "09:00",
          availabilityEnd: "17:00",
          appointmentDuration: 30,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      conversationHistory: [],
    };

    addBot(newBot);
    setActiveBotId(newBot.id);
    setIsCreateDialogOpen(false);
    setNewBotName("");

    toast({
      title: "Success",
      description:
        "New bot created successfully. Please configure its voice and system prompt.",
    });
  };

  return (
    <Template>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              AI Assistant Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure and manage your AI assistants
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Assistant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assistant</DialogTitle>
                <DialogDescription>
                  Give your new AI assistant a name to get started
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Assistant Name</Label>
                  <Input
                    id="name"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    placeholder="Enter assistant name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateBot}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {bots.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Assistants Yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first AI assistant to get started
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Assistant
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Label>Select Active Assistant</Label>
              <select
                value={activeBotId || ""}
                onChange={(e) => setActiveBotId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-2"
              >
                <option value="">Select an assistant</option>
                {bots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>
            </div>

            {activeBot ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <VoiceAgentConfig bot={activeBot} />
                <CallInterface bot={activeBot} />
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Select an assistant to view configuration
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Template>
  );
}
