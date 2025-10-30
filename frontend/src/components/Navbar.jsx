import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-primary">Lost & Found Hub</Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
          <Link to="/add" className="text-gray-700 hover:text-primary">Add Item</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-primary">Profile</Link>
              <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
              <Link to="/register" className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">Register</Link>
            </>
          )}
        </div>
        <MobileMenu user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}

function MobileMenu({ user, onLogout }){
  const [open, setOpen] = useState(false)
  return (
    <div className="md:hidden">
      <button onClick={()=>setOpen(!open)} className="p-2 rounded bg-gray-100">
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div className="absolute right-4 mt-12 w-48 bg-white shadow-lg rounded p-3 fade-in">
          <a href="/" className="block py-1">Home</a>
          <a href="/add" className="block py-1">Add Item</a>
          {user ? (
            <>
              <a href="/profile" className="block py-1">Profile</a>
              <button onClick={onLogout} className="mt-2 w-full text-left text-red-600">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="block py-1">Login</a>
              <a href="/register" className="block py-1">Register</a>
            </>
          )}
        </div>
      )}
    </div>
  )
}
