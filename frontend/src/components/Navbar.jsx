import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow w-full">
      <div className="w-full flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <Link to="/" aria-label="Lost & Found Hub" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-gray-900">Lost & Found Hub</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {renderNavLink('/', 'Home', isHome)}
          {renderNavLink('/add', 'Add Item', location.pathname === '/add')}
          {user ? (
            <>
              {renderNavLink('/profile', 'Profile', location.pathname === '/profile')}
              <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">Logout</button>
            </>
          ) : (
            <>
              {renderNavLink('/login', 'Login', location.pathname === '/login')}
              <Link to="/register" className={`ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark ${isHome ? 'animate-pulse' : ''}`}>Register</Link>
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

function renderNavLink(to, label, active){
  return (
    <div className="relative">
      <Link to={to} className={`text-gray-700 hover:text-primary px-1`}>{label}</Link>
      <div className="absolute left-0 -bottom-1 h-0.5 bg-primary transition-all duration-300" style={{width: active ? '100%' : '0%'}} />
    </div>
  )
}
