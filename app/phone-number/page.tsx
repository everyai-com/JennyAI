import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Template from "@/components/template";

export default function PhoneNumber() {
  return (
    <Template>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Phone Number Configuration
        </h1>
        <Card className="border-border">
          <CardHeader className="bg-gray-800 border-b-gray-700 border-border rounded-t-lg">
            <CardTitle className="text-zinc-50">
              Configure Twilio Integration
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Set up the phone number for Jenny Voice AI using Twilio
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-zinc-900/95 rounded-b-lg">
            <div>
              <label
                htmlFor="twilio-number"
                className="block text-sm font-medium mb-1 text-zinc-300"
              >
                Twilio Number
              </label>
              <Input
                id="twilio-number"
                placeholder="Enter your Twilio number"
                className="bg-zinc-800 border-zinc-700 w-full"
              />
            </div>
            <div>
              <label
                htmlFor="twilio-sid"
                className="block text-sm font-medium mb-1 text-zinc-300"
              >
                Twilio SID
              </label>
              <Input
                id="twilio-sid"
                placeholder="Enter your Twilio SID"
                className="bg-zinc-800 border-zinc-700 w-full"
              />
            </div>
            <div>
              <label
                htmlFor="twilio-auth-token"
                className="block text-sm font-medium mb-1 text-zinc-300"
              >
                Twilio Auth Token
              </label>
              <Input
                id="twilio-auth-token"
                placeholder="Enter your Twilio Auth Token"
                className="bg-zinc-800 border-zinc-700 w-full"
              />
            </div>
            <Button className="w-full !bg-blue-600 hover:!bg-blue-700 text-white">
              Save Twilio Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </Template>
  );
}

