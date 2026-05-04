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
  const totalSent = data.reduce((acc, d) => acc + d.sent, 0)
  const totalFailed = data.reduce((acc, d) => acc + d.failed, 0)

  return (
    <Card
      className="border-slate-200/70 shadow-sm overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)' }}
    >
      <CardHeader className="border-b border-slate-100/80 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Delivery Analytics
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Last 7 days overview</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900 font-heading tabular-nums">
                {totalSent.toLocaleString()}
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                Sent
              </div>
            </div>
            {totalFailed > 0 && (
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900 font-heading tabular-nums">
                  {totalFailed.toLocaleString()}
                </div>
                <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                  Failed
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 px-3">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="38%" barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
                width={28}
                tick={{ fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(241,245,249,0.8)', radius: 4 }}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '10px 14px',
                }}
                labelStyle={{ color: '#475569', fontWeight: 600, marginBottom: 4 }}
              />
              <Legend
                verticalAlign="top"
                height={32}
                wrapperStyle={{ fontSize: '12px', paddingBottom: '4px' }}
                formatter={(value) => (
                  <span style={{ color: '#64748b', fontWeight: 500 }}>{value}</span>
                )}
              />
              <Bar
                dataKey="sent"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                name="Sent"
                maxBarSize={40}
              />
              <Bar
                dataKey="failed"
                fill="#f87171"
                radius={[5, 5, 0, 0]}
                name="Failed"
                maxBarSize={40}
                fillOpacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
