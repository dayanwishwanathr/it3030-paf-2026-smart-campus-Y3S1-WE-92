package com.sliit.orbit_backend.model.enums;

/**
 * Lifecycle states for a booking request.
 *
 * Allowed transitions:
 *   PENDING  → APPROVED  (by MANAGER or ADMIN)
 *   PENDING  → REJECTED  (by MANAGER or ADMIN, must supply notes/reason)
 *   APPROVED → CANCELLED (by the booking owner OR ADMIN)
 *   APPROVED → COMPLETED (future: scheduled batch or manual close)
 *
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED,
    COMPLETED
}
