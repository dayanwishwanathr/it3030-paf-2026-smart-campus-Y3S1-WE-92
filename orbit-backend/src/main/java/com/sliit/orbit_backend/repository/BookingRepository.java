package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.Booking;
import com.sliit.orbit_backend.model.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Booking persistence.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
}
