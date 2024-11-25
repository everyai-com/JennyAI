"use client";

import { useEffect } from "react";
import { useAssistantStore } from "@/store/assistant-store";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bot, Trash2, Edit2, MessageSquare } from "lucide-react";
import { useState } from "react";
import Template from "@/components/template";
import { useToast } from "@/components/ui/use-toast";
import { useVoices } from "@/hooks/use-voices";

interface AssistantFormData {
  name: string;
  description: string;
  prompt: string;
  model: string;
  voice: string;
}

export default function AssistantsPage() {
  const { assistants, addAssistant, removeAssistant } = useAssistantStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AssistantFormData>({
    name: "",
    description: "",
    prompt: "",
    model: "gpt-4",
    voice: "alloy", // default voice
  });
  const { toast } = useToast();
  const { voices, isLoading: voicesLoading } = useVoices();

  useEffect(() => {
    // Fetch assistants on page load
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await fetch("/api/assistants");
      const data = await response.json();
      useAssistantStore.getState().setAssistants(data.assistants);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };

  const handleCreateAssistant = async () => {
    try {
      const response = await fetch("/api/assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create assistant");

      const data = await response.json();
      addAssistant(data);
      setIsCreateDialogOpen(false);
      resetForm();

      toast({
        title: "Success",
        description: "Assistant created successfully",
      });
    } catch (error) {
      console.error("Error creating assistant:", error);
      toast({
        title: "Error",
        description: "Failed to create assistant",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      prompt: "",
      model: "gpt-4",
      voice: "alloy",
    });
  };

  return (
    <Template>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Assistants
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your AI assistants and their configurations
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Assistant</DialogTitle>
                <DialogDescription>
                  Configure your new AI assistant's settings and behavior
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Assistant name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) =>
                      setFormData({ ...formData, prompt: e.target.value })
                    }
                    placeholder="Enter the system prompt for your assistant..."
                    className="h-32"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model</Label>
                    <select
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="voice">Voice</Label>
                    <select
                      id="voice"
                      value={formData.voice}
                      onChange={(e) =>
                        setFormData({ ...formData, voice: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      disabled={voicesLoading}
                    >
                      {voicesLoading ? (
                        <option>Loading voices...</option>
                      ) : voices.length > 0 ? (
                        voices.map((voice) => (
                          <option key={voice.id} value={voice.id}>
                            {voice.name} ({voice.language})
                          </option>
                        ))
                      ) : (
                        <option>No voices available</option>
                      )}
                    </select>
                    {voicesLoading && (
                      <p className="text-sm text-muted-foreground">
                        Loading available voices...
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateAssistant}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((assistant) => (
            <Card key={assistant.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <CardTitle>{assistant.name}</CardTitle>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeAssistant(assistant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>{assistant.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Model:</span>{" "}
                    {assistant.model}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Voice:</span>{" "}
                    {assistant.voice}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Prompt:</span>
                    <p className="mt-1 text-gray-500 dark:text-gray-400 line-clamp-3">
                      {assistant.prompt}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Template>
  );
}
