// src/stores/storePosts.ts
import { defineStore } from 'pinia'
import { fetchPostsByAuthor, fetchPublishedPosts, createPost, deletePost } from '@/api/posts'
import { useStoreAuth } from './storeAuth'
import type { ZinePage } from '@/api/pages'

export type Post = {
  id: number
  title: string
  slug: string,
  content: string
  status: 'submitted' | 'in_review' | 'approved' | 'published'
  issue: number | null
  order: number
  created_at: string
  updated_at: string,
  author: {
    id: number
    username: string
    full_name: string
    avatar_url: string
    bio: string
  },
  author_id: number
  tags: Array<string>
  pages?: ZinePage[]
}

export const useStorePosts = defineStore('storePosts', {
  state: () => ({
    userPosts: [] as Post[],
    publishedPosts: [] as Post[],
  }),
  actions: {
    // Fetch the logged-in user's posts
    async getUserPosts() {
      const storeAuth = useStoreAuth()
      if (!storeAuth.user) return
      this.userPosts = await fetchPostsByAuthor(storeAuth.user.id)
    },
    async addPost(title: string, content: string) {
      const post = await createPost(title, content)
      this.userPosts.unshift(post)
    },
    async deletePost(id: number) {
      await deletePost(id)
      this.userPosts = this.userPosts.filter(post => post.id !== id)
    },
    // Fetch all published posts (for public views)
    async getPublishedPosts() {
      this.publishedPosts = await fetchPublishedPosts()
    }
  },
})
