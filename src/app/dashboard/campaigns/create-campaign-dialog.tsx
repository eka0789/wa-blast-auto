'use client'

import { useState } from 'react'
import { Plus, Megaphone } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCampaign } from './actions'

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      await createCampaign(formData)
      toast.success('Campaign created successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-150'
        )}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Campaign
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Megaphone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  New Campaign
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Use{' '}
                  <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600">
                    {'{{name}}'}
                  </code>{' '}
                  to personalize messages.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Campaign Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Follow Up Leads"
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="template" className="text-sm font-medium text-slate-700">
                Message Template
              </Label>
              <textarea
                id="template"
                name="template"
                className="flex min-h-[110px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-shadow duration-150"
                placeholder={`Hi {{name}}, we have a special offer for you!`}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600 text-[11px]">
                  {'{{name}}'}
                </code>{' '}
                to insert each contact&apos;s name automatically.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-sm shadow-sm shadow-blue-600/20"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
