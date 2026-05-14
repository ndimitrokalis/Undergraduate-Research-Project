package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.model.Favorite;
import com.ndimitrokalis.streamingplatform.model.Media;
import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.model.WatchHistory;
import com.ndimitrokalis.streamingplatform.repository.FavoriteRepository;
import com.ndimitrokalis.streamingplatform.repository.MediaRepository;
import com.ndimitrokalis.streamingplatform.repository.UserRepository;
import com.ndimitrokalis.streamingplatform.repository.WatchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final MediaRepository mediaRepository;
    private final RedisSessionService redisSessionService;

    public Map<String, Object> getProfile(String email) {
        User user = findByEmail(email);
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("displayName", user.getDisplayName());
        profile.put("fullName", user.getFullName() != null ? user.getFullName() : "");
        profile.put("phone", user.getPhone() != null ? user.getPhone() : "");
        profile.put("country", user.getCountry() != null ? user.getCountry() : "");
        profile.put("subscriptionType", user.getSubscriptionType().name());
        profile.put("admin", user.isAdmin());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("updatedAt", user.getUpdatedAt());
        return profile;
    }

    @Transactional
    public void updateProfile(String email, String displayName, String phone, String country) {
        User user = findByEmail(email);
        if (displayName != null) user.setDisplayName(displayName);
        if (phone != null && !phone.isBlank()) {
            userRepository.findByPhone(phone).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new RuntimeException("Phone number already in use");
                }
            });
            user.setPhone(phone);
        }
        if (country != null) user.setCountry(country);
        userRepository.save(user);
    }

    public List<Map<String, Object>> getWatchHistory(String email) {
        User user = findByEmail(email);
        return watchHistoryRepository.findByUserIdOrderByLastWatchedAtDesc(user.getId()).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    public void updateWatchProgressFast(String email, Long mediaId, Integer progressSeconds) {
        User user = findByEmail(email);
        redisSessionService.setSoloProgress(user.getId(), mediaId, progressSeconds);
    }

    @Transactional
    public void updateWatchProgress(String email, Long mediaId, Integer progressSeconds, boolean completed) {
        User user = findByEmail(email);
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        WatchHistory history = watchHistoryRepository.findByUserIdAndMediaId(user.getId(), mediaId)
                .orElseGet(() -> WatchHistory.builder()
                        .user(user)
                        .media(media)
                        .progressSeconds(0)
                        .build());

        history.setProgressSeconds(progressSeconds);
        history.setCompleted(completed);
        watchHistoryRepository.save(history);

        redisSessionService.deleteSoloProgress(user.getId(), mediaId);
    }

    public int getSavedProgress(Long userId, Long mediaId) {
        Integer redisProgress = redisSessionService.getSoloProgress(userId, mediaId);
        if (redisProgress != null) return redisProgress;

        return watchHistoryRepository.findByUserIdAndMediaId(userId, mediaId)
                .map(WatchHistory::getProgressSeconds)
                .orElse(0);
    }

    public List<MediaResponse> getFavorites(String email) {
        User user = findByEmail(email);
        return favoriteRepository.findByUserIdOrderByAddedAtDesc(user.getId()).stream()
                .map(fav -> toMediaResponse(fav.getMedia()))
                .toList();
    }

    @Transactional
    public void addFavorite(String email, Long mediaId) {
        User user = findByEmail(email);
        if (favoriteRepository.findByUserIdAndMediaId(user.getId(), mediaId).isPresent()) {
            return;
        }
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        favoriteRepository.save(Favorite.builder().user(user).media(media).build());
    }

    @Transactional
    public void removeFavorite(String email, Long mediaId) {
        User user = findByEmail(email);
        favoriteRepository.deleteByUserIdAndMediaId(user.getId(), mediaId);
    }

    public boolean isFavorite(String email, Long mediaId) {
        User user = findByEmail(email);
        return favoriteRepository.findByUserIdAndMediaId(user.getId(), mediaId).isPresent();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private MediaResponse toMediaResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .title(media.getTitle())
                .description(media.getDescription())
                .genre(media.getGenre())
                .type(media.getType())
                .thumbnailUrl(media.getThumbnailUrl())
                .videoUrl(media.getVideoUrl())
                .durationSeconds(media.getDurationSeconds())
                .releaseYear(media.getReleaseYear())
                .build();
    }

    private Map<String, Object> toHistoryResponse(WatchHistory history) {
        return Map.of(
                "mediaId", history.getMedia().getId(),
                "mediaTitle", history.getMedia().getTitle(),
                "mediaType", history.getMedia().getType(),
                "progressSeconds", history.getProgressSeconds(),
                "completed", history.isCompleted(),
                "lastWatchedAt", history.getLastWatchedAt()
        );
    }
}
