import axiosInstance from './axiosInstance'

/**
 * Client API helpers for Incident Ticketing (Module C).
 * Member 3 — Shiroshi Fernando
 */
export const ticketApi = {

  // ── Tickets ────────────────────────────────────────────────────────────────

  /** List tickets (role-based view). Optional status filter. */
  getTickets: (status) =>
    axiosInstance.get('/tickets', { params: status ? { status } : {} }).then(r => r.data),

  /** Get a single ticket with comments + attachments. */
  getTicketById: (id) =>
    axiosInstance.get(`/tickets/${id}`).then(r => r.data),

  /** Create a new ticket. */
  createTicket: (data) =>
    axiosInstance.post('/tickets', data).then(r => r.data),

  /** Update ticket status (status, resolutionNotes, rejectionReason). */
  updateStatus: (id, data) =>
    axiosInstance.patch(`/tickets/${id}/status`, data).then(r => r.data),

  /** Assign a technician to a ticket. */
  assignTechnician: (id, assignedTo) =>
    axiosInstance.patch(`/tickets/${id}/assign`, { assignedTo }).then(r => r.data),

  /** TECHNICIAN self-assigns an OPEN ticket. */
  claimTicket: (id) =>
    axiosInstance.patch(`/tickets/${id}/claim`).then(r => r.data),

  /** Get list of all technician users (ADMIN/MANAGER). */
  getTechnicians: () =>
    axiosInstance.get('/tickets/technicians').then(r => r.data),

  /** Get aggregated SLA stats (ADMIN/MANAGER/TECHNICIAN). */
  getStats: () =>
    axiosInstance.get('/tickets/stats').then(r => r.data),

  /** Delete a ticket (owner or ADMIN). */
  deleteTicket: (id) =>
    axiosInstance.delete(`/tickets/${id}`).then(r => r.data),

  // ── Comments ───────────────────────────────────────────────────────────────

  /** Add a comment to a ticket. */
  addComment: (ticketId, body) =>
    axiosInstance.post(`/tickets/${ticketId}/comments`, { body }).then(r => r.data),

  /** Edit your own comment. */
  editComment: (commentId, body) =>
    axiosInstance.put(`/tickets/comments/${commentId}`, { body }).then(r => r.data),

  /** Delete a comment (owner or ADMIN). */
  deleteComment: (commentId) =>
    axiosInstance.delete(`/tickets/comments/${commentId}`).then(r => r.data),

  // ── Attachments ────────────────────────────────────────────────────────────

  /** Upload an image attachment (max 3 per ticket). */
  uploadAttachment: (ticketId, file) => {
    const form = new FormData()
    form.append('file', file)
    return axiosInstance.post(`/tickets/${ticketId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  /** Returns the URL to download/view an attachment inline. */
  getAttachmentUrl: (attachmentId) => `/api/tickets/attachments/${attachmentId}`,
}

// ── Notifications (re-export for convenience) ─────────────────────────────────

export const notificationApi = {

  getAll: () =>
    axiosInstance.get('/notifications').then(r => r.data),

  getUnreadCount: () =>
    axiosInstance.get('/notifications/unread-count').then(r => r.data.count),

  markRead: (id) =>
    axiosInstance.patch(`/notifications/${id}/read`).then(r => r.data),

  markAllRead: () =>
    axiosInstance.patch('/notifications/read-all').then(r => r.data),

  delete: (id) =>
    axiosInstance.delete(`/notifications/${id}`).then(r => r.data),
}
