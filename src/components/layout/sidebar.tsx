'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Megaphone,
  Upload,
  LogOut,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/login/actions'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Campaigns',
    icon: Megaphone,
    href: '/dashboard/campaigns',
  },
  {
    label: 'Upload CSV',
    icon: Upload,
    href: '/dashboard/upload',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full sidebar-gradient">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-shadow duration-200 group-hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            }}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-none font-heading tracking-wide">
              WA Blast
            </h1>
            <p className="text-[10px] text-blue-400/70 mt-0.5 font-medium tracking-widest uppercase">
              Automation
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
              style={
                isActive
                  ? {
                      background: 'rgba(37,99,235,0.18)',
                      border: '1px solid rgba(37,99,235,0.28)',
                    }
                  : {}
              }
            >
              <route.icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-colors duration-150',
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              <span className="flex-1 truncate">{route.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-5 pt-4 border-t border-white/5">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  )
}
