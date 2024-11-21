"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SystemPromptForm() {
  const [systemPrompt, setSystemPrompt] = useState("")
  const [voice, setVoice] = useState("Mark")
  const [language, setLanguage] = useState("English")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("System prompt saved:", systemPrompt)
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>System Prompt</CardTitle>
        <CardDescription>Define the behavior and knowledge of Jenny AI</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="voice" className="block text-sm font-medium mb-1">Voice</label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mark">Mark</SelectItem>
                <SelectItem value="Emma">Emma</SelectItem>
                <SelectItem value="Sophia">Sophia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium mb-1">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Enter the system prompt for Jenny AI..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="w-full p-2 border border-zinc-200 rounded dark:border-zinc-800"
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save System Prompt</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

