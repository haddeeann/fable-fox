import { defineStore } from 'pinia'
import { fetchNotes, createNote, deleteNote, updateNote } from '@/api/notes'
import { useStoreAuth } from './storeAuth'

export type Note = {
  id: string
  date: string
  content: string
}

export const useStoreNotes = defineStore('storeNotes', {
  state: (): { notes: Note[] } => ({
    notes: [],
  }),
  actions: {
    async getNotes() {
      const storeAuth = useStoreAuth()
      if (!storeAuth.user) return
      this.notes = await fetchNotes()
    },
    async addNote(content: string) {
      const storeAuth = useStoreAuth()
      if (!storeAuth.user) return
      const note = await createNote(content)
      this.notes.unshift(note)
    },
    async deleteNote(id: string) {
      await deleteNote(id)
      this.notes = this.notes.filter(n => n.id !== id)
    },
    async updateNote(id: string, content: string) {
      await updateNote(id, content)
      const note = this.notes.find(n => n.id === id)
      if (note) note.content = content
    },
    clearNotes() {
      this.notes = []
    },
  },
  getters: {
    getNoteContent: (state) => {
      return function findNoteContent(id: string) {
        const note = state.notes.find((n) => n.id === id)
        return note?.content || ''
      }
    },
    totalNotesCount: (state) => state.notes.length,
    totalCharactersCount: (state) =>
      state.notes.reduce((sum, note) => sum + note.content.length, 0),
  },
})
