"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function CalendarAgent() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<string[]>([]);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      setConversation((prev) => [...prev, `You: ${message}`]);

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setConversation((prev) => [...prev, `Assistant: ${data.response}`]);
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="mb-4 h-[300px] overflow-y-auto space-y-2">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.startsWith("You:") ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
