package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.dto.ChangePasswordRequest;
import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.dto.UpdateProfileRequest;
import com.ndimitrokalis.streamingplatform.service.AuthService;
import com.ndimitrokalis.streamingplatform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateProfile(Authentication auth,
                                               @Valid @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(
                auth.getName(),
                request.getDisplayName(),
                request.getPhone(),
                request.getCountry()
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/history")
    public ResponseEntity<List<Map<String, Object>>> getWatchHistory(Authentication auth) {
        return ResponseEntity.ok(userService.getWatchHistory(auth.getName()));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication auth,
                                                               @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(auth.getName(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/me/favorites")
    public ResponseEntity<List<MediaResponse>> getFavorites(Authentication auth) {
        return ResponseEntity.ok(userService.getFavorites(auth.getName()));
    }

    @PostMapping("/me/favorites/{mediaId}")
    public ResponseEntity<Void> addFavorite(Authentication auth, @PathVariable Long mediaId) {
        userService.addFavorite(auth.getName(), mediaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me/favorites/{mediaId}")
    public ResponseEntity<Void> removeFavorite(Authentication auth, @PathVariable Long mediaId) {
        userService.removeFavorite(auth.getName(), mediaId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/favorites/{mediaId}")
    public ResponseEntity<Map<String, Boolean>> isFavorite(Authentication auth, @PathVariable Long mediaId) {
        return ResponseEntity.ok(Map.of("favorite", userService.isFavorite(auth.getName(), mediaId)));
    }
}
