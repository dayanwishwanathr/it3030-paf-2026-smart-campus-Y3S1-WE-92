package com.sliit.orbit_backend.service;

import java.util.List;
import java.util.Objects;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.sliit.orbit_backend.model.Resource;
import com.sliit.orbit_backend.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service layer for the Facilities & Assets Catalogue (Module A).
 * Member 1 — Lakshitha
 */
@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(Objects.requireNonNull(id, "Resource id must not be null"))
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    /**
     * Full-text search across name, location and type (case-insensitive regex).
     */
    public List<Resource> searchResources(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllResources();
        }
        return resourceRepository.searchResources(keyword.trim());
    }

    /**
     * Filter by any combination of type, location, and availability status.
     * Null parameters are ignored (i.e. all values match).
     */
    public List<Resource> filterResources(String type, String location, String status) {
        Query query = new Query();
        if (type != null && !type.trim().isEmpty()) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (location != null && !location.trim().isEmpty()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }
        if (status != null && !status.trim().isEmpty()) {
            query.addCriteria(Criteria.where("availabilityStatus").is(status));
        }
        return mongoTemplate.find(query, Resource.class);
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public Resource createResource(Resource resource) {
        return resourceRepository.save(Objects.requireNonNull(resource, "Resource must not be null"));
    }

    public Resource updateResource(String id, Resource updatedResource) {
        Resource existing = getResourceById(id);
        existing.setName(updatedResource.getName());
        existing.setLocation(updatedResource.getLocation());
        existing.setType(updatedResource.getType());
        existing.setCapacity(updatedResource.getCapacity());
        existing.setDescription(updatedResource.getDescription());
        existing.setImageUrl(updatedResource.getImageUrl());
        existing.setAvailabilityStatus(updatedResource.getAvailabilityStatus());
        existing.setAvailableFrom(updatedResource.getAvailableFrom());
        existing.setAvailableTo(updatedResource.getAvailableTo());
        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(Objects.requireNonNull(existing, "Resource must not be null"));
    }
}
