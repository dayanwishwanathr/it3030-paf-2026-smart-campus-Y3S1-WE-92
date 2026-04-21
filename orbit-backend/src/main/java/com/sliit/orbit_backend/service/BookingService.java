package com.sliit.orbit_backend.service;

import com.sliit.orbit_backend.dto.request.BookingRequest;
import com.sliit.orbit_backend.dto.request.StatusUpdateRequest;
import com.sliit.orbit_backend.dto.response.BookingResponse;
import com.sliit.orbit_backend.model.Booking;
import com.sliit.orbit_backend.model.enums.BookingStatus;
import com.sliit.orbit_backend.repository.BookingRepository;
import com.sliit.orbit_backend.repository.ResourceRepository;
import com.sliit.orbit_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for the Booking Management module (Module B).
 * Member 2 — Sachila Weerasinghe
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository    bookingRepository;
    private final ResourceRepository   resourceRepository;
    private final UserRepository       userRepository;
    private final NotificationService  notificationService;
    private final MongoTemplate        mongoTemplate;

    // ── Read / List ───────────────────────────────────────────────────────────

    /**
     * Returns bookings belonging to the caller.
     * Optional status filter applied when provided.
     */
    public List<BookingResponse> getMyBookings(String userId, BookingStatus status) {
        List<Booking> bookings = (status != null)
                ? bookingRepository.findByUserIdAndStatusOrderByDateDescStartTimeDesc(userId, status)
                : bookingRepository.findByUserIdOrderByDateDescStartTimeDesc(userId);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Returns ALL bookings with optional dynamic filters.
     * Intended for ADMIN and MANAGER roles.
     */
    public List<BookingResponse> getAllBookings(BookingStatus status, String resourceId, String date) {
        Query query = new Query();

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (resourceId != null && !resourceId.isBlank()) {
            query.addCriteria(Criteria.where("resourceId").is(resourceId));
        }
        if (date != null && !date.isBlank()) {
            LocalDate parsedDate = LocalDate.parse(date);
            query.addCriteria(Criteria.where("date").is(parsedDate));
        }

        List<Booking> bookings = mongoTemplate.find(query, Booking.class);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Returns a single booking by ID.
     * Owners can access their own; ADMIN/MANAGER can access any.
     */
    public BookingResponse getBookingById(String id, String callerUserId, String callerRole) {
        Booking booking = findById(id);
        boolean isOwner = booking.getUserId().equals(callerUserId);
        boolean isPrivileged = "ADMIN".equals(callerRole) || "MANAGER".equals(callerRole);
        if (!isOwner && !isPrivileged) {
            throw new RuntimeException("Access denied: you do not own this booking");
        }
        return toResponse(booking);
    }

    // ── Dashboard stat helpers ────────────────────────────────────────────────

    public long countMyBookings(String userId) {
        return bookingRepository.countByUserId(userId);
    }

    public long countMyBookingsByStatus(String userId, BookingStatus status) {
        return bookingRepository.countByUserIdAndStatus(userId, status);
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    /**
     * Creates a new PENDING booking after validating the time range.
     * Conflict detection is added in the next step.
     */
    public BookingResponse createBooking(BookingRequest request, String userId) {
        java.time.LocalDate date      = java.time.LocalDate.parse(request.getDate());
        java.time.LocalTime startTime = java.time.LocalTime.parse(request.getStartTime());
        java.time.LocalTime endTime   = java.time.LocalTime.parse(request.getEndTime());

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Verify resource exists
        resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException(
                        "Resource not found with id: " + request.getResourceId()));

        // Check for conflicting bookings
        checkConflicts(request.getResourceId(), date, startTime, endTime);

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(userId)
                .date(date)
                .startTime(startTime)
                .endTime(endTime)
                .purpose(request.getPurpose())
                .attendees(request.getAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    private void checkConflicts(String resourceId, java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(resourceId, date, startTime, endTime);
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("The resource is already booked during this time window.");
        }
    }

    public BookingResponse approve(String id, String notes, String actorRole) {
        Booking booking = findById(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }
        booking.setStatus(BookingStatus.APPROVED);
        booking.setNotes(notes);
        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getUserId(),
                "BOOKING_APPROVED",
                "Your booking for " + dateString(booking) + " was approved.",
                booking.getId()
        );
        return toResponse(saved);
    }

    public BookingResponse reject(String id, String notes, String actorRole) {
        Booking booking = findById(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setNotes(notes);
        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getUserId(),
                "BOOKING_REJECTED",
                "Your booking for " + dateString(booking) + " was rejected. Reason: " + notes,
                booking.getId()
        );
        return toResponse(saved);
    }

    public BookingResponse cancel(String id, String callerUserId, String callerRole) {
        Booking booking = findById(id);
        boolean isOwner = booking.getUserId().equals(callerUserId);
        boolean isAdmin = "ADMIN".equals(callerRole);

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access denied: cannot cancel this booking");
        }
        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public void deleteBooking(String id, String actorRole) {
        if (!"ADMIN".equals(actorRole)) {
            throw new RuntimeException("Access denied: only ADMIN can delete bookings");
        }
        Booking booking = findById(id);
        bookingRepository.delete(booking);
    }

    private String dateString(Booking b) {
        return b.getDate().toString() + " at " + b.getStartTime().toString();
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    Booking findById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /** Maps a Booking document to a BookingResponse DTO with denormalized names. */
    BookingResponse toResponse(Booking b) {
        String resourceName = resourceRepository.findById(b.getResourceId())
                .map(r -> r.getName()).orElse("Unknown Resource");
        String userName = userRepository.findById(b.getUserId())
                .map(u -> u.getName()).orElse("Unknown User");

        return BookingResponse.builder()
                .id(b.getId())
                .resourceId(b.getResourceId())
                .resourceName(resourceName)
                .userId(b.getUserId())
                .userName(userName)
                .date(b.getDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .attendees(b.getAttendees())
                .status(b.getStatus())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
