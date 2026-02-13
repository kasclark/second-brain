'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/', label: 'Dashboard', icon: '⚔️' },
  { href: '/memories', label: 'Memories', icon: '📜' },
  { href: '/documents', label: 'Documents', icon: '📖' },
  { href: '/tasks', label: 'Tasks', icon: '⚡' },
  { href: '/search', label: 'Search', icon: '🔍' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dungeon-card rounded-lg border border-dungeon-border"
      >
        ☰
      </button>
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-dungeon-surface border-r border-dungeon-border
        flex flex-col transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-dungeon-border">
          <h1 className="text-xl font-bold text-dungeon-accentLight flex items-center gap-2">
            🧠 Second Brain
          </h1>
          <p className="text-xs text-dungeon-muted mt-1">Elbereth&apos;s Knowledge Vault</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-dungeon-accent/20 text-dungeon-accentLight border border-dungeon-accent/30'
                    : 'text-dungeon-muted hover:text-dungeon-text hover:bg-dungeon-card'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-dungeon-border">
          <p className="text-xs text-dungeon-muted">✨ kasclark</p>
        </div>
      </aside>
      {open && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}
    </>
  )
}
