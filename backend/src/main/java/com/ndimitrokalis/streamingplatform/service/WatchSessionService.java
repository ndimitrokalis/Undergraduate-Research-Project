package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.dto.WatchSessionResponse;
import com.ndimitrokalis.streamingplatform.model.*;
import com.ndimitrokalis.streamingplatform.repository.*;
import com.ndimitrokalis.streamingplatform.websocket.SessionSyncMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WatchSessionService {

    private final WatchSessionRepository watchSessionRepository;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final RoomGuestRepository roomGuestRepository;
    private final RedisSessionService redisSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public WatchSessionResponse createSession(String hostEmail, Long mediaId) {
        User host = userRepository.findByEmail(hostEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        String roomId = UUID.randomUUID().toString().substring(0, 8);

        WatchSession session = WatchSession.builder()
                .roomId(roomId)
                .host(host)
                .media(media)
                .build();

        watchSessionRepository.save(session);

        redisSessionService.initSession(roomId, host.getEmail());

        return toResponse(session);
    }

    @Transactional
    public WatchSessionResponse joinSession(String roomId, String guestEmail) {
        WatchSession session = watchSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.isActive()) {
            throw new RuntimeException("Session is no longer active");
        }

        User guest = userRepository.findByEmail(guestEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!roomGuestRepository.existsBySessionIdAndUserId(session.getId(), guest.getId())) {
            RoomGuest roomGuest = RoomGuest.builder()
                    .session(session)
                    .user(guest)
                    .build();
            roomGuestRepository.save(roomGuest);
        }

        redisSessionService.addGuest(roomId, guest.getId());

        return toResponse(session);
    }

    @Transactional
    public void endSession(String roomId, String hostEmail) {
        WatchSession session = watchSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        User host = userRepository.findByEmail(hostEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!session.getHost().getId().equals(host.getId())) {
            throw new RuntimeException("Only the host can end the session");
        }

        String redisTimestamp = redisSessionService.getTimestamp(roomId);
        if (redisTimestamp != null) {
            try {
                session.setPlaybackTimestamp((int) Double.parseDouble(redisTimestamp));
            } catch (NumberFormatException ignored) {
            }
        }

        session.setActive(false);
        session.setEndedAt(LocalDateTime.now());
        watchSessionRepository.save(session);

        messagingTemplate.convertAndSend("/topic/session/" + roomId,
                SessionSyncMessage.builder()
                        .type("SESSION_ENDED")
                        .roomId(roomId)
                        .build());

        redisSessionService.deleteSession(roomId);
    }

    public WatchSessionResponse getSession(String roomId) {
        WatchSession session = watchSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        WatchSessionResponse response = toResponse(session);

        if (session.isActive()) {
            String redisTimestamp = redisSessionService.getTimestamp(roomId);
            if (redisTimestamp != null) {
                try {
                    response.setPlaybackTimestamp((int) Double.parseDouble(redisTimestamp));
                } catch (NumberFormatException ignored) {
                }
            }
        }

        return response;
    }

    public List<WatchSessionResponse> getActiveSessions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WatchSession> hosted = watchSessionRepository.findByHostIdAndActiveTrue(user.getId());

        List<WatchSession> joined = roomGuestRepository.findByUserIdAndSessionActiveTrue(user.getId())
                .stream()
                .map(guest -> guest.getSession())
                .toList();

        java.util.LinkedHashSet<WatchSession> combined = new java.util.LinkedHashSet<>(hosted);
        combined.addAll(joined);

        return combined.stream().map(this::toResponse).toList();
    }

    private WatchSessionResponse toResponse(WatchSession session) {
        List<Map<String, String>> members = new java.util.ArrayList<>();

        members.add(Map.of(
                "email", session.getHost().getEmail(),
                "displayName", session.getHost().getDisplayName()
        ));

        String hostEmail = session.getHost().getEmail();
        roomGuestRepository.findBySessionId(session.getId()).forEach(guest -> {
            if (!guest.getUser().getEmail().equals(hostEmail)) {
                members.add(Map.of(
                        "email", guest.getUser().getEmail(),
                        "displayName", guest.getUser().getDisplayName()
                ));
            }
        });

        return WatchSessionResponse.builder()
                .id(session.getId())
                .roomId(session.getRoomId())
                .hostEmail(session.getHost().getEmail())
                .hostDisplayName(session.getHost().getDisplayName())
                .mediaId(session.getMedia().getId())
                .mediaTitle(session.getMedia().getTitle())
                .playbackTimestamp(session.getPlaybackTimestamp())
                .active(session.isActive())
                .createdAt(session.getCreatedAt())
                .members(members)
                .build();
    }
}
