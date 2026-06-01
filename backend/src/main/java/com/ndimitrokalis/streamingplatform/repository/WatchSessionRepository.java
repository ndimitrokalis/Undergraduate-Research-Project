package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.WatchSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchSessionRepository extends JpaRepository<WatchSession, Long> {

    Optional<WatchSession> findByRoomId(String roomId);

    List<WatchSession> findByHostIdAndActiveTrue(Long hostId);

    List<WatchSession> findByActiveTrue();

    List<WatchSession> findByHostId(Long hostId);
}
