import { defineStore } from 'pinia'
import axios, { setTokens, clearTokens } from '@/api/axios'

import { useStoreNotes } from '@/stores/storeNotes'

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
        setTokens(access, refresh)

        const userRes = await axios.get('/api/auth/current_user/')
        const userData = userRes.data

        // fetched user
        this.user = {
          id: userData.id,
          username: userData.username,
          token: access,
          role: userData.role,
        }

        this.router.push('/')
        return this.user
      } catch (err) {
        console.error(err)
        return null
      }
    },
    logOutUser() {
      this.user = null
      clearTokens()
      delete axios.defaults.headers.common['Authorization']
      this.router.replace('/auth')
      useStoreNotes().clearNotes()
    },
  },
})
