package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.Booking;
import com.sliit.orbit_backend.model.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repository for Booking persistence.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // ── User-scoped queries ───────────────────────────────────────────────────

    List<Booking> findByUserIdOrderByDateDescStartTimeDesc(String userId);

    List<Booking> findByUserIdAndStatusOrderByDateDescStartTimeDesc(String userId, BookingStatus status);

    // ── Resource-scoped queries ───────────────────────────────────────────────

    List<Booking> findByResourceIdOrderByDateDescStartTimeDesc(String resourceId);

    // ── Status-scoped queries (admin/manager) ─────────────────────────────────

    List<Booking> findByStatusOrderByDateDescStartTimeDesc(BookingStatus status);

    // ── Date + resource queries ───────────────────────────────────────────────

    List<Booking> findByResourceIdAndDate(String resourceId, LocalDate date);

    // ── Conflict detection ────────────────────────────────────────────────────
    /**
     * Returns any PENDING or APPROVED booking for the same resource on the same date
     * whose time window overlaps with [requestStart, requestEnd).
     *
     * Overlap condition: existingStart < requestEnd  AND  existingEnd > requestStart
     */
    @Query("{ 'resourceId': ?0, 'date': ?1, " +
           "  'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "  'startTime': { $lt: ?3 }, " +
           "  'endTime':   { $gt: ?2 } }")
    List<Booking> findConflictingBookings(String resourceId,
                                          LocalDate date,
                                          LocalTime requestStart,
                                          LocalTime requestEnd);

    // ── Count helpers for dashboard stats ────────────────────────────────────

    long countByUserIdAndStatus(String userId, BookingStatus status);

    long countByUserId(String userId);
}
