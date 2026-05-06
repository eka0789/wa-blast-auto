'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface RunNowButtonProps {
  sentToday: number
}

export function RunNowButton({ sentToday }: RunNowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const LIMIT = 20
  const isOverLimit = sentToday >= LIMIT

  const handleRun = async () => {
    setLoading(true)
    setOpen(false)
    const toastId = toast.loading('Sending messages...')

    try {
      const response = await fetch('/api/send')
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Process completed', { id: toastId })
        router.refresh()
      } else {
        throw new Error(data.error || 'Failed to run sender')
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  if (isOverLimit) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-all duration-150"
            />
          }
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Rate Limited ({sentToday}/{LIMIT})
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Rate Limit Warning
            </DialogTitle>
            <DialogDescription className="pt-3 space-y-3 text-sm text-slate-600">
              <p>
                Anda sudah mengirim{' '}
                <strong className="text-slate-800">{sentToday} pesan</strong> hari ini.
                Batas aman yang direkomendasikan adalah{' '}
                <strong className="text-slate-800">{LIMIT} pesan per hari</strong> untuk
                menghindari blokir dari WhatsApp.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-800 text-sm flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Melanjutkan pengiriman berisiko tinggi. Akun WhatsApp Anda dapat
                  diblokir sementara.
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRun} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button
      onClick={handleRun}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:shadow-md hover:shadow-blue-600/25"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Zap className="mr-2 h-4 w-4" />
      )}
      Run Now
    </Button>
  )
}
