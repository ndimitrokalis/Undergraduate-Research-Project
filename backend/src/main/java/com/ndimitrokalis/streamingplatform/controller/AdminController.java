package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.model.Media;
import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.model.WatchSession;
import com.ndimitrokalis.streamingplatform.repository.*;
import com.ndimitrokalis.streamingplatform.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final MediaRepository mediaRepository;
    private final MediaService mediaService;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final FavoriteRepository favoriteRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final RoomGuestRepository roomGuestRepository;
    private final WatchSessionRepository watchSessionRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(this::toUserSummary)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(toUserSummary(user));
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isAdmin()) {
            throw new RuntimeException("Cannot delete an admin user");
        }
        log.info("Admin {} deleted user: {} (id={})", auth.getName(), user.getEmail(), id);

        emailVerificationTokenRepository.deleteByUserId(id);
        passwordResetTokenRepository.deleteByUserId(id);
        favoriteRepository.deleteByUserId(id);
        watchHistoryRepository.deleteByUserId(id);
        roomGuestRepository.deleteByUserId(id);
        for (WatchSession session : watchSessionRepository.findByHostId(id)) {
            roomGuestRepository.deleteBySessionId(session.getId());
        }
        watchSessionRepository.deleteAll(watchSessionRepository.findByHostId(id));
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, String>> updateRole(@PathVariable Long id,
                                                           @RequestBody Map<String, Boolean> body,
                                                           Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Boolean admin = body.get("admin");
        if (admin != null) {
            user.setAdmin(admin);
            userRepository.save(user);
            log.info("Admin {} updated role for user {} (id={}): admin={}", auth.getName(), user.getEmail(), id, admin);
        }
        return ResponseEntity.ok(Map.of("message", "Role updated"));
    }

    @GetMapping("/media")
    public ResponseEntity<List<MediaResponse>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    @PostMapping("/media")
    public ResponseEntity<MediaResponse> createMedia(@RequestBody Map<String, Object> body) {
        Media media = Media.builder()
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .genre((String) body.get("genre"))
                .type((String) body.get("type"))
                .thumbnailUrl((String) body.get("thumbnailUrl"))
                .videoUrl((String) body.get("videoUrl"))
                .durationSeconds(body.get("durationSeconds") != null ? ((Number) body.get("durationSeconds")).intValue() : null)
                .releaseYear(body.get("releaseYear") != null ? ((Number) body.get("releaseYear")).intValue() : null)
                .build();
        mediaRepository.save(media);
        return ResponseEntity.ok(mediaService.getMediaById(media.getId()));
    }

    @PutMapping("/media/{id}")
    public ResponseEntity<MediaResponse> updateMedia(@PathVariable Long id,
                                                      @RequestBody Map<String, Object> body) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        if (body.containsKey("title")) media.setTitle((String) body.get("title"));
        if (body.containsKey("description")) media.setDescription((String) body.get("description"));
        if (body.containsKey("genre")) media.setGenre((String) body.get("genre"));
        if (body.containsKey("type")) media.setType((String) body.get("type"));
        if (body.containsKey("thumbnailUrl")) media.setThumbnailUrl((String) body.get("thumbnailUrl"));
        if (body.containsKey("videoUrl")) media.setVideoUrl((String) body.get("videoUrl"));
        if (body.containsKey("durationSeconds")) media.setDurationSeconds(((Number) body.get("durationSeconds")).intValue());
        if (body.containsKey("releaseYear")) media.setReleaseYear(((Number) body.get("releaseYear")).intValue());

        mediaRepository.save(media);
        return ResponseEntity.ok(mediaService.getMediaById(media.getId()));
    }

    @DeleteMapping("/media/{id}")
    public ResponseEntity<Map<String, String>> deleteMedia(@PathVariable Long id, Authentication auth) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        log.info("Admin {} deleted media: {} (id={})", auth.getName(), media.getTitle(), id);
        mediaRepository.delete(media);
        return ResponseEntity.ok(Map.of("message", "Media deleted"));
    }

    private Map<String, Object> toUserSummary(User user) {
        return Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "displayName", user.getDisplayName(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "admin", user.isAdmin(),
                "enabled", user.isEnabled(),
                "subscriptionType", user.getSubscriptionType().name(),
                "createdAt", user.getCreatedAt()
        );
    }
}
