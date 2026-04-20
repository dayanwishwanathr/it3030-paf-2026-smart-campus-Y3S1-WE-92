package com.sliit.orbit_backend.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    private String description;
    private String imageUrl;

    private String availabilityStatus = "ACTIVE"; // e.g. ACTIVE, OUT_OF_SERVICE

    private String availableFrom; // e.g. "08:00"
    private String availableTo;   // e.g. "18:00"

    @org.springframework.data.annotation.CreatedDate
    private java.time.Instant createdAt;

    @org.springframework.data.annotation.LastModifiedDate
    private java.time.Instant updatedAt;
}
