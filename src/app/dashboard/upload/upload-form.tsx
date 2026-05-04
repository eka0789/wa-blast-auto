'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { uploadContacts } from './actions'

interface UploadFormProps {
  campaigns: { id: string; name: string }[]
}

export function UploadForm({ campaigns }: UploadFormProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [campaignId, setCampaignId] = useState<string>('')
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 5))
        },
      })
    }
  }

  const normalizePhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '')
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1)
    }
    if (clean.startsWith('8')) {
      clean = '62' + clean
    }
    return clean
  }

  const handleUpload = async () => {
    if (!file || !campaignId) {
      toast.error('Please select a file and a campaign')
      return
    }

    setLoading(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data
          .filter((row: any) => row.name && row.phone)
          .map((row: any) => ({
            name: row.name,
            phone: normalizePhone(row.phone),
            campaign_id: campaignId,
            status: 'pending',
          }))

        if (data.length === 0) {
          toast.error('No valid data found in CSV')
          setLoading(false)
          return
        }

        try {
          await uploadContacts(data)
          toast.success(`Successfully uploaded ${data.length} contacts`)
          router.push('/dashboard')
        } catch (error: any) {
          toast.error(error.message || 'Upload failed')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="campaign">Assign to Campaign</Label>
          <Select onValueChange={setCampaignId} value={campaignId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="csv">CSV File</Label>
          <div className="flex items-center gap-2">
            <Input
              id="csv"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Preview (First 5 rows)
            </h3>
            <Badge variant="outline">{preview.length} rows detected</Badge>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={loading || !file || !campaignId}>
          <Upload className="mr-2 h-4 w-4" />
          {loading ? 'Uploading...' : 'Upload Contacts'}
        </Button>
      </div>
    </div>
  )
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      variant === 'outline' ? 'border text-slate-500' : 'bg-indigo-100 text-indigo-800'
    } ${className}`}>
      {children}
    </span>
  )
}
