import React, { useState } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function AddItemPage(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', status:'lost', location:'', category:'' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e)=> setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!user) return toast.error('You must be logged in')
    setLoading(true)
    try{
      const data = new FormData()
      Object.keys(form).forEach(k=>data.append(k, form[k]))
      if(image) data.append('image', image)
      const res = await axios.post('/api/items', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Item posted')
      navigate(`/items/${res.data._id}`)
    }catch(err){
      toast.error(err.response?.data?.message || 'Failed to post')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Post Lost or Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4} required />
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="file" accept="image/*" onChange={e=>{
          const file = e.target.files[0]
          setImage(file)
        }} />
        {image && (
          <div className="mt-2">
            <img src={URL.createObjectURL(image)} alt="preview" className="w-48 h-32 object-cover rounded" />
          </div>
        )}
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-60">{loading? 'Posting...':'Post Item'}</button>
      </form>
    </div>
  )
}
