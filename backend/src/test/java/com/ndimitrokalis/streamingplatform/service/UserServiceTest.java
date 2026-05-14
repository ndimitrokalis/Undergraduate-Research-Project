package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.model.Media;
import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.model.WatchHistory;
import com.ndimitrokalis.streamingplatform.repository.MediaRepository;
import com.ndimitrokalis.streamingplatform.repository.UserRepository;
import com.ndimitrokalis.streamingplatform.repository.WatchHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private WatchHistoryRepository watchHistoryRepository;
    @Mock private MediaRepository mediaRepository;
    @Mock private RedisSessionService redisSessionService;

    @InjectMocks private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .displayName("TestUser")
                .fullName("Test User")
                .phone("+30 6944444444")
                .country("Greece")
                .build();
    }

    @Test
    void getProfile_shouldReturnUserProfile() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        Map<String, Object> profile = userService.getProfile("test@example.com");

        assertEquals(1L, profile.get("id"));
        assertEquals("test@example.com", profile.get("email"));
        assertEquals("TestUser", profile.get("displayName"));
        assertEquals("Test User", profile.get("fullName"));
        assertEquals("+30 6944444444", profile.get("phone"));
        assertEquals("Greece", profile.get("country"));
    }

    @Test
    void getProfile_shouldThrowWhenUserNotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.getProfile("unknown@example.com"));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void updateProfile_shouldUpdateDisplayName() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        userService.updateProfile("test@example.com", "NewName", null, null);

        assertEquals("NewName", testUser.getDisplayName());
        verify(userRepository).save(testUser);
    }

    @Test
    void updateProfile_shouldUpdatePhone() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.findByPhone("+30 6955555555")).thenReturn(Optional.empty());

        userService.updateProfile("test@example.com", null, "+30 6955555555", null);

        assertEquals("+30 6955555555", testUser.getPhone());
        verify(userRepository).save(testUser);
    }

    @Test
    void updateProfile_shouldThrowWhenPhoneTakenByOtherUser() {
        User otherUser = User.builder().id(2L).email("other@example.com").phone("+30 6955555555").build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.findByPhone("+30 6955555555")).thenReturn(Optional.of(otherUser));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.updateProfile("test@example.com", null, "+30 6955555555", null));
        assertEquals("Phone number already in use", ex.getMessage());
    }

    @Test
    void updateProfile_shouldAllowSamePhoneForSameUser() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.findByPhone("+30 6944444444")).thenReturn(Optional.of(testUser));

        assertDoesNotThrow(() ->
                userService.updateProfile("test@example.com", null, "+30 6944444444", null));
        verify(userRepository).save(testUser);
    }

    @Test
    void updateWatchProgressFast_shouldSaveToRedis() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        userService.updateWatchProgressFast("test@example.com", 5L, 120);

        verify(redisSessionService).setSoloProgress(1L, 5L, 120);
    }

    @Test
    void updateWatchProgress_shouldSaveToDbAndClearRedis() {
        Media media = Media.builder().id(5L).title("Test").genre("Action").type("MOVIE").videoUrl("/test.mp4").build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(mediaRepository.findById(5L)).thenReturn(Optional.of(media));
        when(watchHistoryRepository.findByUserIdAndMediaId(1L, 5L)).thenReturn(Optional.empty());

        userService.updateWatchProgress("test@example.com", 5L, 300, false);

        verify(watchHistoryRepository).save(any(WatchHistory.class));
        verify(redisSessionService).deleteSoloProgress(1L, 5L);
    }

    @Test
    void getSavedProgress_shouldPreferRedisOverDb() {
        when(redisSessionService.getSoloProgress(1L, 5L)).thenReturn(150);

        int progress = userService.getSavedProgress(1L, 5L);

        assertEquals(150, progress);
        verify(watchHistoryRepository, never()).findByUserIdAndMediaId(any(), any());
    }

    @Test
    void getSavedProgress_shouldFallbackToDbWhenRedisEmpty() {
        Media media = Media.builder().id(5L).title("Test").genre("Action").type("MOVIE").videoUrl("/test.mp4").build();
        WatchHistory history = WatchHistory.builder().user(testUser).media(media).progressSeconds(200).build();

        when(redisSessionService.getSoloProgress(1L, 5L)).thenReturn(null);
        when(watchHistoryRepository.findByUserIdAndMediaId(1L, 5L)).thenReturn(Optional.of(history));

        int progress = userService.getSavedProgress(1L, 5L);

        assertEquals(200, progress);
    }

    @Test
    void getSavedProgress_shouldReturnZeroWhenNoProgress() {
        when(redisSessionService.getSoloProgress(1L, 5L)).thenReturn(null);
        when(watchHistoryRepository.findByUserIdAndMediaId(1L, 5L)).thenReturn(Optional.empty());

        int progress = userService.getSavedProgress(1L, 5L);

        assertEquals(0, progress);
    }

    @Test
    void getWatchHistory_shouldReturnHistory() {
        Media media = Media.builder().id(5L).title("Test Movie").genre("Action").type("MOVIE").videoUrl("/test.mp4").build();
        WatchHistory history = WatchHistory.builder()
                .user(testUser).media(media).progressSeconds(120).completed(false)
                .lastWatchedAt(LocalDateTime.now()).build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(watchHistoryRepository.findByUserIdOrderByLastWatchedAtDesc(1L)).thenReturn(List.of(history));

        List<Map<String, Object>> result = userService.getWatchHistory("test@example.com");

        assertEquals(1, result.size());
        assertEquals(5L, result.get(0).get("mediaId"));
        assertEquals("Test Movie", result.get(0).get("mediaTitle"));
        assertEquals("MOVIE", result.get(0).get("mediaType"));
        assertEquals(120, result.get(0).get("progressSeconds"));
        assertFalse((Boolean) result.get(0).get("completed"));
    }
}
