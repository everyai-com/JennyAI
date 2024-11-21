import { useState } from "'react'"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AgentConfig() {
  const [model, setModel] = useState("'gpt-4'")

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Configure AI Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label htmlFor="agent-id" className="block text-sm font-medium mb-1">Agent ID</label>
            <Input id="agent-id" placeholder="Enter agent ID" className="bg-gray-700 text-white border-gray-600" />
          </div>
          <div>
            <label htmlFor="first-message" className="block text-sm font-medium mb-1">First Message</label>
            <Textarea 
              id="first-message" 
              placeholder="Enter first message" 
              rows={3} 
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="system-prompt" className="block text-sm font-medium mb-1">System Prompt</label>
            <Textarea 
              id="system-prompt" 
              placeholder="Enter system prompt" 
              rows={5}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium mb-1">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-2">Claude 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium mb-1">Temperature</label>
            <Input 
              id="temperature" 
              type="number" 
              min="0" 
              max="1" 
              step="0.1" 
              placeholder="Enter temperature (0-1)"
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <Button type="submit" className="w-full">Save Configuration</Button>
        </form>
      </CardContent>
    </Card>
  )
}

