import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PhoneNumber() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Phone Number Configuration</h1>
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl text-gray-800">Configure Twilio Integration</CardTitle>
          <CardDescription>Set up the phone number for Jenny Voice AI using Twilio</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label htmlFor="twilio-number" className="block text-sm font-medium mb-1 text-gray-700">Twilio Number</label>
            <Input id="twilio-number" placeholder="Enter your Twilio number" className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="twilio-sid" className="block text-sm font-medium mb-1 text-gray-700">Twilio SID</label>
            <Input id="twilio-sid" placeholder="Enter your Twilio SID" className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="twilio-auth-token" className="block text-sm font-medium mb-1 text-gray-700">Twilio Auth Token</label>
            <Input id="twilio-auth-token" placeholder="Enter your Twilio Auth Token" className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Twilio Configuration</Button>
        </CardContent>
      </Card>
    </div>
  )
}

