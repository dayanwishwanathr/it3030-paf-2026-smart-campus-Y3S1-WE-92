import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const OAuth2Success = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (token) {
      login(token)
    } else {
      // No token in URL — something went wrong
      navigate('/login')
    }
  }, [])

  return <LoadingSpinner />
}

export default OAuth2Success
