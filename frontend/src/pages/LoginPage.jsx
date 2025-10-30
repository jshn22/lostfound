import React, { useState } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      const res = await axios.post('/api/auth/login', { email, password })
      login(res.data.token, res.data.user)
      toast.success('Logged in')
      navigate('/')
    }catch(err){
      toast.error(err.response?.data?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow fade-in">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-primary text-white rounded disabled:opacity-60">{loading? 'Loading...':'Login'}</button>
      </form>
    </div>
  )
}
