import { defineStore } from 'pinia'
import axios, { setTokens, clearTokens, getAccess } from '@/api/axios'

import { useStoreNotes } from '@/stores/storeNotes'

function loginErrorMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
  if (typeof detail === 'string' && detail.trim()) {
    if (detail.toLowerCase().includes('no active account')) {
      return 'Username or password is incorrect.'
    }
    return detail
  }
  return 'Unable to log in. Check your username and password.'
}

type Credentials = {
  username: string
  password: string
}

export type User = {
  id: number
  username: string
  token: string
  role: 'admin' | 'editor' | 'writer'
}

export const useStoreAuth = defineStore('storeAuth', {
  state: () => ({
    user: null as User | null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async registerUser(credentials: Credentials): Promise<boolean> {
      try {
        await axios.post('/api/auth/register/', credentials)
        // Now auto-login right after
        await this.logInUser(credentials)
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    async logInUser(credentials: Credentials): Promise<User | null> {
      try {
        const res = await axios.post('/api/auth/login/', credentials)

        const access = res.data.access
        const refresh = res.data.refresh
        if (!access) {
          throw new Error('Login did not return an access token.')
        }
        setTokens(access, refresh)

        const userRes = await axios.get('/api/auth/current_user/', {
          headers: { Authorization: `Bearer ${access}` },
        })
        this.setSession(userRes.data, access)
        this.router.push('/')
        return this.user
      } catch (err) {
        console.error(err)
        const hasApiDetail = Boolean(
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        )
        if (err instanceof Error && !hasApiDetail) {
          throw err
        }
        throw new Error(loginErrorMessage(err))
      }
    },
    async restoreSession(): Promise<void> {
      if (this.user || !getAccess()) return
      try {
        const userRes = await axios.get('/api/auth/current_user/')
        this.setSession(userRes.data, getAccess() || '')
      } catch {
        this.user = null
        clearTokens()
      }
    },
    setSession(userData: { id: number; username: string; role: User['role'] }, access: string) {
      this.user = {
        id: userData.id,
        username: userData.username,
        token: access,
        role: userData.role,
      }
    },
    logOutUser() {
      this.user = null
      clearTokens()
      this.router.replace('/auth')
      useStoreNotes().clearNotes()
    },
  },
})
