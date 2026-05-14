package com.ndimitrokalis.streamingplatform.websocket;

import com.ndimitrokalis.streamingplatform.model.RoomGuest;
import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.model.WatchSession;
import com.ndimitrokalis.streamingplatform.repository.RoomGuestRepository;
import com.ndimitrokalis.streamingplatform.repository.UserRepository;
import com.ndimitrokalis.streamingplatform.repository.WatchSessionRepository;
import com.ndimitrokalis.streamingplatform.service.RedisSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HostTransferService {

    private final RedisSessionService redisSessionService;
    private final WatchSessionRepository watchSessionRepository;
    private final RoomGuestRepository roomGuestRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void checkHostTimeouts() {
        List<WatchSession> activeSessions = watchSessionRepository.findByActiveTrue();

        for (WatchSession session : activeSessions) {
            String roomId = session.getRoomId();
            String deadline = redisSessionService.getReconnectDeadline(roomId);
            if (deadline == null) continue;

            long deadlineEpoch = Long.parseLong(deadline);
            if (Instant.now().getEpochSecond() >= deadlineEpoch) {
                redisSessionService.clearReconnectDeadline(roomId);

                String nextUser = WebSocketEventListener.sessionMap.values().stream()
                        .filter(i -> i.roomId().equals(roomId))
                        .map(WebSocketEventListener.SessionInfo::userEmail)
                        .findFirst()
                        .orElse(null);

                if (nextUser != null) {
                    promoteUser(roomId, nextUser);
                }
            }
        }
    }

    @Transactional
    public boolean promoteUser(String roomId, String newHostEmail) {
        WatchSession session = watchSessionRepository.findByRoomId(roomId).orElse(null);
        if (session == null || !session.isActive()) return false;

        User newHost = userRepository.findByEmail(newHostEmail).orElse(null);
        if (newHost == null) return false;

        User oldHost = session.getHost();
        if (oldHost.getEmail().equals(newHostEmail)) return false;

        if (!roomGuestRepository.existsBySessionIdAndUserId(session.getId(), oldHost.getId())) {
            roomGuestRepository.save(RoomGuest.builder()
                    .session(session)
                    .user(oldHost)
                    .build());
        }

        roomGuestRepository.deleteBySessionIdAndUserId(session.getId(), newHost.getId());

        redisSessionService.setHost(roomId, newHost.getEmail());
        redisSessionService.addGuest(roomId, oldHost.getId());
        redisSessionService.removeGuest(roomId, newHost.getId());

        session.setHost(newHost);
        watchSessionRepository.save(session);

        SessionSyncMessage hostChange = SessionSyncMessage.builder()
                .type("HOST_CHANGE")
                .roomId(roomId)
                .newHostEmail(newHost.getEmail())
                .newHostDisplayName(newHost.getDisplayName())
                .build();

        messagingTemplate.convertAndSend("/topic/session/" + roomId, hostChange);
        return true;
    }
}
