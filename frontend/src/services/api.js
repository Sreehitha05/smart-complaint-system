import axios from 'axios'

const BASE_URL = 'http://localhost:8081'
const TOKEN_STORAGE_KEY = 'token'
const TIMEOUT_MS = 10000

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
  // Debug support: log outgoing requests
  // eslint-disable-next-line no-console
  console.log('[API request]', (config.method || 'GET').toUpperCase(), config.baseURL + (config.url || ''), {
    params: config.params,
    data: config.data,
  })
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    // eslint-disable-next-line no-console
    console.log('[API response]', res.status, res.config?.url, res.data)
    return res
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error('[API error]', {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      url: error?.config?.url,
      data: error?.response?.data,
    })
    const status = error?.response?.status
    if (status === 401) {
      clearToken()
      // Ensure we always land on login after auth expires.
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

function extractToken(data) {
  return (
    data?.token ??
    data?.jwt ??
    data?.accessToken ??
    data?.access_token ??
    data?.data?.token ??
    null
  )
}

export function isNetworkError(err) {
  return Boolean(err) && !err.response
}

export function getApiErrorMessage(err) {
  if (isNetworkError(err)) {
    return 'Server not running (cannot reach backend).'
  }
  const status = err?.response?.status
  if (status === 401) return 'Unauthorized. Please login again.'
  if (status === 403) return 'Forbidden.'
  const data = err?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  return (
    data?.message ||
    data?.error ||
    err?.message ||
    'Request failed.'
  )
}

export async function login({ email, password }) {
  // Backend AuthController expects `passwordHash` field.
  const res = await api.post('/api/auth/login', { email, passwordHash: password })
  const token =
    typeof res.data === 'string' ? res.data : extractToken(res.data)
  if (!token) {
    throw new Error('Login succeeded but no JWT token was returned by backend.')
  }
  setToken(token)
  return token
}

export async function registerUser({ name, email, password }) {
  const res = await api.post('/api/users', {
    name,
    email,
    passwordHash: password,
    role: 'USER',
  })
  return res.data
}

export async function fetchComplaints() {
  const res = await api.get('/api/complaints')
  return res.data
}

export async function createComplaint({ title, description, priority }) {
  const res = await api.post('/api/complaints', { title, description, priority })
  return res.data
}

