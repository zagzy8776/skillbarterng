'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '🏠'
    },
    {
      name: 'Requests',
      href: '/requests',
      icon: '📨'
    },
    {
      name: 'P2P',
      href: '/p2p',
      icon: '💱'
    },
    {
      name: 'AI Chat',
      href: '/ai-chat',
      icon: '🤖'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '👤'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
