package com.ndimitrokalis.streamingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RedisSessionService {

    private final StringRedisTemplate redisTemplate;

    private static final Duration SESSION_TTL = Duration.ofHours(6);

    private String key(String roomId, String field) {
        return "session:" + roomId + ":" + field;
    }

    public void initSession(String roomId, String hostEmail) {
        redisTemplate.opsForValue().set(key(roomId, "host"), hostEmail, SESSION_TTL);
        redisTemplate.opsForValue().set(key(roomId, "is_playing"), "false", SESSION_TTL);
        redisTemplate.opsForValue().set(key(roomId, "timestamp"), "0", SESSION_TTL);
    }

    public void addGuest(String roomId, Long userId) {
        redisTemplate.opsForSet().add(key(roomId, "guests"), userId.toString());
        redisTemplate.expire(key(roomId, "guests"), SESSION_TTL);
    }

    public void removeGuest(String roomId, Long userId) {
        redisTemplate.opsForSet().remove(key(roomId, "guests"), userId.toString());
    }

    public Set<String> getGuests(String roomId) {
        return redisTemplate.opsForSet().members(key(roomId, "guests"));
    }

    public void setPlaying(String roomId, boolean playing) {
        redisTemplate.opsForValue().set(key(roomId, "is_playing"), String.valueOf(playing), SESSION_TTL);
    }

    public boolean isPlaying(String roomId) {
        String value = redisTemplate.opsForValue().get(key(roomId, "is_playing"));
        return "true".equals(value);
    }

    public void setTimestamp(String roomId, String timestamp) {
        redisTemplate.opsForValue().set(key(roomId, "timestamp"), timestamp, SESSION_TTL);
    }

    public String getTimestamp(String roomId) {
        return redisTemplate.opsForValue().get(key(roomId, "timestamp"));
    }

    public void setHost(String roomId, String hostEmail) {
        redisTemplate.opsForValue().set(key(roomId, "host"), hostEmail, SESSION_TTL);
    }

    public String getHost(String roomId) {
        return redisTemplate.opsForValue().get(key(roomId, "host"));
    }

    public void setReconnectDeadline(String roomId, String deadline) {
        redisTemplate.opsForValue().set(key(roomId, "reconnect_deadline"), deadline, SESSION_TTL);
    }

    public String getReconnectDeadline(String roomId) {
        return redisTemplate.opsForValue().get(key(roomId, "reconnect_deadline"));
    }

    public void clearReconnectDeadline(String roomId) {
        redisTemplate.delete(key(roomId, "reconnect_deadline"));
    }

    public Map<String, String> getSessionState(String roomId) {
        return Map.of(
                "host", getHost(roomId) != null ? getHost(roomId) : "",
                "is_playing", String.valueOf(isPlaying(roomId)),
                "timestamp", getTimestamp(roomId) != null ? getTimestamp(roomId) : "0"
        );
    }

    // Connected participants (email -> displayName)
    public void addParticipant(String roomId, String email, String displayName) {
        redisTemplate.opsForHash().put(key(roomId, "participants"), email, displayName);
        redisTemplate.expire(key(roomId, "participants"), SESSION_TTL);
    }

    public void removeParticipant(String roomId, String email) {
        redisTemplate.opsForHash().delete(key(roomId, "participants"), email);
    }

    public Map<Object, Object> getParticipants(String roomId) {
        Map<Object, Object> result = redisTemplate.opsForHash().entries(key(roomId, "participants"));
        return result != null ? result : Collections.emptyMap();
    }

    // Solo watch progress
    private static final Duration SOLO_TTL = Duration.ofDays(7);

    private String soloKey(Long userId, Long mediaId) {
        return "watch:progress:" + userId + ":" + mediaId;
    }

    public void setSoloProgress(Long userId, Long mediaId, int progressSeconds) {
        redisTemplate.opsForValue().set(soloKey(userId, mediaId), String.valueOf(progressSeconds), SOLO_TTL);
    }

    public Integer getSoloProgress(Long userId, Long mediaId) {
        String value = redisTemplate.opsForValue().get(soloKey(userId, mediaId));
        if (value == null) return null;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public void deleteSoloProgress(Long userId, Long mediaId) {
        redisTemplate.delete(soloKey(userId, mediaId));
    }

    public void deleteSession(String roomId) {
        redisTemplate.delete(key(roomId, "host"));
        redisTemplate.delete(key(roomId, "is_playing"));
        redisTemplate.delete(key(roomId, "timestamp"));
        redisTemplate.delete(key(roomId, "guests"));
        redisTemplate.delete(key(roomId, "participants"));
        redisTemplate.delete(key(roomId, "reconnect_deadline"));
    }
}
