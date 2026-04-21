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
