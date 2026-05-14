package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.dto.LoginRequest;
import com.ndimitrokalis.streamingplatform.dto.RegisterRequest;
import com.ndimitrokalis.streamingplatform.model.EmailVerificationToken;
import com.ndimitrokalis.streamingplatform.model.PasswordResetToken;
import com.ndimitrokalis.streamingplatform.model.User;
import com.ndimitrokalis.streamingplatform.repository.EmailVerificationTokenRepository;
import com.ndimitrokalis.streamingplatform.repository.PasswordResetTokenRepository;
import com.ndimitrokalis.streamingplatform.repository.UserRepository;
import com.ndimitrokalis.streamingplatform.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailVerificationTokenRepository tokenRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private EmailService emailService;

    @InjectMocks private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encoded")
                .displayName("Test")
                .fullName("Test User")
                .phone("+30 6944444444")
                .country("Greece")
                .enabled(true)
                .build();
    }

    @Test
    void register_shouldSucceedWithValidData() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setDisplayName("New User");
        request.setFullName("New User");
        request.setPhone("+30 6955555555");
        request.setCountry("Greece");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.existsByPhone("+30 6955555555")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(tokenRepository.save(any())).thenReturn(null);

        String result = authService.register(request);

        assertTrue(result.contains("Registration successful"));
        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void register_shouldThrowWhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Email already in use", ex.getMessage());
    }

    @Test
    void register_shouldThrowWhenPhoneExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setPhone("+30 6944444444");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.existsByPhone("+30 6944444444")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Phone number already in use", ex.getMessage());
    }

    @Test
    void login_shouldReturnTokenForValidEmailLogin() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("test@example.com", false)).thenReturn("jwt-token");

        String token = authService.login(request);

        assertEquals("jwt-token", token);
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void login_shouldReturnTokenForValidPhoneLogin() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("+30 6944444444");
        request.setPassword("password123");

        when(userRepository.findByEmail("+30 6944444444")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("+30 6944444444")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("test@example.com", false)).thenReturn("jwt-token");

        String token = authService.login(request);

        assertEquals("jwt-token", token);
    }

    @Test
    void login_shouldReturnTokenForPhoneSuffixMatch() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("6944444444");
        request.setPassword("password123");

        when(userRepository.findByEmail("6944444444")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("6944444444")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneEndingWith(" 6944444444")).thenReturn(List.of(testUser));
        when(jwtUtil.generateToken("test@example.com", false)).thenReturn("jwt-token");

        String token = authService.login(request);

        assertEquals("jwt-token", token);
    }

    @Test
    void login_shouldThrowWhenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("nobody@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("nobody@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneEndingWith(" nobody@example.com")).thenReturn(List.of());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void login_shouldThrowWhenEmailNotVerified() {
        testUser.setEnabled(false);
        LoginRequest request = new LoginRequest();
        request.setIdentifier("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Please verify your email before logging in", ex.getMessage());
    }

    @Test
    void verifyEmail_shouldEnableUser() {
        EmailVerificationToken token = EmailVerificationToken.builder()
                .token("verify-token")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        testUser.setEnabled(false);
        when(tokenRepository.findByToken("verify-token")).thenReturn(Optional.of(token));

        String result = authService.verifyEmail("verify-token");

        assertTrue(testUser.isEnabled());
        assertTrue(token.getUsed());
        assertTrue(result.contains("verified"));
    }

    @Test
    void verifyEmail_shouldThrowForExpiredToken() {
        EmailVerificationToken token = EmailVerificationToken.builder()
                .token("expired-token")
                .user(testUser)
                .expiresAt(LocalDateTime.now().minusHours(1))
                .used(false)
                .build();

        when(tokenRepository.findByToken("expired-token")).thenReturn(Optional.of(token));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.verifyEmail("expired-token"));
        assertEquals("Verification token has expired", ex.getMessage());
    }

    @Test
    void forgotPassword_shouldSendResetEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.save(any())).thenReturn(null);

        String result = authService.forgotPassword("test@example.com");

        assertTrue(result.contains("reset link sent"));
        verify(emailService).sendPasswordResetEmail(eq("test@example.com"), eq("Test"), anyString());
    }

    @Test
    void forgotPassword_shouldThrowForUnknownEmail() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.forgotPassword("unknown@example.com"));
        assertEquals("No account found with that email", ex.getMessage());
    }

    @Test
    void resetPassword_shouldUpdatePassword() {
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("reset-token")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        when(passwordResetTokenRepository.findByToken("reset-token")).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode("newpassword")).thenReturn("new-encoded");

        String result = authService.resetPassword("reset-token", "newpassword");

        assertEquals("new-encoded", testUser.getPassword());
        assertTrue(resetToken.getUsed());
        assertTrue(result.contains("reset successfully"));
    }

    @Test
    void resetPassword_shouldThrowForUsedToken() {
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("used-token")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(true)
                .build();

        when(passwordResetTokenRepository.findByToken("used-token")).thenReturn(Optional.of(resetToken));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.resetPassword("used-token", "newpassword"));
        assertEquals("Reset token has already been used", ex.getMessage());
    }
}
