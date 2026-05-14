package com.ndimitrokalis.streamingplatform.websocket;

import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.repository.UserRepository;
import com.ndimitrokalis.streamingplatform.service.RedisSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class WatchTogetherHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisSessionService redisSessionService;
    private final WebSocketEventListener webSocketEventListener;
    private final HostTransferService hostTransferService;
    private final UserRepository userRepository;

    @MessageMapping("/session/{roomId}/play")
    public void handlePlay(@DestinationVariable String roomId, @Payload SessionSyncMessage message) {
        String host = redisSessionService.getHost(roomId);
        if (!message.getUserId().equals(host)) return;

        redisSessionService.setPlaying(roomId, true);
        if (message.getTimestamp() != null) {
            redisSessionService.setTimestamp(roomId, message.getTimestamp());
        }

        broadcast(roomId, "PLAY", message.getTimestamp());
    }

    @MessageMapping("/session/{roomId}/pause")
    public void handlePause(@DestinationVariable String roomId, @Payload SessionSyncMessage message) {
        String host = redisSessionService.getHost(roomId);
        if (!message.getUserId().equals(host)) return;

        redisSessionService.setPlaying(roomId, false);
        if (message.getTimestamp() != null) {
            redisSessionService.setTimestamp(roomId, message.getTimestamp());
        }

        broadcast(roomId, "PAUSE", message.getTimestamp());
    }

    @MessageMapping("/session/{roomId}/seek")
    public void handleSeek(@DestinationVariable String roomId, @Payload SessionSyncMessage message) {
        String host = redisSessionService.getHost(roomId);
        if (!message.getUserId().equals(host)) return;

        redisSessionService.setTimestamp(roomId, message.getTimestamp());

        broadcast(roomId, "SEEK", message.getTimestamp());
    }

    @MessageMapping("/session/{roomId}/sync")
    public void handleSyncRequest(@DestinationVariable String roomId,
                                   @Payload SessionSyncMessage message,
                                   @Header("simpSessionId") String wsSessionId) {
        String displayName = userRepository.findByEmail(message.getUserId())
                .map(User::getDisplayName)
                .orElse(message.getUserId());
        webSocketEventListener.registerUser(wsSessionId, message.getUserId(), displayName, roomId);

        String host = redisSessionService.getHost(roomId);

        if (message.getUserId().equals(host)) {
            redisSessionService.clearReconnectDeadline(roomId);
        } else if (host != null && !webSocketEventListener.isUserConnected(host, roomId)) {
            redisSessionService.clearReconnectDeadline(roomId);
            hostTransferService.promoteUser(roomId, message.getUserId());
        }

        List<Map<String, String>> participantList = webSocketEventListener.buildParticipantList(roomId);

        SessionSyncMessage joinMsg = SessionSyncMessage.builder()
                .type("JOIN")
                .roomId(roomId)
                .userId(message.getUserId())
                .displayName(displayName)
                .participants(participantList)
                .build();
        messagingTemplate.convertAndSend("/topic/session/" + roomId, joinMsg);

        Map<String, String> state = redisSessionService.getSessionState(roomId);

        SessionSyncMessage syncResponse = SessionSyncMessage.builder()
                .type("SYNC")
                .roomId(roomId)
                .timestamp(state.get("timestamp"))
                .playing("true".equals(state.get("is_playing")))
                .newHostEmail(state.get("host"))
                .participants(participantList)
                .build();

        messagingTemplate.convertAndSend("/topic/session/" + roomId, syncResponse);
    }

    private void broadcast(String roomId, String type, String timestamp) {
        SessionSyncMessage outgoing = SessionSyncMessage.builder()
                .type(type)
                .roomId(roomId)
                .timestamp(timestamp)
                .playing("PLAY".equals(type))
                .build();

        messagingTemplate.convertAndSend("/topic/session/" + roomId, outgoing);
    }
}
