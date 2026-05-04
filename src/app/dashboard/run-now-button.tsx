'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function RunNowButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRun = async () => {
    setLoading(true)
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

  return (
    <Button 
      onClick={handleRun} 
      disabled={loading}
      variant="outline"
      className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Play className="mr-2 h-4 w-4 fill-current" />
      )}
      Run Now
    </Button>
  )
}
