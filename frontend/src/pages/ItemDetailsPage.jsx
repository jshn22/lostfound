import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ItemDetailsPage(){
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchItem = async ()=>{
      try{
        const res = await axios.get(`/api/items/${id}`)
        setItem(res.data)
      }catch(err){
        toast.error('Could not load item')
      }finally{ setLoading(false) }
    }
    fetchItem()
  },[id])

  if(loading) return <div className="text-center py-16">Loading...</div>
  if(!item) return <div className="text-center py-16">Item not found</div>

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow fade-in">
      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-72 object-cover rounded mb-4 img-smooth" />}
      <h2 className="text-2xl font-semibold">{item.title}</h2>
      <p className="text-sm text-gray-500">{item.location} · {item.status} · Posted by {item.postedBy?.name}</p>
      <p className="mt-4 text-gray-700">{item.description}</p>
      <div className="mt-4 text-sm text-gray-500">Posted at: {new Date(item.createdAt).toLocaleString()}</div>
    </div>
  )
}
