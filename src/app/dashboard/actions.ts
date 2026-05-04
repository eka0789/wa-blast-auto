'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function retryFailedContacts() {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contacts')
    .update({ status: 'pending', message: null })
    .eq('status', 'failed')

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
}
