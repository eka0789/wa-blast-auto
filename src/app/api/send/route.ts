import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  // Check for cron authorization if needed, or just let it be open for now if using Vercel CRON secret
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const supabase = await createClient()

  // 1. Ambil 20 data yang status = pending
  const { data: pendingContacts, error: fetchError } = await supabase
    .from('contacts')
    .select('*, campaigns(template)')
    .eq('status', 'pending')
    .limit(20)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!pendingContacts || pendingContacts.length === 0) {
    return NextResponse.json({ message: 'No pending contacts found' })
  }

  const results = []

  for (const contact of pendingContacts) {
    const message = contact.campaigns?.template.replace('{{name}}', contact.name) || ''
    
    try {
      // 2. Kirim ke Fonnte
      const response = await axios.post('https://api.fonnte.com/send', {
        target: contact.phone,
        message: message,
      }, {
        headers: {
          'Authorization': process.env.FONNTE_API_KEY
        }
      })

      if (response.data.status) {
        // 3. Update status: sent
        await supabase
          .from('contacts')
          .update({ status: 'sent', sent_at: new Date().toISOString(), message: message })
          .eq('id', contact.id)
        
        results.push({ id: contact.id, status: 'success' })
      } else {
        throw new Error(response.data.reason || 'Fonnte error')
      }
    } catch (error: any) {
      console.error(`Failed to send to ${contact.phone}:`, error.message)
      
      // Update status: failed
      await supabase
        .from('contacts')
        .update({ status: 'failed', message: message })
        .eq('id', contact.id)

      results.push({ id: contact.id, status: 'failed', error: error.message })
    }

    // Delay random 5-10 detik untuk menghindari spam detection
    const delay = Math.floor(Math.random() * 5000) + 5000
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return NextResponse.json({ 
    message: `Processed ${pendingContacts.length} contacts`,
    results 
  })
}
