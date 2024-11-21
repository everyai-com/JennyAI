"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";

export function CallInterface() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const handleStartCall = () => {
    setIsCallActive(true);
    setTranscript([]);
    // Simulate conversation
    setTimeout(
      () => addToTranscript("Jenny: Hello! How can I assist you today?"),
      1000
    );
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    addToTranscript("Call ended.");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const addToTranscript = (message: string) => {
    setTranscript((prev) => [...prev, message]);
  };

  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl text-gray-800">Call Interface</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-gray-100 rounded-md p-4 h-64 overflow-y-auto mb-4 border border-zinc-200 border-gray-200 dark:border-zinc-800">
          {transcript.map((line, index) => (
            <p key={index} className="mb-2">
              {line}
            </p>
          ))}
          {isCallActive && (
            <p className="text-blue-600 animate-pulse">Listening...</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 border-t border-gray-200 p-4">
        <Button
          onClick={toggleMute}
          variant="outline"
          className={`flex items-center ${
            isMuted
              ? "'bg-red-100 text-red-600 border-red-200'"
              : "'bg-gray-100 border-gray-200'"
          }`}
          disabled={!isCallActive}
        >
          {isMuted ? (
            <MicOff className="mr-2 h-4 w-4" />
          ) : (
            <Mic className="mr-2 h-4 w-4" />
          )}
          {isMuted ? "'Unmute'" : "'Mute'"}
        </Button>
        <Button
          onClick={isCallActive ? handleEndCall : handleStartCall}
          className={`flex items-center ${
            isCallActive
              ? "'bg-red-600 hover:bg-red-700'"
              : "'bg-green-600 hover:bg-green-700'"
          } text-white`}
        >
          {isCallActive ? (
            <PhoneOff className="mr-2 h-4 w-4" />
          ) : (
            <PhoneCall className="mr-2 h-4 w-4" />
          )}
          {isCallActive ? "'End Call'" : "'Start Call'"}
        </Button>
      </CardFooter>
    </Card>
  );
}
