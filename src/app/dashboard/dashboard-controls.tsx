'use client'

import { useState, useTransition, useEffect } from 'react'
import { Search, RefreshCcw, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { retryFailedContacts } from './actions'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

export function DashboardControls() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const handleRetry = () => {
    startTransition(async () => {
      try {
        await retryFailedContacts()
        toast.success('All failed contacts are now pending')
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }
    router.push(`/dashboard?${params.toString()}`)
  }, [searchTerm, router, searchParams])

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search contacts by name or phone..."
          className="pl-9 h-9 text-sm bg-white/80 border-slate-200/70 backdrop-blur-sm placeholder:text-slate-400 focus:ring-blue-500/30 focus:border-blue-400 transition-colors duration-150"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        onClick={handleRetry}
        disabled={isPending}
        className="h-9 text-sm border-amber-200 bg-amber-50/60 text-amber-700 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300 transition-all duration-150 flex-shrink-0"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
        )}
        Retry Failed
      </Button>
    </div>
  )
}
