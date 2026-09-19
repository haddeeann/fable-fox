import axios from '@/api/axios'
import axios_public from '@/api/axios_public'
import { useStoreAuth } from '@/stores/storeAuth'

function withPages<T extends { pages?: unknown[] }>(post: T): T {
  return { ...post, pages: post.pages ?? [] }
}

export async function fetchPostsByAuthor(authorId: number) {
  const res = await axios.get(`/api/posts/?author=${authorId}`)
  return Array.isArray(res.data) ? res.data.map(withPages) : res.data
}

export type PostPayload = {
  title: string
  content: string
  tags?: string[]
  status?: 'submitted' | 'in_review' | 'approved' | 'published'
  issue?: number | null
  order?: number
}

export async function createPost(title: string, content: string, extra: Partial<PostPayload> = {}) {
  const res = await axios.post('/api/posts/', { title, content, ...extra })
  return res.data
}

export async function deletePost(id: number) {
  const res = await axios.delete(`/api/posts/${id}/`)
  return res.data
}

export async function fetchPostById(id: number) {
  const storeAuth = useStoreAuth()
  const client = storeAuth.isLoggedIn ? axios : axios_public
  // allow the backend to determine if we get a post detail
  const res = await client.get(`/api/posts/${id}/`)
  return withPages(res.data)
}

export async function fetchPublishedPosts() {
  const res = await axios_public.get('/api/posts/published/')
  return Array.isArray(res.data) ? res.data.map(withPages) : res.data
}

// api/posts.ts
export async function updatePost(id: number, data: Partial<PostPayload>) {
  const res = await axios.patch(`/api/posts/${id}/`, data)
  return res.data
}

export async function submitPost(id: number) {
  const res = await axios.post(`/api/posts/${id}/submit/`)
  return res.data
}
