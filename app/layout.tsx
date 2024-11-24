import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" className="dark">
      <body
        className={`${inter.className} dark:bg-gray-900 dark:text-gray-100`}
      >
        <div className="flex h-screen dark:bg-gray-900">
          <Sidebar />
          <main className="flex-1 overflow-y-auto dark:bg-gray-900">
            <Providers>{children}</Providers>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

