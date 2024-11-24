import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jenny AI Dashboard",
  description: "Configure and manage your AI assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-white">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}

