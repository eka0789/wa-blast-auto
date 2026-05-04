import { createClient } from '@/utils/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadForm } from './upload-form'
import { FileUp, Info } from 'lucide-react'

export default async function UploadPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, name')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Upload Contacts
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Import contacts from a CSV file and assign them to a campaign.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200/60 rounded-xl px-4 py-3.5">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Your CSV must include{' '}
          <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-xs">name</code>{' '}
          and{' '}
          <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-xs">phone</code>{' '}
          columns. Phone numbers in Indonesian format (08xx or 628xx) are automatically
          normalized.
        </p>
      </div>

      <Card
        className="border-slate-200/70 shadow-sm"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)' }}
      >
        <CardHeader className="border-b border-slate-100/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-800">
                CSV Import
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Select a campaign and upload your contacts file.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <UploadForm campaigns={campaigns || []} />
        </CardContent>
      </Card>
    </div>
  )
}
