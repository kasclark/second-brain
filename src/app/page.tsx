import { getMemories, getDocuments } from '@/lib/files'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const memories = getMemories()
  const docs = getDocuments()
  const recentMemories = memories.slice(0, 5)

  function countDocs(entries: any[]): number {
    return entries.reduce((n, e) => n + (e.isDir ? countDocs(e.children || []) : 1), 0)
  }

  const stats = [
    { label: 'Daily Notes', value: memories.length, icon: '📜', color: 'text-dungeon-accentLight' },
    { label: 'Documents', value: countDocs(docs), icon: '📖', color: 'text-dungeon-emerald' },
    { label: 'Folders', value: docs.filter(d => d.isDir).length, icon: '📁', color: 'text-dungeon-gold' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dungeon-accentLight">⚔️ Second Brain</h1>
        <p className="text-dungeon-muted mt-1">Welcome back, Kassidy. Your knowledge awaits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-dungeon-card border border-dungeon-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dungeon-muted text-sm">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <span className="text-3xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dungeon-card border border-dungeon-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dungeon-text">Recent Memories</h2>
            <Link href="/memories" className="text-sm text-dungeon-accent hover:text-dungeon-accentLight">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentMemories.map(m => (
              <Link key={m.slug} href={`/memories/${m.slug}`}
                className="block p-3 bg-dungeon-surface rounded-lg border border-dungeon-border hover:border-dungeon-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-dungeon-gold text-sm">📅</span>
                  <span className="text-sm font-medium">{m.date}</span>
                </div>
                <p className="text-dungeon-muted text-xs mt-1 line-clamp-2">
                  {m.content.slice(0, 150).replace(/[#*_\[\]]/g, '')}...
                </p>
              </Link>
            ))}
            {recentMemories.length === 0 && <p className="text-dungeon-muted text-sm">No memories yet.</p>}
          </div>
        </div>

        <div className="bg-dungeon-card border border-dungeon-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dungeon-text">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/memories" className="flex items-center gap-3 p-4 bg-dungeon-surface rounded-lg border border-dungeon-border hover:border-dungeon-accent/50 transition-colors">
              <span className="text-2xl">📜</span>
              <div><p className="font-medium text-sm">Memories</p><p className="text-xs text-dungeon-muted">Journal & notes</p></div>
            </Link>
            <Link href="/documents" className="flex items-center gap-3 p-4 bg-dungeon-surface rounded-lg border border-dungeon-border hover:border-dungeon-accent/50 transition-colors">
              <span className="text-2xl">📖</span>
              <div><p className="font-medium text-sm">Documents</p><p className="text-xs text-dungeon-muted">Shared files</p></div>
            </Link>
            <Link href="/tasks" className="flex items-center gap-3 p-4 bg-dungeon-surface rounded-lg border border-dungeon-border hover:border-dungeon-accent/50 transition-colors">
              <span className="text-2xl">⚡</span>
              <div><p className="font-medium text-sm">Tasks</p><p className="text-xs text-dungeon-muted">GitHub Projects</p></div>
            </Link>
            <Link href="/search" className="flex items-center gap-3 p-4 bg-dungeon-surface rounded-lg border border-dungeon-border hover:border-dungeon-accent/50 transition-colors">
              <span className="text-2xl">🔍</span>
              <div><p className="font-medium text-sm">Search</p><p className="text-xs text-dungeon-muted">Find anything</p></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
