import { getDocuments } from '@/lib/files'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function DocTree({ entries, depth = 0 }: { entries: any[]; depth?: number }) {
  return (
    <div className={depth > 0 ? 'ml-4 border-l border-dungeon-border pl-4' : ''}>
      {entries.map(entry => (
        <div key={entry.slug} className="my-1">
          {entry.isDir ? (
            <div>
              <div className="flex items-center gap-2 py-2 text-dungeon-gold font-medium">
                <span>📁</span> {entry.name}
              </div>
              {entry.children && <DocTree entries={entry.children} depth={depth + 1} />}
            </div>
          ) : (
            <Link href={`/documents/${entry.slug}`}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm hover:bg-dungeon-card transition-colors text-dungeon-text hover:text-dungeon-accentLight">
              <span>📄</span> {entry.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default function DocumentsPage() {
  const docs = getDocuments()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dungeon-accentLight mb-6">📖 Documents</h1>
      <div className="bg-dungeon-card border border-dungeon-border rounded-xl p-6">
        {docs.length > 0 ? <DocTree entries={docs} /> : <p className="text-dungeon-muted">No documents found in /srv/shared/</p>}
      </div>
    </div>
  )
}
