import Link from "next/link";
import { Bot, CalendarIcon, Key, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Jenny AI</h1>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <nav className="space-y-1 flex-1">
        <Link
          href="/"
          className="flex items-center space-x-2 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        >
          <Bot className="h-4 w-4" />
          <span>Assistant</span>
        </Link>
        <Link
          href="/api-keys"
          className="flex items-center space-x-2 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        >
          <Key className="h-4 w-4" />
          <span>API Keys</span>
        </Link>
        <Link
          href="/phone-number"
          className="flex items-center space-x-2 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        >
          <Phone className="h-4 w-4" />
          <span>Phone Number</span>
        </Link>

        <Link
          href="/calendar"
          className="flex items-center p-2 hover:bg-gray-700 rounded"
        >
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span>Calendar</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>
    </div>
  );
}
