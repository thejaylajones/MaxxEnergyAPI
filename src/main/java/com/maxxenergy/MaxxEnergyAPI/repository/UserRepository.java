package com.maxxenergy.MaxxEnergyAPI.repository;

import com.maxxenergy.MaxxEnergyAPI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
