import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, Plus, Trash2, Search, Tag, Clock, Edit3, Save, X, ChevronDown } from 'lucide-react'
import { getProgress, updateProgress } from '../utils/progress'

const NOTE_TAGS = [
  { id: 'general', label: 'General', color: '#00d4ff' },
  { id: 'compute', label: 'Compute', color: '#4285f4' },
  { id: 'storage', label: 'Storage', color: '#34a853' },
  { id: 'networking', label: 'Networking', color: '#ea4335' },
  { id: 'security', label: 'Security', color: '#fbbc04' },
  { id: 'data', label: 'Data Analytics', color: '#9c27b0' },
  { id: 'exam', label: 'Exam Prep', color: '#f43f5e' },
  { id: 'tips', label: 'Tips & Tricks', color: '#10b981' },
]

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}').notes || []
  } catch {
    return []
  }
}

function saveNotes(notes) {
  const data = JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}')
  data.notes = notes
  localStorage.setItem('gcp-lab-progress', JSON.stringify(data))
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTag, setEditTag] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState('all')

  useEffect(() => {
    setNotes(loadNotes())
  }, [])

  const filteredNotes = useMemo(() => {
    let result = notes
    if (filterTag !== 'all') {
      result = result.filter((n) => n.tag === filterTag)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((n) =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
  }, [notes, filterTag, searchQuery])

  const createNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      tag: 'general',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const updated = [newNote, ...notes]
    setNotes(updated)
    saveNotes(updated)
    setEditingId(newNote.id)
    setEditTitle('')
    setEditContent('')
    setEditTag('general')
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditTag(note.tag || 'general')
  }

  const saveEdit = () => {
    if (!editingId) return
    const updated = notes.map((n) =>
      n.id === editingId
        ? { ...n, title: editTitle, content: editContent, tag: editTag, updatedAt: Date.now() }
        : n
    )
    setNotes(updated)
    saveNotes(updated)
    setEditingId(null)
  }

  const cancelEdit = () => {
    // If the note has no title and no content, delete it
    const note = notes.find((n) => n.id === editingId)
    if (note && !note.title && !note.content && !editTitle && !editContent) {
      deleteNote(editingId)
    }
    setEditingId(null)
  }

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (editingId === id) setEditingId(null)
  }

  const tagCounts = useMemo(() => {
    const counts = { all: notes.length }
    for (const note of notes) {
      counts[note.tag || 'general'] = (counts[note.tag || 'general'] || 0) + 1
    }
    return counts
  }, [notes])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 glow-amber">
            <StickyNote className="w-8 h-8 text-neon-amber" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          Quick <span className="gradient-text-cyan">Notes</span>
        </h1>
        <p className="text-nebula-muted text-lg">Capture study notes, key concepts, and exam tips</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="flex items-center gap-3 mb-6 flex-wrap"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={createNote}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors cursor-pointer text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>

        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nebula-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 bg-nebula-surface/30 border border-nebula-border rounded-lg text-sm text-nebula-text placeholder:text-nebula-dim focus:outline-none focus:border-neon-cyan/30"
          />
        </div>

        <span className="text-xs text-nebula-dim">{notes.length} notes</span>
      </motion.div>

      {/* Tag Filter */}
      <motion.div
        className="flex items-center gap-2 mb-6 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Tag className="w-3.5 h-3.5 text-nebula-dim" />
        <button
          onClick={() => setFilterTag('all')}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            filterTag === 'all'
              ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan'
              : 'border-nebula-border text-nebula-muted hover:text-nebula-text'
          }`}
        >
          All ({tagCounts.all || 0})
        </button>
        {NOTE_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setFilterTag(tag.id)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              filterTag === tag.id
                ? 'border-opacity-30 text-opacity-100'
                : 'border-nebula-border text-nebula-muted hover:text-nebula-text'
            }`}
            style={filterTag === tag.id ? { backgroundColor: tag.color + '10', borderColor: tag.color + '30', color: tag.color } : undefined}
          >
            {tag.label} {tagCounts[tag.id] ? `(${tagCounts[tag.id]})` : ''}
          </button>
        ))}
      </motion.div>

      {/* Notes */}
      {filteredNotes.length === 0 ? (
        <motion.div
          className="glass-card-static rounded-2xl p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <StickyNote className="w-12 h-12 text-nebula-dim mx-auto mb-4" />
          <h2 className="text-lg font-bold text-nebula-text mb-2">
            {notes.length === 0 ? 'No Notes Yet' : 'No Matching Notes'}
          </h2>
          <p className="text-nebula-muted text-sm">
            {notes.length === 0
              ? 'Create your first note to start capturing study insights.'
              : 'Try adjusting your search or filter.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotes.map((note) => {
              const isEditing = editingId === note.id
              const tag = NOTE_TAGS.find((t) => t.id === (note.tag || 'general')) || NOTE_TAGS[0]

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-card-static rounded-xl overflow-hidden"
                >
                  {isEditing ? (
                    <div className="p-5 space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Note title..."
                        className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text font-bold focus:outline-none focus:border-neon-cyan/40"
                        autoFocus
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Write your note here..."
                        className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40 min-h-[120px] resize-y"
                        rows={5}
                      />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-nebula-dim">Tag:</span>
                        {NOTE_TAGS.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setEditTag(t.id)}
                            className={`text-[10px] px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                              editTag === t.id ? '' : 'border-nebula-border text-nebula-dim'
                            }`}
                            style={editTag === t.id ? { backgroundColor: t.color + '15', borderColor: t.color + '30', color: t.color } : undefined}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 hover:bg-neon-emerald/20 text-xs font-medium cursor-pointer transition-colors"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-nebula-muted hover:text-nebula-text text-xs cursor-pointer transition-colors"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => startEdit(note)}>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: tag.color + '15', color: tag.color }}
                            >
                              {tag.label}
                            </span>
                            <span className="text-[10px] text-nebula-dim flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-nebula-text mb-1 truncate">
                            {note.title || 'Untitled Note'}
                          </h3>
                          <p className="text-xs text-nebula-muted line-clamp-2 leading-relaxed whitespace-pre-wrap">
                            {note.content || 'No content'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1.5 rounded-lg text-nebula-dim hover:text-neon-cyan transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 rounded-lg text-nebula-dim hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
