package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    List<User> findByPhoneEndingWith(String phoneSuffix);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
