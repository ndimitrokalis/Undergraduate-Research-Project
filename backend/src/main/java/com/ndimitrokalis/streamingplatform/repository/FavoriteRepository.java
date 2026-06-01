package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdOrderByAddedAtDesc(Long userId);

    Optional<Favorite> findByUserIdAndMediaId(Long userId, Long mediaId);

    void deleteByUserIdAndMediaId(Long userId, Long mediaId);

    void deleteByUserId(Long userId);
}
