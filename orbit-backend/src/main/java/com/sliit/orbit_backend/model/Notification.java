package com.sliit.orbit_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    private String userId;       // who receives this notification

    // Type values: BOOKING_APPROVED, BOOKING_REJECTED,
    //              TICKET_STATUS_CHANGED, NEW_COMMENT
    private String type;

    private String message;

    private String referenceId;  // bookingId or ticketId (for navigation)

    private boolean isRead;

    @CreatedDate
    private LocalDateTime createdAt;
}
