package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.dto.WatchSessionResponse;
import com.ndimitrokalis.streamingplatform.service.WatchSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class WatchSessionController {

    private final WatchSessionService watchSessionService;

    @PostMapping
    public ResponseEntity<WatchSessionResponse> createSession(@RequestBody Map<String, Long> body,
                                                               Authentication auth) {
        Long mediaId = body.get("mediaId");
        return ResponseEntity.ok(watchSessionService.createSession(auth.getName(), mediaId));
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<WatchSessionResponse> joinSession(@PathVariable String roomId,
                                                             Authentication auth) {
        return ResponseEntity.ok(watchSessionService.joinSession(roomId, auth.getName()));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> endSession(@PathVariable String roomId,
                                            Authentication auth) {
        watchSessionService.endSession(roomId, auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<WatchSessionResponse> getSession(@PathVariable String roomId) {
        return ResponseEntity.ok(watchSessionService.getSession(roomId));
    }

    @GetMapping
    public ResponseEntity<List<WatchSessionResponse>> getActiveSessions(Authentication auth) {
        return ResponseEntity.ok(watchSessionService.getActiveSessions(auth.getName()));
    }
}
