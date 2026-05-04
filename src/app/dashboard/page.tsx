import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Send, 
  Clock, 
  AlertCircle 
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { RunNowButton } from './run-now-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch stats
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

  // Fetch recent contacts
  const { data: recentContacts } = await supabase
    .from('contacts')
    .select('*, campaigns(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  const stats = [
    {
      title: 'Total Contacts',
      value: total || 0,
      icon: Users,
      color: 'text-sky-600',
      bg: 'bg-sky-100',
    },
    {
      title: 'Sent',
      value: sent || 0,
      icon: Send,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Pending',
      value: pending || 0,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: 'Failed',
      value: failed || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your WhatsApp automation campaigns.
          </p>
        </div>
        <RunNowButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentContacts?.map((contact: any) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.campaigns?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contact.status === 'sent'
                          ? 'default'
                          : contact.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        contact.status === 'sent' ? 'bg-green-500 hover:bg-green-600' : ''
                      }
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(contact.created_at), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
              {(!recentContacts || recentContacts.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
