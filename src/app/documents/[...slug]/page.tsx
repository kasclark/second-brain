import { getDocument } from '@/lib/files'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

export default function DocumentPage({ params }: { params: { slug: string[] } }) {
  const slugPath = params.slug.join('/')
  const doc = getDocument(slugPath)
  if (!doc) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/documents" className="text-dungeon-accent hover:text-dungeon-accentLight text-sm mb-4 inline-block">← Back to documents</Link>
      <div className="bg-dungeon-card border border-dungeon-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dungeon-border">
          <span className="text-2xl">📄</span>
          <h1 className="text-2xl font-bold text-dungeon-accentLight">{doc.name}</h1>
        </div>
        <MarkdownRenderer content={doc.content} />
      </div>
    </div>
  )
}
