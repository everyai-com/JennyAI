import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { DebugVoices } from "@/components/debug-voices";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jenny AI Dashboard",
  description: "Configure and manage your AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="//sdk.twilio.com/js/client/releases/1.13.1/twilio.min.js"></script>
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "dark:bg-gray-900 dark:text-gray-100",
          `${inter.className} dark:bg-gray-900 dark:text-gray-100`
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

