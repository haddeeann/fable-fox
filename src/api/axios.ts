import Axios from 'axios'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

let isRefreshing = false
let pendingQueue: { resolve: (v:any)=>void; reject: (e:any)=>void; config:any }[] = []

function onRefreshed(newAccess: string) {
  pendingQueue.forEach(({ resolve, config }) => {
    setAuthHeader(config, newAccess)
    resolve(axios(config))
  })
  pendingQueue = []
}

function setAuthHeader(config: { headers?: any }, token: string) {
  config.headers = config.headers || {}
  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    config.headers.Authorization = `Bearer ${token}`
  }
}

function getAccess() {
  return localStorage.getItem('access')
}
function getRefresh() {
  return localStorage.getItem('refresh')
}

function setTokens(access: string, refresh?: string) {
  localStorage.setItem('access', access)
  if (refresh) localStorage.setItem('refresh', refresh)
  axios.defaults.headers.common.Authorization = `Bearer ${access}`
}
function clearTokens() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  delete axios.defaults.headers.common.Authorization
}

const existingAccess = getAccess()
if (existingAccess) {
  axios.defaults.headers.common.Authorization = `Bearer ${existingAccess}`
}

function isCredentialRequest(config: { url?: string; baseURL?: string }) {
  const url = `${config.baseURL || ''}${config.url || ''}`
  return /\/api\/auth\/(login|register|refresh)\/?(\?|$)/.test(url)
}

// Attach Authorization on every request except login/register/refresh.
axios.interceptors.request.use((config) => {
  if (isCredentialRequest(config)) return config
  const access = getAccess()
  if (access) {
    setAuthHeader(config, access)
  }
  return config
})

// Refresh on 401s
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error?.response?.status

    // Avoid infinite loop & only try once per request.
    // Do not try to refresh in response to a failed login/register.
    if (status === 401 && original && !original._retry && !isCredentialRequest(original)) {
      original._retry = true

      const refresh = getRefresh()
      if (!refresh || isTokenExpired(refresh)) {
        clearTokens()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue up while a refresh is in flight
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: original })
        })
      }

      isRefreshing = true
      try {
        const { data } = await Axios.post(
          `${axios.defaults.baseURL}/api/auth/refresh/`,
          { refresh }
        )
        const newAccess = data.access
        setTokens(newAccess) // keep same refresh unless rotation enabled
        setAuthHeader(original, newAccess)
        onRefreshed(newAccess)
        return axios(original)
      } catch (e) {
        clearTokens()
        pendingQueue = []
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function decodeJwtPayload(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT')
  const payload = parts[1]
  // convert base64url -> base64
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const json = atob(padded)
  return JSON.parse(json)
}

const EXPIRY_LEEWAY_MS = 30_000 // 30s, match SIMPLE_JWT LEEWAY if set

function isTokenExpired(token: string | null) {
  if (!token) return true
  try {
    const { exp } = decodeJwtPayload(token)
    // consider leeway for clock skew/race with server
    return Date.now() >= exp * 1000 - EXPIRY_LEEWAY_MS
  } catch {
    // If we can’t decode, treat as expired (conservative)
    return true
  }
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('image', file)

  const { data } = await axios.post('/api/media/images/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  // data: { url, key }
  return data.url
}


export default axios
export { clearTokens, setTokens, getAccess, getRefresh, isTokenExpired, uploadImage }
