'use client'

import { useState, useTransition } from 'react'
import { Search, RefreshCcw, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { retryFailedContacts } from './actions'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect } from 'react'

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

  // Handle Search with debounce
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
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search contacts by name or phone..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={handleRetry} 
        disabled={isPending}
        className="text-orange-600 border-orange-200 hover:bg-orange-50"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-4 w-4" />
        )}
        Retry All Failed
      </Button>
    </div>
  )
}
