"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function ChatInterface() {
  const [message, setMessage] = useState("")
  const [chatLog, setChatLog] = useState<string[]>([])

  const handleSend = () => {
    if (message.trim()) {
      setChatLog([...chatLog, `You: ${message}`])
      setMessage("")
      // Simulate AI response
      setTimeout(() => {
        setChatLog((prev) => [...prev, "Jenny AI: This is a simulated response."])
      }, 1000)
    }
  }

  return (
    <Card className="bg-white shadow-md h-full">
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {chatLog.map((entry, index) => (
            <div key={index} className="mb-2">
              {entry}
            </div>
          ))}
        </div>
        <CardFooter className="flex items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 mr-2"
          />
          <Button onClick={handleSend}>Send</Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

