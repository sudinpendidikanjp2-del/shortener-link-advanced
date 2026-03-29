'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { Link2, LayoutDashboard, Settings, Users, BarChart3, QrCode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Links', href: '/dashboard/links', icon: Link2 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'QR Codes', href: '/dashboard/qr-codes', icon: QrCode },
]

const adminNavigation = [
  { name: 'Users', href: '/dashboard/admin/users', icon: Users },
  { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Linkly</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          {isAdmin && (
            <>
              <div className="mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </div>
              <ul className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </nav>
      </aside>
    </div>
  )
}
