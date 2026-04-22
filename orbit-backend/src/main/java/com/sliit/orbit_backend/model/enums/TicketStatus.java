package com.sliit.orbit_backend.model.enums;

/**
 * Lifecycle states for an incident ticket.
 *
 * Allowed transitions:
 *   OPEN        → IN_PROGRESS  (TECHNICIAN assigned or ADMIN)
 *   IN_PROGRESS → RESOLVED     (assigned TECHNICIAN or ADMIN)
 *   RESOLVED    → CLOSED       (ADMIN)
 *   Any active  → REJECTED     (ADMIN, must supply reason)
 *
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
public enum TicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED
}
