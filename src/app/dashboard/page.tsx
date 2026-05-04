import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Send, Clock, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format, subDays, startOfDay } from 'date-fns'
import { RunNowButton } from './run-now-button'
import { AnalyticsChart } from './analytics-chart'
import { DashboardControls } from './dashboard-controls'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = await createClient()
  const query = searchParams.q || ''

  const { count: total } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })

  const { count: sent } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent')

  const { count: pending } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: failed } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed')

  let contactsQuery = supabase.from('contacts').select('*, campaigns(name)')
  if (query) {
    contactsQuery = contactsQuery.or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
  }
  const { data: recentContacts } = await contactsQuery
    .order('created_at', { ascending: false })
    .limit(15)

  const stats = [
    {
      title: 'Total Contacts',
      value: total || 0,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      gradient: 'rgba(37,99,235,0.04)',
    },
    {
      title: 'Messages Sent',
      value: sent || 0,
      icon: Send,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      gradient: 'rgba(16,185,129,0.04)',
    },
    {
      title: 'Pending',
      value: pending || 0,
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      gradient: 'rgba(245,158,11,0.04)',
    },
    {
      title: 'Failed',
      value: failed || 0,
      icon: AlertCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      gradient: 'rgba(239,68,68,0.04)',
    },
  ]

  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'MMM dd')
    const start = startOfDay(date).toISOString()
    const end = new Date(startOfDay(date).getTime() + 24 * 60 * 60 * 1000).toISOString()

    const { count: daySent } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', start)
      .lt('sent_at', end)

    const { count: dayFailed } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', start)
      .lt('created_at', end)

    chartData.push({ date: dateStr, sent: daySent || 0, failed: dayFailed || 0 })
  }

  const todayStart = startOfDay(new Date()).toISOString()
  const { count: sentToday } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent')
    .gte('sent_at', todayStart)

  const successRate =
    (total || 0) > 0 ? Math.round(((sent || 0) / (total || 1)) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            WhatsApp automation overview —{' '}
            <span className="font-semibold text-blue-600">{successRate}%</span> success
            rate
          </p>
        </div>
        <RunNowButton sentToday={sentToday || 0} />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-slate-200/70 shadow-sm card-hover cursor-default"
            style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top right, ${stat.gradient} 0%, transparent 65%)`,
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`${stat.iconBg} p-2 rounded-xl`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-slate-900 font-heading tabular-nums">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Contacts */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <AnalyticsChart data={chartData} />
          <DashboardControls />
        </div>

        <Card
          className="lg:col-span-3 border-slate-200/70 shadow-sm overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)' }}
        >
          <CardHeader className="border-b border-slate-100/80 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Recent Contacts
              </CardTitle>
              <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                {recentContacts?.length || 0} shown
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pl-4 py-3">
                    Name
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-right pr-4 py-3">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContacts?.slice(0, 8).map((contact: any) => (
                  <TableRow
                    key={contact.id}
                    className="border-slate-50 hover:bg-blue-50/30 transition-colors duration-100"
                  >
                    <TableCell className="font-medium text-slate-800 pl-4 py-2.5 text-sm">
                      {contact.name}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <ContactStatusBadge status={contact.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 text-right pr-4 py-2.5 tabular-nums">
                      {format(new Date(contact.created_at), 'MMM dd')}
                    </TableCell>
                  </TableRow>
                ))}
                {(!recentContacts || recentContacts.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-14">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600">
                            No contacts yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Upload a CSV to get started
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ContactStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: 'badge-sent',
    failed: 'badge-failed',
    pending: 'badge-pending',
  }
  const label: Record<string, string> = {
    sent: 'Sent',
    failed: 'Failed',
    pending: 'Pending',
  }
  const cls = map[status] ?? 'badge-default'
  return <span className={cls}>{label[status] ?? status}</span>
}
