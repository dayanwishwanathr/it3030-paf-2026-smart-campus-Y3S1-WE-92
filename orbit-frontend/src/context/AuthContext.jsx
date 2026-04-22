import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  // On app load — if token exists, fetch current user from backend
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/me')
      // Store the fresh token returned by /auth/me (has up-to-date verified claim)
      if (data.token) localStorage.setItem('token', data.token)
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Called after login or Google OAuth — stores token and loads user
  const login = async (token) => {
    localStorage.setItem('token', token)
    try {
      const { data } = await axiosInstance.get('/auth/me')
      if (data.token) localStorage.setItem('token', data.token)
      setUser(data)

      const params    = new URLSearchParams(window.location.search)
      const returnUrl = params.get('returnUrl')

      if (returnUrl) {
        navigate(returnUrl)
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (data.role === 'MANAGER') {
        navigate('/manager/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch {
      localStorage.removeItem('token')
    }
  }

  // Called after profile update so UI reflects new verified state immediately
  const refreshUser = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/me')
      if (data.token) localStorage.setItem('token', data.token)
      setUser(data)
    } catch {
      // Silent fail — user stays as-is
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchCurrentUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
