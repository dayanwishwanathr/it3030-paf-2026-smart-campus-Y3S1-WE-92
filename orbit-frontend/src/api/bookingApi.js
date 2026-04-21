import axiosInstance from './axiosInstance'

export const bookingApi = {
  // Read
  getMyBookings: (status) =>
    axiosInstance.get('/bookings/my', { params: { status } }).then(res => res.data),

  getAllBookings: (params) =>
    axiosInstance.get('/bookings', { params }).then(res => res.data),

  getBookingById: (id) =>
    axiosInstance.get(`/bookings/${id}`).then(res => res.data),

  // Write
  createBooking: (data) =>
    axiosInstance.post('/bookings', data).then(res => res.data),

  // Actions
  approveBooking: (id, notes) =>
    axiosInstance.patch(`/bookings/${id}/approve`, { status: 'APPROVED', notes }).then(res => res.data),

  rejectBooking: (id, notes) =>
    axiosInstance.patch(`/bookings/${id}/reject`, { status: 'REJECTED', notes }).then(res => res.data),

  cancelBooking: (id) =>
    axiosInstance.patch(`/bookings/${id}/cancel`).then(res => res.data),

  deleteBooking: (id) =>
    axiosInstance.delete(`/bookings/${id}`).then(res => res.data),
}
