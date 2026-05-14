package com.ndimitrokalis.streamingplatform.websocket;

import com.ndimitrokalis.streamingplatform.service.RedisSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final RedisSessionService redisSessionService;
    private final SimpMessagingTemplate messagingTemplate;
    private final HostTransferService hostTransferService;

    static final ConcurrentHashMap<String, SessionInfo> sessionMap = new ConcurrentHashMap<>();

    public record SessionInfo(String userEmail, String displayName, String roomId) {}

    public void registerUser(String wsSessionId, String userEmail, String displayName, String roomId) {
        sessionMap.put(wsSessionId, new SessionInfo(userEmail, displayName, roomId));
        redisSessionService.addParticipant(roomId, userEmail, displayName);
    }

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        if (destination == null || !destination.startsWith("/topic/session/")) return;

        String roomId = destination.replace("/topic/session/", "");
        String wsSessionId = accessor.getSessionId();

        String host = redisSessionService.getHost(roomId);
        if (host == null) return;

        String deadline = redisSessionService.getReconnectDeadline(roomId);
        if (deadline != null) {
            SessionInfo info = sessionMap.get(wsSessionId);
            if (info != null && info.userEmail().equals(host)) {
                redisSessionService.clearReconnectDeadline(roomId);
            }
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String wsSessionId = accessor.getSessionId();

        SessionInfo info = sessionMap.remove(wsSessionId);
        if (info == null) return;

        String host = redisSessionService.getHost(info.roomId());
        if (host == null) return;

        redisSessionService.removeParticipant(info.roomId(), info.userEmail());

        if (redisSessionService.isPlaying(info.roomId())) {
            redisSessionService.setPlaying(info.roomId(), false);
            String timestamp = redisSessionService.getTimestamp(info.roomId());

            SessionSyncMessage pause = SessionSyncMessage.builder()
                    .type("PAUSE")
                    .roomId(info.roomId())
                    .timestamp(timestamp)
                    .playing(false)
                    .build();
            messagingTemplate.convertAndSend("/topic/session/" + info.roomId(), pause);
        }

        List<Map<String, String>> participantList = buildParticipantList(info.roomId());

        SessionSyncMessage leave = SessionSyncMessage.builder()
                .type("LEAVE")
                .roomId(info.roomId())
                .userId(info.userEmail())
                .displayName(info.displayName())
                .participants(participantList)
                .build();
        messagingTemplate.convertAndSend("/topic/session/" + info.roomId(), leave);

        if (info.userEmail().equals(host)) {
            long deadline = Instant.now().plusSeconds(5).getEpochSecond();
            redisSessionService.setReconnectDeadline(info.roomId(), String.valueOf(deadline));
        }
    }

    public boolean isUserConnected(String userEmail, String roomId) {
        return sessionMap.values().stream()
                .anyMatch(i -> i.userEmail().equals(userEmail) && i.roomId().equals(roomId));
    }

    public String getFirstConnectedUser(String roomId) {
        return sessionMap.values().stream()
                .filter(i -> i.roomId().equals(roomId))
                .map(SessionInfo::userEmail)
                .findFirst()
                .orElse(null);
    }

    public List<Map<String, String>> buildParticipantList(String roomId) {
        Map<Object, Object> raw = redisSessionService.getParticipants(roomId);
        return raw.entrySet().stream()
                .map(e -> Map.of("email", e.getKey().toString(), "displayName", e.getValue().toString()))
                .toList();
    }
}
