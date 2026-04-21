import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { bookingApi } from '../../api/bookingApi'
import axiosInstance from '../../api/axiosInstance'

const BookResourcePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialResourceId = searchParams.get('resourceId')

  const [resources, setResources] = useState([])
  const [loadingResources, setLoadingResources] = useState(!initialResourceId)
  
  const [formData, setFormData] = useState({
    resourceId: initialResourceId || '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch resources if no specific resource is selected yet
  useEffect(() => {
    if (!initialResourceId) {
      axiosInstance.get('/resources')
        .then(res => {
          setResources(res.data)
          setLoadingResources(false)
        })
        .catch(err => {
          console.error(err)
          setLoadingResources(false)
        })
    }
  }, [initialResourceId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await bookingApi.createBooking(formData)
      navigate('/bookings')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const step1 = !formData.resourceId

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Book a Resource</h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {step1 ? (
          <div className="space-y-4">
            <p className="text-slate-400 mb-4">Please select a resource to book:</p>
            {loadingResources ? (
              <p className="text-slate-500">Loading resources...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resources.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setFormData(prev => ({ ...prev, resourceId: res.id }))}
                    className="glass-card-btn p-5 text-left flex flex-col gap-2"
                  >
                    <span className="text-white font-semibold">{res.name}</span>
                    <span className="text-xs text-slate-400">{res.type} • {res.location} • Capacity: {res.capacity}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
            {!initialResourceId && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-cyan-400 font-semibold">Resource Selected</span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, resourceId: '' }))}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Change
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="input-glass"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className="input-glass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Purpose</label>
              <input
                type="text"
                name="purpose"
                required
                placeholder="e.g., Team meeting, Project presentation"
                value={formData.purpose}
                onChange={handleChange}
                className="input-glass"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Expected Attendees</label>
              <input
                type="number"
                name="attendees"
                min="1"
                required
                value={formData.attendees}
                onChange={handleChange}
                className="input-glass"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-neon w-full py-3 mt-4"
            >
              <div className="btn-shimmer" />
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  )
}

export default BookResourcePage
