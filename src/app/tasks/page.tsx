'use client'
import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  status: string
  priority: string | null
  url: string | null
  labels: Array<{ name: string; color: string }>
  assignees: string[]
  body: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  'Todo': 'bg-dungeon-muted/20 text-dungeon-muted',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Done': 'bg-dungeon-emerald/20 text-dungeon-emerald',
  'Backlog': 'bg-dungeon-border text-dungeon-muted',
}

const priorityIcons: Record<string, string> = {
  'Urgent': '🔴',
  'High': '🟠',
  'Medium': '🟡',
  'Low': '🟢',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => {
        setTasks(data.tasks || [])
        setTitle(data.title || 'Project')
        if (data.error) setError(data.error)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const statuses = [...new Set(tasks.map(t => t.status))]

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-dungeon-accentLight mb-2">⚡ Tasks</h1>
      <p className="text-dungeon-muted mb-6">{title}</p>

      {loading ? (
        <div className="flex items-center gap-3 text-dungeon-muted">
          <div className="animate-spin h-5 w-5 border-2 border-dungeon-accent border-t-transparent rounded-full" />
          Loading tasks from GitHub...
        </div>
      ) : error ? (
        <div className="bg-dungeon-ruby/10 border border-dungeon-ruby/30 rounded-xl p-4 text-dungeon-ruby">{error}</div>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-dungeon-accent text-white' : 'bg-dungeon-card text-dungeon-muted border border-dungeon-border hover:text-dungeon-text'}`}>
              All ({tasks.length})
            </button>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-dungeon-accent text-white' : 'bg-dungeon-card text-dungeon-muted border border-dungeon-border hover:text-dungeon-text'}`}>
                {s} ({tasks.filter(t => t.status === s).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(task => (
              <div key={task.id} className="bg-dungeon-card border border-dungeon-border rounded-xl p-5 hover:border-dungeon-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {task.priority && <span title={task.priority}>{priorityIcons[task.priority] || '⚪'}</span>}
                      <h3 className="font-semibold text-dungeon-text">
                        {task.url ? (
                          <a href={task.url} target="_blank" rel="noopener noreferrer" className="hover:text-dungeon-accentLight">{task.title}</a>
                        ) : task.title}
                      </h3>
                    </div>
                    {task.body && (
                      <p className="text-dungeon-muted text-sm mt-2 line-clamp-2">{task.body.slice(0, 200)}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {task.labels.map(l => (
                        <span key={l.name} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `#${l.color}22`, color: `#${l.color}` }}>
                          {l.name}
                        </span>
                      ))}
                      {task.assignees.map(a => (
                        <span key={a} className="text-xs text-dungeon-muted">@{a}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[task.status] || 'bg-dungeon-card text-dungeon-muted'}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-dungeon-muted">No tasks found.</p>}
          </div>
        </>
      )}
    </div>
  )
}
