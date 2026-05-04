export type CampaignStatus = 'Draft' | 'Running' | 'Completed'
export type ContactStatus = 'pending' | 'sent' | 'failed'

export interface Campaign {
  id: string
  name: string
  template: string
  status: CampaignStatus
  created_at: string
}

export interface Contact {
  id: string
  campaign_id: string
  name: string
  phone: string
  message: string | null
  status: ContactStatus
  sent_at: string | null
  created_at: string
}

export interface Stats {
  total: number
  sent: number
  pending: number
  failed: number
}
