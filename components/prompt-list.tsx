import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockPrompts = [
  { id: 1, title: "Introduction", category: "Opening" },
  { id: 2, title: "Product Pitch", category: "Sales" },
  { id: 3, title: "Objection Handling", category: "Negotiation" },
  { id: 4, title: "Closing", category: "Sales" },
]

export function PromptList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prompts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mockPrompts.map((prompt) => (
            <li key={prompt.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">{prompt.title}</h3>
                <p className="text-sm text-gray-500">{prompt.category}</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

