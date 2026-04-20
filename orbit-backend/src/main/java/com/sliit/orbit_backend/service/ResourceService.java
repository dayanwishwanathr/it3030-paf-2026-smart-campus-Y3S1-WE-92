package com.sliit.orbit_backend.service;

import com.sliit.orbit_backend.model.Resource;
import com.sliit.orbit_backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
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
        resourceRepository.delete(existing);
    }

    public List<Resource> searchResources(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllResources();
        }
        return resourceRepository.searchResources(keyword);
    }
}
