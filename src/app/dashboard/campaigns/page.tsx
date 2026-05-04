import { createClient } from '@/utils/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { CreateCampaignDialog } from './create-campaign-dialog'
import { Megaphone, Users } from 'lucide-react'

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, contacts(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Campaigns
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your WhatsApp messaging campaigns.
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      <Card
        className="border-slate-200/70 shadow-sm overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)' }}
      >
        <CardHeader className="border-b border-slate-100/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-800">
                All Campaigns
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {campaigns?.length || 0} campaign
                {(campaigns?.length || 0) !== 1 ? 's' : ''} total
              </CardDescription>
            </div>
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
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide py-3">
                  Contacts
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide py-3 hidden lg:table-cell">
                  Template
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-right pr-4 py-3">
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((campaign: any) => (
                <TableRow
                  key={campaign.id}
                  className="border-slate-50 hover:bg-blue-50/30 transition-colors duration-100"
                >
                  <TableCell className="font-semibold text-slate-800 pl-4 py-3 text-sm">
                    {campaign.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <CampaignStatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="tabular-nums">
                        {campaign.contacts?.[0]?.count || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-sm text-slate-500 hidden lg:table-cell py-3">
                    {campaign.template}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 text-right pr-4 py-3 tabular-nums">
                    {format(new Date(campaign.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
              {(!campaigns || campaigns.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Megaphone className="h-7 w-7 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">
                          No campaigns yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Create your first campaign to start sending messages
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
  )
}

function CampaignStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    Completed: {
      label: 'Completed',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    Running: {
      label: 'Running',
      cls: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    Active: {
      label: 'Active',
      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    Draft: {
      label: 'Draft',
      cls: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    Paused: {
      label: 'Paused',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  }
  const c = config[status] ?? {
    label: status,
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.cls}`}
    >
      {c.label}
    </span>
  )
}
