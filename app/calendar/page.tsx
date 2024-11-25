"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { CalendarAgent } from "@/components/calendar-agent";
import Template from "@/components/template";
import { Phone, PhoneOff } from "lucide-react";
import { useVoices } from "@/hooks/use-voices";

interface BookingDialog {
  isOpen: boolean;
  date: Date | null;
  startTime: string;
  endTime: string;
}

interface EventDetailsDialog {
  isOpen: boolean;
  event: any;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  extendedProps: {
    description: string;
    customerEmail: string;
    customerName: string;
  };
}

interface CallState {
  isInCall: boolean;
  isCalling: boolean;
  callStatus: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingDialog, setBookingDialog] = useState<BookingDialog>({
    isOpen: false,
    date: null,
    startTime: "",
    endTime: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [eventDetailsDialog, setEventDetailsDialog] =
    useState<EventDetailsDialog>({
      isOpen: false,
      event: null,
    });
  const [eventTitle, setEventTitle] = useState("");
  const { toast } = useToast();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isCalling: false,
    callStatus: "",
  });
  const deviceRef = useRef<any>(null);
  const { voices } = useVoices();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [date]);

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
      setIsLoading(true);
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const formattedEvents = (data.items || []).map((event: any) => ({
        id: event.id,
        title: event.summary || "Untitled Event",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        status: event.metadata?.status || "confirmed",
        extendedProps: {
          description: event.description,
          customerEmail: event.attendees?.[0]?.email,
          customerName:
            event.description?.split("with ")?.[1] || "No name provided",
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (arg: any) => {
    setBookingDialog({
      isOpen: true,
      date: arg.date,
      startTime: "",
      endTime: "",
    });
  };

  const handleBookingSubmit = async () => {
    if (
      !bookingDialog.date ||
      !bookingDialog.startTime ||
      !bookingDialog.endTime ||
      !eventTitle ||
      !customerEmail
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, email, times)",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsActionLoading(true);

      const startDate = new Date(bookingDialog.date);
      const [startHours, startMinutes] = bookingDialog.startTime.split(":");
      startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endDate = new Date(bookingDialog.date);
      const [endHours, endMinutes] = bookingDialog.endTime.split(":");
      endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: eventTitle,
          description: `Appointment with ${customerName || "Guest"}`,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          attendees: [customerEmail],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create appointment");
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      setBookingDialog({
        isOpen: false,
        date: null,
        startTime: "",
        endTime: "",
      });
      setEventTitle("");
      setCustomerName("");
      setCustomerEmail("");

      await fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEventClick = (arg: any) => {
    setEventDetailsDialog({
      isOpen: true,
      event: {
        id: arg.event.id,
        title: arg.event.title,
        start: arg.event.start,
        end: arg.event.end,
        description: arg.event.extendedProps.description,
        customerEmail: arg.event.extendedProps.customerEmail,
      },
    });
  };

  const handleDeleteAppointment = async (eventId: string) => {
    try {
      setIsActionLoading(true);
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to delete appointment");
      }

      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });

      await fetchEvents(); // Refresh events list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete appointment",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
      setEventDetailsDialog({ isOpen: false, event: null }); // Close the dialog after deletion
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventDetailsDialog.event?.id) return;

    try {
      setIsActionLoading(true);
      const response = await fetch(
        `/api/calendar/${eventDetailsDialog.event.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to delete event");
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      setEventDetailsDialog({ isOpen: false, event: null });
      await fetchEvents(); // Refresh events list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBookAppointment = async (selectedDate: Date) => {
    try {
      setIsActionLoading(true);
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      await fetchEvents(); // Refresh events
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatEventDate = (dateTime: string | undefined) => {
    if (!dateTime) return "No date available";
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "PPP");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleStatusUpdate = async (eventId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const response = await fetch(`/api/calendar/${eventId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, status: newStatus as CalendarEvent["status"] }
            : event
        )
      );

      toast({
        title: "Success",
        description: "Appointment status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStartCall = async (customerEmail: string) => {
    try {
      setCallState((prev) => ({ ...prev, isCalling: true }));

      // First, get a token
      const tokenResponse = await fetch("/api/twilio/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity: "host" }), // You might want to use a real identity here
      });

      if (!tokenResponse.ok) throw new Error("Failed to get token");
      const { token } = await tokenResponse.json();

      // Initialize Twilio device
      const Device = (window as any).Twilio.Device;
      deviceRef.current = new Device(token, {
        debug: true,
      });

      // Setup device event handlers
      deviceRef.current.on("ready", () => {
        // Make the call
        const call = deviceRef.current.connect({
          params: {
            customerEmail,
          },
        });

        call.on("accept", () => {
          setCallState((prev) => ({
            ...prev,
            isInCall: true,
            isCalling: false,
            callStatus: "Connected",
          }));
        });

        call.on("disconnect", () => {
          setCallState((prev) => ({
            ...prev,
            isInCall: false,
            isCalling: false,
            callStatus: "",
          }));
        });
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive",
      });
      setCallState((prev) => ({
        ...prev,
        isCalling: false,
        callStatus: "Failed",
      }));
    }
  };

  const handleEndCall = useCallback(() => {
    if (deviceRef.current) {
      deviceRef.current.disconnectAll();
      setCallState((prev) => ({
        ...prev,
        isInCall: false,
        callStatus: "",
      }));
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Template>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Calendar Access
            </h1>
            <p className="text-gray-600 mb-6">
              Connect your Google Calendar to manage appointments
            </p>
            <Button
              onClick={handleAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Connect Google Calendar
            </Button>
          </div>
        </div>
      </Template>
    );
  }

  if (isLoading) {
    return (
      <Template>
        <div className="p-8 max-w-4xl mx-auto">
          <Skeleton className="h-[500px] w-full rounded-xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-background dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">
            Appointment Calendar
          </h1>
          <div className="relative">
            {isActionLoading && (
              <div className="absolute inset-0 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            )}
            <div className="dark:bg-gray-800 rounded-lg shadow-sm">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                dateClick={handleDateClick}
                eventClick={(arg) => {
                  setEventDetailsDialog({
                    isOpen: true,
                    event: {
                      id: arg.event.id,
                      title: arg.event.title,
                      start: arg.event.start,
                      end: arg.event.end,
                      description: arg.event.extendedProps.description,
                      customerEmail: arg.event.extendedProps.customerEmail,
                    },
                  });
                }}
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                slotDuration="00:30:00"
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                  startTime: "08:00",
                  endTime: "20:00",
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-background dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-gray-100">
              Appointments
            </h2>
            <Button
              onClick={() =>
                setBookingDialog({
                  isOpen: true,
                  date: new Date(),
                  startTime: "",
                  endTime: "",
                })
              }
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
            >
              New Appointment
            </Button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 dark:bg-gray-700/50 rounded-lg">
              <p className="dark:text-gray-300 text-lg">
                No appointments scheduled
              </p>
              <p className="dark:text-gray-400 mt-2">
                Click 'New Appointment' to schedule one
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events?.map((event: CalendarEvent) => (
                <div
                  key={event.id}
                  className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow dark:bg-gray-700/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium dark:text-gray-100">
                          {event.title}
                        </p>
                        <StatusBadge status={event.status} />
                      </div>
                      <div className="text-sm dark:text-gray-400 space-y-1">
                        <p>{formatEventDate(event.start)}</p>
                        <p>Customer: {event.extendedProps.customerName}</p>
                        <p>Email: {event.extendedProps.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setEventDetailsDialog({ isOpen: true, event })
                        }
                        className="dark:text-gray-300 dark:hover:text-gray-100 dark:border-gray-600"
                      >
                        Details
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAppointment(event.id)}
                        disabled={isActionLoading}
                        className="dark:bg-red-500/90 dark:hover:bg-red-600 dark:text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog
          open={bookingDialog.isOpen}
          onOpenChange={(open) =>
            setBookingDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="dark:bg-gray-800 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold dark:text-gray-100">
                Book Appointment
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Create a new appointment for{" "}
                {bookingDialog.date?.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="eventTitle" className="required">
                  Event Title
                </Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full"
                  placeholder="Enter customer name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerEmail" className="required">
                  Customer Email
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full"
                  placeholder="Enter customer email"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime" className="required">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={bookingDialog.startTime}
                    onChange={(e) =>
                      setBookingDialog((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime" className="required">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={bookingDialog.endTime}
                    onChange={(e) =>
                      setBookingDialog((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setBookingDialog((prev) => ({ ...prev, isOpen: false }));
                  setEventTitle("");
                  setCustomerName("");
                  setCustomerEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={
                  !eventTitle ||
                  !customerEmail ||
                  !bookingDialog.startTime ||
                  !bookingDialog.endTime
                }
              >
                Book Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={eventDetailsDialog.isOpen}
          onOpenChange={(open) =>
            setEventDetailsDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="dark:bg-gray-800 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold dark:text-gray-100">
                Appointment Details
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium dark:text-gray-300">
                  Title
                </Label>
                <div className="col-span-3 dark:text-gray-100">
                  {eventDetailsDialog.event?.title}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium dark:text-gray-300">
                  Customer
                </Label>
                <div className="col-span-3 dark:text-gray-100">
                  {eventDetailsDialog.event?.extendedProps?.customerName}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium dark:text-gray-300">
                  Email
                </Label>
                <div className="col-span-3 dark:text-gray-100">
                  {eventDetailsDialog.event?.extendedProps?.customerEmail}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium dark:text-gray-300">
                  Start
                </Label>
                <div className="col-span-3 dark:text-gray-100">
                  {formatEventDate(eventDetailsDialog.event?.start)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium dark:text-gray-300">
                  End
                </Label>
                <div className="col-span-3 dark:text-gray-100">
                  {formatEventDate(eventDetailsDialog.event?.end)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              {!callState.isInCall ? (
                <Button
                  onClick={() =>
                    handleStartCall(
                      eventDetailsDialog.event?.extendedProps?.customerEmail
                    )
                  }
                  disabled={
                    callState.isCalling ||
                    !eventDetailsDialog.event?.extendedProps?.customerEmail
                  }
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {callState.isCalling ? "Connecting..." : "Start Call"}
                </Button>
              ) : (
                <Button
                  onClick={handleEndCall}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </Button>
              )}
              {callState.callStatus && (
                <span className="text-sm text-muted-foreground">
                  {callState.callStatus}
                </span>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                className="dark:bg-red-500/90 dark:hover:bg-red-600"
              >
                Delete Appointment
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEventDetailsDialog({ isOpen: false, event: null })
                }
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            AI Scheduling Assistant
          </h2>
          <CalendarAgent />
        </div>
      </div>
    </Template>
  );
}
