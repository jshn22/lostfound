import axios from 'axios'

// Normalize base URL so callers can safely use paths like '/api/items'
// Accepts either a host (http://localhost:5000) or a host with '/api'
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const normalizeBase = (b) => {
  if (!b) return b
  // remove trailing slashes
    b = b.replace(/\/+$/, '')
  // if user included '/api' at the end, strip it so requests using '/api/...' don't duplicate
  if (b.toLowerCase().endsWith('/api')) return b.slice(0, -4)
  return b
}

const instance = axios.create({
  baseURL: normalizeBase(rawBase)
})

// attach token if available
const token = localStorage.getItem('token')
if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default instance
