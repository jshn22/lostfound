import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import Spinner from './Spinner'

export default function RequireAuth({ children }){
  const { user, loading } = useAuth()
  const location = useLocation()
  // while auth is rehydrating from localStorage, show spinner to avoid premature redirect
  if(loading) return <Spinner />
  if(!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
