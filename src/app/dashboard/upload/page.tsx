import { createClient } from '@/utils/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadForm } from './upload-form'

export default async function UploadPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, name')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Contacts</h2>
        <p className="text-muted-foreground">
          Import contacts from a CSV file and assign them to a campaign.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>
            The CSV should have at least 'name' and 'phone' columns. Phone numbers should be in Indonesian format (e.g. 08xx or 628xx).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm campaigns={campaigns || []} />
        </CardContent>
      </Card>
    </div>
  )
}
