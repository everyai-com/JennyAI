import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PromptForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create/Edit Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Input id="title" placeholder="Enter prompt title" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opening">Opening</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Prompt Content</label>
            <Textarea id="content" placeholder="Enter prompt content" rows={5} />
          </div>
          <Button type="submit">Save Prompt</Button>
        </form>
      </CardContent>
    </Card>
  )
}

