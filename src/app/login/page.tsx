import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from './actions'
import { MessageSquare, AlertCircle, Zap } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-[420px] animate-slide-up">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
            }}
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-heading tracking-tight">
            WA Blast Auto
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            WhatsApp Campaign Automation
          </p>
        </div>

        {/* Glassmorphism card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white font-heading">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage your campaigns</p>
          </div>

          <form action={login} className="space-y-5">
            {searchParams.error && (
              <div
                className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm text-red-300"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{searchParams.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="h-11 text-white placeholder:text-slate-600 focus:ring-blue-500/50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-11 text-white placeholder:text-slate-600 focus:ring-blue-500/50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-white mt-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
                border: 'none',
              }}
            >
              <Zap className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 WA Blast Auto · All rights reserved
        </p>
      </div>
    </div>
  )
}
