import { createAdminClient } from '@/utils/supabase/admin'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  // 1. Verifikasi Keamanan (Hanya izinkan jika ada Cron Secret atau User Login)
  const authHeader = request.headers.get('authorization')
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  
  let supabase
  if (isCron) {
    // Jika dipanggil oleh Vercel Cron, gunakan Admin Client
    supabase = createAdminClient()
  } else {
    // Jika dipanggil manual dari Dashboard, cek session user
    supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  // 2. Ambil 20 data yang status = pending
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
      // 3. Kirim ke Fonnte
      const response = await axios.post('https://api.fonnte.com/send', {
        target: contact.phone,
        message: message,
        // Optional: tambahkan delay di level Fonnte jika ingin lebih aman
        // delay: '5-10', 
      }, {
        headers: {
          'Authorization': process.env.FONNTE_API_KEY
        }
      })

      // Cek apakah response sukses (Fonnte mengembalikan status true jika berhasil antre)
      if (response.data.status || response.data.detail === 'success') {
        await supabase
          .from('contacts')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString(), 
            message: message 
          })
          .eq('id', contact.id)
        
        results.push({ id: contact.id, status: 'success' })
      } else {
        throw new Error(response.data.reason || 'Fonnte rejection')
      }
    } catch (error: any) {
      console.error(`Failed to send to ${contact.phone}:`, error.message)
      
      await supabase
        .from('contacts')
        .update({ 
          status: 'failed', 
          message: `${message} (Error: ${error.message})` 
        })
        .eq('id', contact.id)

      results.push({ id: contact.id, status: 'failed', error: error.message })
    }

    // Jeda antar pesan (agar tidak dianggap spam oleh WA)
    const delay = Math.floor(Math.random() * 3000) + 2000 // 2-5 detik
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return NextResponse.json({ 
    message: `Processed ${pendingContacts.length} contacts`,
    results 
  })
}
