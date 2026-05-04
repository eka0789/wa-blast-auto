'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Megaphone, 
  Upload, 
  LogOut,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Campaigns',
    icon: Megaphone,
    href: '/dashboard/campaigns',
    color: 'text-violet-500',
  },
  {
    label: 'Upload CSV',
    icon: Upload,
    href: '/dashboard/upload',
    color: 'text-orange-500',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold">
            WA Blast
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-100 rounded-lg transition',
                pathname === route.href ? 'bg-slate-100 text-indigo-600' : 'text-slate-500'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50" type="submit">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}
