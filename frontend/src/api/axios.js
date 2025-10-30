import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

// attach token if available
const token = localStorage.getItem('token')
if(token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default instance
