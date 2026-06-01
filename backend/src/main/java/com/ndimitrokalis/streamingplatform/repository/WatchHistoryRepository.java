package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {

    List<WatchHistory> findByUserIdOrderByLastWatchedAtDesc(Long userId);

    Optional<WatchHistory> findByUserIdAndMediaId(Long userId, Long mediaId);

    void deleteByUserId(Long userId);
}
