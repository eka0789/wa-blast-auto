'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadContacts(contacts: any[]) {
  const supabase = await createClient()

  const { error } = await supabase.from('contacts').insert(contacts)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
