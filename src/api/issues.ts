import axios from '@/api/axios'
import axiosPublic from '@/api/axios_public'
import { useStoreAuth } from '@/stores/storeAuth'
import type { Issue, IssueInput } from '@/stores/storeIssues'

function clientForRead() {
  return useStoreAuth().isLoggedIn ? axios : axiosPublic
}

export async function fetchIssues(): Promise<Issue[]> {
  return (await clientForRead().get('/api/issues/')).data
}

export async function fetchIssue(id: number): Promise<Issue> {
  return (await clientForRead().get(`/api/issues/${id}/`)).data
}

export async function createIssue(data: IssueInput): Promise<Issue> {
  return (await axios.post('/api/issues/', data)).data
}

export async function updateIssue(id: number, data: Partial<IssueInput>): Promise<Issue> {
  return (await axios.patch(`/api/issues/${id}/`, data)).data
}

export async function reorderIssue(id: number, pieces: Array<{ id: number; order: number }>): Promise<Issue> {
  return (await axios.patch(`/api/issues/${id}/reorder/`, { pieces })).data
}
