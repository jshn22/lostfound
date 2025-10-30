import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function ProfilePage(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchUserItems = async ()=>{
      try{
        const res = await axios.get('/api/items', { params: { poster: user?.id } })
        // backend doesn't support poster filter by default; we'll filter client-side
        const all = res.data.items || []
        setItems(all.filter(i => i.postedBy?._id === user?.id || i.postedBy === user?.id))
      }catch(err){ toast.error('Could not load your items') }finally{ setLoading(false) }
    }
    if(user) fetchUserItems()
    else setLoading(false)
  },[user])

  if(loading) return <div className="text-center py-16">Loading...</div>
  if(!user) return <div className="text-center py-16">Please login to view your profile</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.status} · {item.location}</p>
            <div className="mt-2 flex items-center justify-between">
              <Link to={`/items/${item._id}`} className="text-primary hover:underline">View</Link>
              <button onClick={async ()=>{
                if(!confirm('Delete this item?')) return;
                try{
                  await axios.delete(`/api/items/${item._id}`)
                  setItems(items.filter(i=>i._id !== item._id))
                  toast.success('Deleted')
                }catch(err){ toast.error('Delete failed') }
              }} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
