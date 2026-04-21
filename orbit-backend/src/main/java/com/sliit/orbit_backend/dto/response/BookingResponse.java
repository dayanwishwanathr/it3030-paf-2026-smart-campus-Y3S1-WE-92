package com.sliit.orbit_backend.dto.response;

import com.sliit.orbit_backend.model.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Response DTO returned to the client for booking data.
 * Includes denormalized resourceName for display convenience.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private String id;
    private String resourceId;
    private String resourceName;   // denormalized from Resource collection
    private String userId;
    private String userName;       // denormalized from User collection
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer attendees;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
