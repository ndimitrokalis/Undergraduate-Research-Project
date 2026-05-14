package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.config.SecurityConfig;
import com.ndimitrokalis.streamingplatform.security.JwtFilter;
import com.ndimitrokalis.streamingplatform.security.JwtUtil;
import com.ndimitrokalis.streamingplatform.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtFilter.class, AuthControllerTest.TestCorsConfig.class})
class AuthControllerTest {

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
    @MockitoBean private AuthService authService;
    @MockitoBean private JwtUtil jwtUtil;

    @Test
    void login_shouldReturnToken() throws Exception {
        when(authService.login(any())).thenReturn("jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"identifier":"test@example.com","password":"Testing1!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void login_shouldReturn400WhenUserNotFound() throws Exception {
        when(authService.login(any())).thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"identifier":"nobody@example.com","password":"wrong"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("User not found"));
    }

    @Test
    void register_shouldReturnSuccessMessage() throws Exception {
        when(authService.register(any())).thenReturn("Registration successful. Please check your email.");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"new@example.com","password":"Testing1!","displayName":"New","fullName":"New User","phone":"+30 6955555555","country":"Greece"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration successful. Please check your email."));
    }

    @Test
    void register_shouldReturn400WhenEmailExists() throws Exception {
        when(authService.register(any())).thenThrow(new RuntimeException("Email already in use"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"existing@example.com","password":"Testing1!","displayName":"Test","fullName":"Test User","phone":"+30 6955555555","country":"Greece"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email already in use"));
    }

    @Test
    void forgotPassword_shouldReturnSuccessMessage() throws Exception {
        when(authService.forgotPassword("test@example.com")).thenReturn("Password reset link sent to your email.");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"test@example.com"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset link sent to your email."));
    }

    @Test
    void resetPassword_shouldReturnSuccessMessage() throws Exception {
        when(authService.resetPassword("reset-token", "NewPass1!")).thenReturn("Password reset successfully. You can now log in.");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"reset-token","password":"NewPass1!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset successfully. You can now log in."));
    }

    @Test
    void resendVerification_shouldReturnSuccessMessage() throws Exception {
        when(authService.resendVerification("test@example.com")).thenReturn("Verification email sent.");

        mockMvc.perform(post("/api/auth/resend-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"test@example.com"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Verification email sent."));
    }
}
