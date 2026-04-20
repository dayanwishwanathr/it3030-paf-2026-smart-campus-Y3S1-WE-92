package com.sliit.orbit_backend.controller;

import com.sliit.orbit_backend.model.Resource;
import com.sliit.orbit_backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for the Facilities & Assets Catalogue (Module A).
 * Member 1 — Lakshitha
 *
 * Endpoints:
 *   GET    /api/resources              – list all / search by keyword
 *   GET    /api/resources/filter       – filter by type, location, status
 *   GET    /api/resources/{id}         – get single resource
 *   POST   /api/resources              – create resource (MANAGER only)
 *   PUT    /api/resources/{id}         – update resource (MANAGER only)
 *   DELETE /api/resources/{id}         – delete resource (MANAGER only)
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // ── GET /api/resources?search=... ─────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(resourceService.searchResources(search));
        }
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ── GET /api/resources/filter?type=&location=&status= ─────────────────────
    @GetMapping("/filter")
    public ResponseEntity<List<Resource>> filterResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(resourceService.filterResources(type, location, status));
    }

    // ── GET /api/resources/{id} ───────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // ── POST /api/resources ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.createResource(resource));
    }

    // ── PUT /api/resources/{id} ───────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    // ── DELETE /api/resources/{id} ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
