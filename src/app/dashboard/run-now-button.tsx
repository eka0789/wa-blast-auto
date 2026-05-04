'use client'

import { useState } from 'react'
import { Play, Loader2, AlertTriangle } from 'lucide-react'
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

  const triggerButton = (
    <Button 
      onClick={() => !isOverLimit && handleRun()} 
      disabled={loading}
      variant={isOverLimit ? "destructive" : "outline"}
      className={!isOverLimit ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" : ""}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Play className={`mr-2 h-4 w-4 ${!isOverLimit ? 'fill-current' : ''}`} />
      )}
      Run Now {isOverLimit && `(${sentToday}/${LIMIT})`}
    </Button>
  )

  if (isOverLimit) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Rate Limit Warning
            </DialogTitle>
            <DialogDescription className="py-4">
              Anda sudah mengirim <strong>{sentToday} pesan</strong> hari ini. 
              Batas aman yang direkomendasikan adalah <strong>{LIMIT} pesan per hari</strong> untuk menghindari blokir dari WhatsApp.
              <br /><br />
              Apakah Anda yakin ingin tetap melanjutkan pengiriman manual sekarang?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRun}>
              Ya, Saya Mengerti Resikonya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return triggerButton
}
