import Link from "next/link";
import { Bot, CalendarIcon, Key, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 h-screen dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-xl font-semibold dark:text-gray-100">Jenny AI</h1>
        <Button
          variant="ghost"
          size="sm"
          className="dark:text-gray-300 dark:hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <nav className="space-y-1 px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          <Bot className="h-4 w-4" />
          <span>Assistant</span>
        </Link>
        <Link
          href="/api-keys"
          className="flex items-center space-x-2 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          <Key className="h-4 w-4" />
          <span>API Keys</span>
        </Link>
        <Link
          href="/phone-number"
          className="flex items-center space-x-2 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span>Phone Number</span>
        </Link>
        <Link
          href="/calendar"
          className="flex items-center space-x-2 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Calendar</span>
        </Link>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <Button
          variant="outline"
          className="w-full dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:border-gray-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>
    </div>
  );
}
