"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { oauth2Client } from "@/lib/google-calendar.config";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/google/check");
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleAuth = async () => {
    window.location.href = "/api/auth/google";
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar");
      const data = await response.json();
      setEvents(data.items || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Calendar Access</h1>
        <Button onClick={handleAuth}>Connect Google Calendar</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar Events</h1>
      <div className="space-y-4">
        {events.map((event: any) => (
          <div key={event.id} className="p-4 border rounded">
            <h2 className="font-semibold">{event.summary}</h2>
            <p>{event.description}</p>
            <p>Start: {new Date(event.start.dateTime).toLocaleString()}</p>
            <p>End: {new Date(event.end.dateTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
