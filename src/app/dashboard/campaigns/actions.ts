'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCampaign(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const template = formData.get('template') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('campaigns').insert({
    name,
    template,
    status: 'Draft',
    user_id: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/campaigns')
}
