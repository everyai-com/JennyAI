import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "'recharts'"

const data = [
  { name: "'Mon'", prompts: 4 },
  { name: "'Tue'", prompts: 3 },
  { name: "'Wed'", prompts: 2 },
  { name: "'Thu'", prompts: 6 },
  { name: "'Fri'", prompts: 8 },
  { name: "'Sat'", prompts: 5 },
  { name: "'Sun'", prompts: 3 },
]

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prompts" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

