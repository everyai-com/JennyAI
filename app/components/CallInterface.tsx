"use client";
import { CallButton } from "./ui/call-button";

export function CallInterface() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center space-y-4">
        <CallButton />
        <span className="text-sm text-muted-foreground">Click to call</span>
      </div>
    </div>
  );
}
