import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function HomePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ status: '', category: '', location: '', q: '' })

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/items', { params: filters })
      setItems(res.data.items || [])
    } catch (err) {
      toast.error('Could not load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const applyFilters = () => fetchItems()

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input placeholder="Search..." value={filters.q} onChange={e => setFilters({...filters, q: e.target.value})} className="p-2 rounded border" />
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="p-2 rounded border">
          <option value="">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input placeholder="Location" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} className="p-2 rounded border" />
        <input placeholder="Category" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="p-2 rounded border" />
        <div className="md:col-span-4 flex gap-2">
          <button onClick={applyFilters} className="px-4 py-2 bg-primary text-white rounded">Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="bg-white rounded p-4 skeleton h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded shadow p-4 card-hover fade-in">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-44 object-cover rounded mb-3 img-smooth" />}
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.location} · {item.status}</p>
              <p className="mt-2 text-gray-700">{item.description.slice(0, 120)}{item.description.length > 120 ? '...' : ''}</p>
              <div className="mt-3 flex justify-between items-center">
                <Link to={`/items/${item._id}`} className="text-primary hover:underline">View</Link>
                <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
