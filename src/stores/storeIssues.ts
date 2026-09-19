import { defineStore } from 'pinia'
import { createIssue, fetchIssue, fetchIssues, reorderIssue, updateIssue } from '@/api/issues'
import type { Post } from '@/stores/storePosts'

export type IssueStatus = 'draft' | 'published'
export type IssueTheme = 'default' | 'riso' | 'newsprint'

export type Issue = {
  id: number
  title: string
  number: number
  cover_image: string | null
  cover_image_url: string
  editors_letter: string
  status: IssueStatus
  published_at: string | null
  theme: IssueTheme
  pieces: Post[]
}

export type IssueInput = {
  title: string
  number: number
  cover_image?: string | null
  editors_letter?: string
  status?: IssueStatus
  theme?: IssueTheme
}

export const useStoreIssues = defineStore('storeIssues', {
  state: () => ({ issues: [] as Issue[], currentIssue: null as Issue | null }),
  actions: {
    async getIssues() {
      this.issues = await fetchIssues()
    },
    async getIssue(id: number) {
      this.currentIssue = await fetchIssue(id)
      return this.currentIssue
    },
    async addIssue(data: IssueInput) {
      const issue = await createIssue(data)
      this.issues.unshift(issue)
      return issue
    },
    async saveIssue(id: number, data: Partial<IssueInput>) {
      this.currentIssue = await updateIssue(id, data)
      return this.currentIssue
    },
    async reorder(id: number, pieces: Array<{ id: number; order: number }>) {
      this.currentIssue = await reorderIssue(id, pieces)
      return this.currentIssue
    },
  },
})
