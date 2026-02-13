import { getMemories, getLongTermMemory } from '@/lib/files'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

export default function MemoriesPage({ searchParams }: { searchParams: { tab?: string } }) {
  const memories = getMemories()
  const longTerm = getLongTermMemory()
  const tab = searchParams.tab || 'daily'

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dungeon-accentLight mb-6">📜 Memories</h1>

      <div className="flex gap-2 mb-6">
        <Link href="/memories?tab=daily"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'daily' ? 'bg-dungeon-accent text-white' : 'bg-dungeon-card text-dungeon-muted hover:text-dungeon-text border border-dungeon-border'}`}>
          Daily Notes ({memories.length})
        </Link>
        <Link href="/memories?tab=longterm"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'longterm' ? 'bg-dungeon-accent text-white' : 'bg-dungeon-card text-dungeon-muted hover:text-dungeon-text border border-dungeon-border'}`}>
          Long-Term Memory
        </Link>
      </div>

      {tab === 'longterm' ? (
        <div className="bg-dungeon-card border border-dungeon-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-dungeon-gold mb-4">🧠 MEMORY.md</h2>
          {longTerm ? <MarkdownRenderer content={longTerm} /> : <p className="text-dungeon-muted">No long-term memory file found.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map(m => (
            <Link key={m.slug} href={`/memories/${m.slug}`}
              className="block bg-dungeon-card border border-dungeon-border rounded-xl p-5 hover:border-dungeon-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-dungeon-gold">📅</span>
                  <span className="font-semibold">{m.date}</span>
                </div>
                <span className="text-dungeon-muted text-sm">{(m.content.length / 1024).toFixed(1)}KB</span>
              </div>
              <p className="text-dungeon-muted text-sm mt-2 line-clamp-3">
                {m.content.slice(0, 200).replace(/[#*_\[\]]/g, '')}
              </p>
            </Link>
          ))}
          {memories.length === 0 && <p className="text-dungeon-muted">No daily notes found.</p>}
        </div>
      )}
    </div>
  )
}
