package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.service.MediaService;
import com.ndimitrokalis.streamingplatform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
public class StreamController {

    private final MediaService mediaService;
    private final UserService userService;

    @GetMapping("/{mediaId}")
    public ResponseEntity<Map<String, Object>> getStreamInfo(@PathVariable Long mediaId,
                                                              Authentication auth) {
        var media = mediaService.getMediaById(mediaId);
        var user = userService.findByEmail(auth.getName());
        int savedProgress = userService.getSavedProgress(user.getId(), mediaId);
        return ResponseEntity.ok(Map.of(
                "videoUrl", media.getVideoUrl(),
                "title", media.getTitle(),
                "durationSeconds", media.getDurationSeconds() != null ? media.getDurationSeconds() : 0,
                "savedProgressSeconds", savedProgress
        ));
    }

    @PostMapping("/{mediaId}/progress")
    public ResponseEntity<Void> saveProgress(@PathVariable Long mediaId,
                                              @RequestBody Map<String, Object> body,
                                              Authentication auth) {
        Integer progressSeconds = (Integer) body.get("progressSeconds");
        if (progressSeconds == null || progressSeconds < 0) {
            throw new RuntimeException("Invalid progress value");
        }
        Boolean completed = (Boolean) body.getOrDefault("completed", false);
        userService.updateWatchProgress(auth.getName(), mediaId, progressSeconds, completed);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{mediaId}/progress/tick")
    public ResponseEntity<Void> saveProgressTick(@PathVariable Long mediaId,
                                                  @RequestBody Map<String, Object> body,
                                                  Authentication auth) {
        Integer progressSeconds = (Integer) body.get("progressSeconds");
        if (progressSeconds == null || progressSeconds < 0) {
            throw new RuntimeException("Invalid progress value");
        }
        userService.updateWatchProgressFast(auth.getName(), mediaId, progressSeconds);
        return ResponseEntity.ok().build();
    }
}
