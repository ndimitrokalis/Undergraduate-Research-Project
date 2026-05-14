package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.config.SecurityConfig;
import com.ndimitrokalis.streamingplatform.security.JwtFilter;
import com.ndimitrokalis.streamingplatform.security.JwtUtil;
import com.ndimitrokalis.streamingplatform.service.AuthService;
import com.ndimitrokalis.streamingplatform.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, JwtFilter.class, UserControllerTest.TestCorsConfig.class})
class UserControllerTest {

    @TestConfiguration
    static class TestCorsConfig {
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("*"));
            config.setAllowedMethods(List.of("*"));
            source.registerCorsConfiguration("/**", config);
            return source;
        }
    }

    @Autowired private MockMvc mockMvc;
    @MockitoBean private UserService userService;
    @MockitoBean private AuthService authService;
    @MockitoBean private JwtUtil jwtUtil;

    @Test
    @WithMockUser(username = "test@example.com")
    void getProfile_shouldReturnUserProfile() throws Exception {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", 1L);
        profile.put("email", "test@example.com");
        profile.put("displayName", "TestUser");
        profile.put("fullName", "Test User");
        profile.put("phone", "+30 6944444444");
        profile.put("country", "Greece");

        when(userService.getProfile("test@example.com")).thenReturn(profile);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.displayName").value("TestUser"))
                .andExpect(jsonPath("$.country").value("Greece"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateProfile_shouldReturn200() throws Exception {
        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"displayName":"NewName","phone":"+30 6955555555","country":"UK"}
                                """))
                .andExpect(status().isOk());

        verify(userService).updateProfile("test@example.com", "NewName", "+30 6955555555", "UK");
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateProfile_shouldReturn400WhenPhoneTaken() throws Exception {
        doThrow(new RuntimeException("Phone number already in use"))
                .when(userService).updateProfile(any(), any(), any(), any());

        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"phone":"+30 6944444444"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Phone number already in use"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getWatchHistory_shouldReturnHistory() throws Exception {
        Map<String, Object> entry = new HashMap<>();
        entry.put("mediaId", 5L);
        entry.put("mediaTitle", "Test Movie");
        entry.put("mediaType", "MOVIE");
        entry.put("progressSeconds", 120);
        entry.put("completed", false);
        entry.put("lastWatchedAt", LocalDateTime.now().toString());

        when(userService.getWatchHistory("test@example.com")).thenReturn(List.of(entry));

        mockMvc.perform(get("/api/users/me/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].mediaTitle").value("Test Movie"))
                .andExpect(jsonPath("$[0].mediaType").value("MOVIE"))
                .andExpect(jsonPath("$[0].progressSeconds").value(120));
    }

    @Test
    void getProfile_shouldReturn403WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isForbidden());
    }
}
