package com.sliit.orbit_backend.model;

import com.sliit.orbit_backend.model.enums.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Domain model for a resource booking.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Document(collection = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    /** The resource being booked (must reference an existing Resource document). */
    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    /** Set automatically from the JWT principal in BookingService – never supplied by client. */
    private String userId;

    /** Booking date – must not be in the past. */
    @NotNull(message = "Date is required")
    private LocalDate date;

    /** Start of the booking window, e.g. 09:00. */
    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    /** End of the booking window – validated to be after startTime in the service layer. */
    @NotNull(message = "End time is required")
    private LocalTime endTime;

    /** Short description of why the resource is needed. */
    @NotBlank(message = "Purpose is required")
    private String purpose;

    /** Optional expected number of attendees. */
    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees;

    /** Workflow state – starts as PENDING on creation. */
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    /** Admin/manager notes: rejection reason, approval comment, etc. */
    private String notes;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
