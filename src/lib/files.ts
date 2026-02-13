import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const MEMORY_DIR = '/home/elbereth/.openclaw/workspace/memory'
const MEMORY_FILE = '/home/elbereth/.openclaw/workspace/MEMORY.md'
const DOCS_DIR = '/srv/shared'

export interface MemoryEntry {
  slug: string
  date: string
  content: string
  type: 'daily' | 'longterm'
}

export interface DocEntry {
  slug: string
  name: string
  path: string
  content?: string
  isDir: boolean
  children?: DocEntry[]
}

export function getMemories(): MemoryEntry[] {
  const entries: MemoryEntry[] = []

  // Daily notes
  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md')).sort().reverse()
    for (const file of files) {
      const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf-8')
      const slug = file.replace('.md', '')
      entries.push({ slug, date: slug, content, type: 'daily' })
    }
  }

  return entries
}

export function getLongTermMemory(): string {
  if (fs.existsSync(MEMORY_FILE)) {
    return fs.readFileSync(MEMORY_FILE, 'utf-8')
  }
  return ''
}

export function getMemory(slug: string): MemoryEntry | null {
  const filePath = path.join(MEMORY_DIR, `${slug}.md`)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return { slug, date: slug, content, type: 'daily' }
  }
  return null
}

function scanDir(dir: string, prefix = ''): DocEntry[] {
  if (!fs.existsSync(dir)) return []
  const entries: DocEntry[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name)
  })

  for (const item of items) {
    if (item.name.startsWith('.')) continue
    const fullPath = path.join(dir, item.name)
    const slug = prefix ? `${prefix}/${item.name}` : item.name

    if (item.isDirectory()) {
      entries.push({
        slug,
        name: item.name,
        path: fullPath,
        isDir: true,
        children: scanDir(fullPath, slug),
      })
    } else if (item.name.endsWith('.md') || item.name.endsWith('.txt')) {
      entries.push({ slug, name: item.name, path: fullPath, isDir: false })
    }
  }
  return entries
}

export function getDocuments(): DocEntry[] {
  return scanDir(DOCS_DIR)
}

export function getDocument(slug: string): { name: string; content: string } | null {
  const filePath = path.join(DOCS_DIR, slug)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return { name: path.basename(slug), content: fs.readFileSync(filePath, 'utf-8') }
  }
  return null
}

export function searchContent(query: string): Array<{ title: string; snippet: string; type: string; href: string }> {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const results: Array<{ title: string; snippet: string; type: string; href: string }> = []

  // Search memories
  for (const mem of getMemories()) {
    if (mem.content.toLowerCase().includes(q)) {
      const idx = mem.content.toLowerCase().indexOf(q)
      const start = Math.max(0, idx - 80)
      const end = Math.min(mem.content.length, idx + 120)
      results.push({
        title: `Memory: ${mem.date}`,
        snippet: '...' + mem.content.slice(start, end).replace(/\n/g, ' ') + '...',
        type: 'memory',
        href: `/memories/${mem.slug}`,
      })
    }
  }

  // Search long-term memory
  const ltm = getLongTermMemory()
  if (ltm.toLowerCase().includes(q)) {
    const idx = ltm.toLowerCase().indexOf(q)
    const start = Math.max(0, idx - 80)
    const end = Math.min(ltm.length, idx + 120)
    results.push({
      title: 'Long-Term Memory',
      snippet: '...' + ltm.slice(start, end).replace(/\n/g, ' ') + '...',
      type: 'memory',
      href: '/memories?tab=longterm',
    })
  }

  // Search documents recursively
  function searchDocs(entries: DocEntry[]) {
    for (const entry of entries) {
      if (entry.isDir && entry.children) {
        searchDocs(entry.children)
      } else if (!entry.isDir) {
        try {
          const content = fs.readFileSync(entry.path, 'utf-8')
          if (content.toLowerCase().includes(q) || entry.name.toLowerCase().includes(q)) {
            const idx = content.toLowerCase().indexOf(q)
            const start = Math.max(0, idx - 80)
            const end = Math.min(content.length, idx + 120)
            results.push({
              title: `Doc: ${entry.name}`,
              snippet: idx >= 0 ? '...' + content.slice(start, end).replace(/\n/g, ' ') + '...' : entry.name,
              type: 'document',
              href: `/documents/${entry.slug}`,
            })
          }
        } catch {}
      }
    }
  }
  searchDocs(getDocuments())

  return results.slice(0, 50)
}
