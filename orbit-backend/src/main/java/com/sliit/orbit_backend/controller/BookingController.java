package com.sliit.orbit_backend.controller;

import com.sliit.orbit_backend.dto.response.BookingResponse;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.BookingStatus;
import com.sliit.orbit_backend.repository.UserRepository;
import com.sliit.orbit_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Booking Management (Module B).
 * Member 2 — Sachila Weerasinghe
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    // ── Read Endpoints ────────────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(bookingService.getMyBookings(userId, status));
    }

    /**
     * Returns all bookings for a specific resource on a specific date.
     * Used by the Availability Viewer feature.
     * Accessible to all authenticated users.
     */
    @GetMapping("/availability")
    public ResponseEntity<List<BookingResponse>> getAvailability(
            @RequestParam String resourceId,
            @RequestParam String date,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.getAvailabilityForDate(resourceId, date));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, resourceId, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role = getRole(authentication);
        return ResponseEntity.ok(bookingService.getBookingById(id, userId, role));
    }

    // ── Write Endpoints ───────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @jakarta.validation.Valid @RequestBody com.sliit.orbit_backend.dto.request.BookingRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(bookingService.createBooking(request, userId));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) com.sliit.orbit_backend.dto.request.StatusUpdateRequest request,
            Authentication authentication) {
        String role = getRole(authentication);
        String notes = request != null ? request.getNotes() : null;
        return ResponseEntity.ok(bookingService.approve(id, notes, role));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable String id,
            @jakarta.validation.Valid @RequestBody com.sliit.orbit_backend.dto.request.StatusUpdateRequest request,
            Authentication authentication) {
        String role = getRole(authentication);
        return ResponseEntity.ok(bookingService.reject(id, request.getNotes(), role));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role = getRole(authentication);
        return ResponseEntity.ok(bookingService.cancel(id, userId, role));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable String id,
            Authentication authentication) {
        String role = getRole(authentication);
        bookingService.deleteBooking(id, role);
        return ResponseEntity.noContent().build();
    }

    // ── Internal Helpers ──────────────────────────────────────────────────────

    private String getUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
    }
}
