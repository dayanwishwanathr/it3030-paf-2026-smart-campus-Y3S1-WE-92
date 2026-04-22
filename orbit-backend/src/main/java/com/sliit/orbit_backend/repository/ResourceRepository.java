package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for the Facilities & Assets Catalogue (Module A).
 * Member 1 — Lakshitha
 */
@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(String type);
    List<Resource> findByLocation(String location);
    List<Resource> findByAvailabilityStatus(String availabilityStatus);

    /**
     * Full-text search across name, location and type.
     */
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, " +
                    "{ 'location': { $regex: ?0, $options: 'i' } }, " +
                    "{ 'type': { $regex: ?0, $options: 'i' } } ] }")
    List<Resource> searchResources(String keyword);

}
