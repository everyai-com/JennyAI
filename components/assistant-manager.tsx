import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssistantStore } from "@/store/assistant-store";
import { useVoiceStore } from "@/store/voice-store";

export function AssistantManager() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { voices, currentVoice } = useVoiceStore();
  const { assistants, addAssistant, removeAssistant } = useAssistantStore();

  const handleCreateAssistant = async () => {
    if (!name || !currentVoice) return;

    const newAssistant = {
      id: Date.now().toString(),
      name,
      description,
      voice: currentVoice,
      model: "gpt-4", // default model
    };

    try {
      const response = await fetch("/api/assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssistant),
      });

      if (!response.ok) throw new Error("Failed to create assistant");

      const data = await response.json();
      addAssistant(data);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating assistant:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Assistant Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter assistant name"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <Button onClick={handleCreateAssistant}>Create Assistant</Button>
      </div>

      <div className="space-y-2">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="flex items-center justify-between p-4 border rounded"
          >
            <div>
              <h3 className="font-medium">{assistant.name}</h3>
              <p className="text-sm text-gray-500">{assistant.description}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeAssistant(assistant.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
