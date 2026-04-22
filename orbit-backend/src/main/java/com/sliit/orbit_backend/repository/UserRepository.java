package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByCampusId(String campusId);

    java.util.List<User> findByRoleIn(java.util.List<com.sliit.orbit_backend.model.enums.Role> roles);
}
