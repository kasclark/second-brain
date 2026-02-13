'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Result {
  title: string
  snippet: string
  type: string
  href: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function doSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    setResults(await res.json())
    setSearched(true)
    setLoading(false)
  }

  const typeIcons: Record<string, string> = { memory: '📜', document: '📖' }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dungeon-accentLight mb-6">🔍 Search</h1>

      <form onSubmit={doSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search memories and documents..."
          className="flex-1 bg-dungeon-card border border-dungeon-border rounded-xl px-4 py-3 text-dungeon-text placeholder:text-dungeon-muted focus:outline-none focus:border-dungeon-accent"
        />
        <button type="submit" disabled={loading}
          className="bg-dungeon-accent hover:bg-dungeon-accent/80 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div>
          <p className="text-dungeon-muted text-sm mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Link key={i} href={r.href}
                className="block bg-dungeon-card border border-dungeon-border rounded-xl p-5 hover:border-dungeon-accent/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span>{typeIcons[r.type] || '📄'}</span>
                  <span className="font-semibold text-dungeon-text">{r.title}</span>
                  <span className="text-xs bg-dungeon-surface px-2 py-0.5 rounded-full text-dungeon-muted">{r.type}</span>
                </div>
                <p className="text-dungeon-muted text-sm">{r.snippet}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
