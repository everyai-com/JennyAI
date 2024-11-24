"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import { apiService } from "@/services/api";

import { UltravoxSession } from "ultravox-client";

export function CallInterface() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const sessionRef = useRef<UltravoxSession | null>(null);

  const handleStartCall = async () => {
    setIsCallActive(true);
    setTranscript([]);
    const call = await apiService.createCall();
    sessionRef.current = new UltravoxSession();
    sessionRef.current.joinCall(call.joinUrl);

    setTimeout(
      () => addToTranscript("Jenny: Hello! How can I assist you today?"),
      1000
    );
  };

  const handleEndCall = async () => {
    setIsCallActive(false);
    if (sessionRef.current) {
      await sessionRef.current.leaveCall();
    }
    addToTranscript("Call ended.");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const addToTranscript = (message: string) => {
    setTranscript((prev) => [...prev, message]);
  };

  return (
    <Card className="border-border h-fit">
      <CardHeader className="bg-gray-800 border-b-gray-700 border-border rounded-t-lg">
        <CardTitle className="text-zinc-50">Call Interface</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-zinc-900/95">
        <div className="bg-zinc-800 rounded-md p-4 h-64 overflow-y-auto mb-4 border border-zinc-700">
          {transcript.map((line, index) => (
            <p key={index} className="mb-2 text-zinc-300">
              {line}
            </p>
          ))}
          {isCallActive && (
            <p className="text-blue-400 animate-pulse">Listening...</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-zinc-900/95 border-t border-border rounded-b-lg p-4">
        <Button
          onClick={toggleMute}
          variant="secondary"
          className={`flex items-center ${
            isMuted
              ? "bg-red-900/50 text-red-400 hover:bg-red-900/70"
              : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
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
