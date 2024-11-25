import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Template from "@/components/template";

export default function ApiKeys() {
  return (
    <Template>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">API Keys</h1>
        <Card className="border-border">
          <CardHeader className="bg-gray-800 border-b border-border rounded-t-lg">
            <CardTitle className="text-xl text-zinc-50">
              Manage API Keys
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Add or update API keys for Jenny Voice AI
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-zinc-900/95 rounded-b-lg">
            <div className="mb-4">
              <label
                htmlFor="api-key"
                className="block text-sm font-medium mb-1 text-zinc-300"
              >
                API Key
              </label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                className="w-full bg-zinc-800 border-zinc-700"
              />
            </div>
            <Button className="w-full !bg-blue-600 hover:!bg-blue-700 text-white">
              Save API Key
            </Button>
          </CardContent>
        </Card>
      </div>
    </Template>
  );
}

