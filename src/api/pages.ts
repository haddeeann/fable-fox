import axios from '@/api/axios'
import axiosPublic from '@/api/axios_public'
import { useStoreAuth } from '@/stores/storeAuth'

export type ZinePage = {
  id: number
  image: number
  image_url: string
  width: number
  height: number
  order: number
}

export type PageUploadResult = {
  index: number
  filename: string
  success: boolean
  page?: ZinePage
  error?: string
}

export async function bulkUpload(zineId: number, files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const response = await axios.post<{ results: PageUploadResult[] }>(
    `/api/zines/${zineId}/pages/bulk/`,
    formData,
  )
  return response.data.results
}

export async function reorder(zineId: number, pages: Array<{ page_id: number; order: number }>) {
  const response = await axios.patch<ZinePage[]>(`/api/zines/${zineId}/pages/reorder/`, pages)
  return response.data
}

export async function deletePage(zineId: number, pageId: number) {
  await axios.delete(`/api/zines/${zineId}/pages/${pageId}/`)
}

export async function fetchZineBySlug(slug: string) {
  const client = useStoreAuth().isLoggedIn ? axios : axiosPublic
  const response = await client.get(`/api/zines/${encodeURIComponent(slug)}/`)
  return response.data
}
