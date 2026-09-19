// src/api/notes.ts
import axios from '@/api/axios'

export async function fetchNotes() {
  const res = await axios.get('/api/notes/')
  return res.data
}

export async function createNote(content: string) {
  const res = await axios.post('/api/notes/', { content })
  return res.data
}

export async function deleteNote(id: string) {
  return axios.delete(`/api/notes/${id}/`)
}

export async function updateNote(id: string, content: string) {
  return axios.put(`/api/notes/${id}/`, { content })
}
