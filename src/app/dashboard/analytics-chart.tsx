'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsChartProps {
  data: {
    date: string
    sent: number
    failed: number
  }[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Delivery Analytics (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar
                dataKey="sent"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                name="Sent Successfully"
              />
              <Bar
                dataKey="failed"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Failed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
