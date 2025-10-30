import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AddItemPage from './pages/AddItemPage'
import ItemDetailsPage from './pages/ItemDetailsPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add" element={<RequireAuth><AddItemPage /></RequireAuth>} />
            <Route path="/items/:id" element={<ItemDetailsPage />} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" />
      </div>
    </AuthProvider>
  )
}
