'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { Upload, FileText, CheckCircle2, X } from 'lucide-react'
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
  const [totalRows, setTotalRows] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTotalRows(results.data.length)
          setPreview(results.data.slice(0, 5))
        },
      })
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview([])
    setTotalRows(0)
  }

  const normalizePhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '')
    if (clean.startsWith('0')) clean = '62' + clean.slice(1)
    if (clean.startsWith('8')) clean = '62' + clean
    return clean
  }

  const handleUpload = async () => {
    if (!file || !campaignId) {
      toast.error('Please select a campaign and a CSV file')
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
      {/* Form fields */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="campaign" className="text-sm font-medium text-slate-700">
            Assign to Campaign
          </Label>
          <Select onValueChange={setCampaignId} value={campaignId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select a campaign..." />
            </SelectTrigger>
            <SelectContent>
              {campaigns.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-slate-500">No campaigns found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create a campaign first
                  </p>
                </div>
              ) : (
                campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="csv" className="text-sm font-medium text-slate-700">
            CSV File
          </Label>
          {file ? (
            <div className="h-9 flex items-center gap-2 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="flex-shrink-0 text-emerald-500 hover:text-emerald-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Input
              id="csv"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="h-9 cursor-pointer text-sm file:text-sm file:font-medium"
            />
          )}
        </div>
      </div>

      {/* Preview table */}
      {preview.length > 0 && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Preview
              <span className="text-xs text-muted-foreground font-normal">
                (first 5 rows)
              </span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
              {totalRows} rows detected
            </span>
          </div>
          <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide pl-4 py-2.5">
                    Name
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide py-2.5">
                    Phone
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((row, i) => (
                  <TableRow
                    key={i}
                    className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="pl-4 py-2.5 text-sm text-slate-700 font-medium">
                      {row.name}
                    </TableCell>
                    <TableCell className="py-2.5 text-sm text-slate-500 tabular-nums">
                      {row.phone}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleUpload}
          disabled={loading || !file || !campaignId}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-150 disabled:opacity-50"
        >
          <Upload className="mr-2 h-4 w-4" />
          {loading ? 'Uploading...' : `Upload ${totalRows > 0 ? `${totalRows} Contacts` : 'Contacts'}`}
        </Button>
      </div>
    </div>
  )
}
