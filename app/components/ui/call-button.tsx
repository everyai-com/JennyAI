"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CallButtonProps {
  className?: string;
}

export function CallButton({ className }: CallButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCall = async () => {
    try {
      setIsLoading(true);

      if (isConnected) {
        // End call logic
        const response = await fetch("/api/twilio/voice", {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to end call");
        }

        setIsConnected(false);
        toast({
          title: "Call ended",
          description: "The call has been disconnected",
        });
      } else {
        // Start call logic
        const response = await fetch("/api/twilio/voice", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to start call");
        }

        const data = await response.json();

        if (data.token) {
          setIsConnected(true);
          toast({
            title: "Call connected",
            description: "You are now in a call",
          });
        }
      }
    } catch (error) {
      console.error("Error handling call:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to handle call operation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCall}
      size="icon"
      variant={isConnected ? "destructive" : "default"}
      className={`h-12 w-12 rounded-full ${className}`}
      disabled={isLoading}
    >
      {isConnected ? (
        <PhoneOff className="h-6 w-6" />
      ) : (
        <Phone className="h-6 w-6" />
      )}
    </Button>
  );
}
