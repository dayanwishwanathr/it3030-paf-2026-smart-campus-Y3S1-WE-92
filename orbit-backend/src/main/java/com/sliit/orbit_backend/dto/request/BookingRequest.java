package com.sliit.orbit_backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Payload sent by the client when creating a new booking.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Data
public class BookingRequest {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    /** ISO date string: yyyy-MM-dd */
    @NotBlank(message = "Date is required")
    private String date;

    /** 24-hour time string: HH:mm */
    @NotBlank(message = "Start time is required")
    private String startTime;

    /** 24-hour time string: HH:mm */
    @NotBlank(message = "End time is required")
    private String endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees;
}
