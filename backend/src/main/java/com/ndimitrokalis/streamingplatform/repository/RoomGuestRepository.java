package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.RoomGuest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomGuestRepository extends JpaRepository<RoomGuest, Long> {

    List<RoomGuest> findBySessionId(Long sessionId);

    boolean existsBySessionIdAndUserId(Long sessionId, Long userId);

    List<RoomGuest> findByUserIdAndSessionActiveTrue(Long userId);

    void deleteBySessionIdAndUserId(Long sessionId, Long userId);
}
