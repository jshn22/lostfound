import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function ProfilePage(){
  const { user, logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // color palette for category boxes
  const COLORS = ['#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#f97316','#06b6d4','#ec4899','#0ea5a4','#84cc16']

  const colorFor = (val="") => {
    if(!val) return COLORS[0]
    let h = 0
    for(let i=0;i<val.length;i++) h = val.charCodeAt(i) + ((h<<5)-h)
    return COLORS[Math.abs(h) % COLORS.length]
  }

  const textColorFor = (hex) => {
    // convert hex to rgb and compute luminance
    const c = hex.replace('#','')
    const r = parseInt(c.substring(0,2),16)
    const g = parseInt(c.substring(2,4),16)
    const b = parseInt(c.substring(4,6),16)
    const luminance = (0.2126*r + 0.7152*g + 0.0722*b) / 255
    return luminance > 0.65 ? '#111827' : '#ffffff'
  }

  useEffect(()=>{
    const fetchUserItems = async ()=>{
      try{
        const res = await axios.get('/api/items')
        const all = res.data.items || []
        const mine = all.filter(i => i.postedBy?._id === user?.id || i.postedBy === user?.id)
        setItems(mine)
      }catch(err){ toast.error('Could not load your items') }finally{ setLoading(false) }
    }
    if(user) fetchUserItems()
    else setLoading(false)
  },[user])

  const handleDelete = async (id) => {
    if(!confirm('Delete this item?')) return;
    try{
      await axios.delete(`/api/items/${id}`)
      setItems(prev => prev.filter(i=>i._id !== id))
      toast.success('Deleted')
    }catch(err){ toast.error(err.response?.data?.message || 'Delete failed') }
  }

  if(loading) return <div className="text-center py-16">Loading...</div>
  if(!user) return <div className="text-center py-16">Please login to view your profile</div>

  const initials = user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : 'U'

  return (
    <div className="space-y-8">
      {/* large profile header card */}
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-primary flex items-center justify-center text-2xl font-bold">{initials}</div>
          <div>
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold">{items.length}</div>
            <div className="text-sm text-gray-500">Total posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{new Date().toLocaleString('en-US',{month:'short', year:'numeric'})}</div>
            <div className="text-sm text-gray-500">Joined</div>
          </div>
          <div>
            <button onClick={()=>{ logout(); toast.info('Logged out'); }} className="px-4 py-2 bg-red-50 text-red-500 rounded">Logout</button>
          </div>
        </div>
      </div>

      {/* Your posts header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <Link to="/add" className="px-4 py-2 bg-blue-600 text-white rounded shadow">+ Create Post</Link>
      </div>

      {/* posts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => {
          const bg = colorFor(item.category || item._id || item.title)
          const fg = textColorFor(bg)
          return (
            <div key={item._id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-transform transform hover:scale-102 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] flex-shrink-0 rounded-lg flex items-center justify-center font-semibold text-sm p-2 text-center break-words whitespace-normal overflow-hidden" style={{backgroundColor: bg, color: fg}}>
                  <div className="leading-tight">{item.category || 'Item'}</div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <span className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">{item.status}</span>
                    <div className="text-sm text-gray-500">{item.location}</div>
                  </div>
                  <p className="mt-2 text-gray-700">{item.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <Link to={`/items/${item._id}`} className="flex items-center gap-2 hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      View
                    </Link>
                    <Link to={`/edit/${item._id}`} className="flex items-center gap-2 hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </Link>
                    <button onClick={()=>handleDelete(item._id)} className="flex items-center gap-2 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
