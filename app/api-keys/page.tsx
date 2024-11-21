import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ApiKeys() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">API Keys</h1>
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl text-gray-800">Manage API Keys</CardTitle>
          <CardDescription>Add or update API keys for Jenny Voice AI</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <label htmlFor="api-key" className="block text-sm font-medium mb-1 text-gray-700">API Key</label>
            <Input id="api-key" placeholder="Enter your API key" className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save API Key</Button>
        </CardContent>
      </Card>
    </div>
  )
}

