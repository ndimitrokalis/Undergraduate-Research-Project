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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationTokenRepository tokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()
                && userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .country(request.getCountry())
                .enabled(false)
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", request.getEmail());

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);

        String verificationLink = baseUrl + "/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), user.getDisplayName(), verificationLink);

        return "Registration successful. Please check your email to verify your account.";
    }

    public String login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> {
                    var matches = userRepository.findByPhoneEndingWith(" " + identifier);
                    return matches.size() == 1 ? java.util.Optional.of(matches.getFirst()) : java.util.Optional.empty();
                })
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );

        log.info("User logged in: {}", user.getEmail());
        return jwtUtil.generateToken(user.getEmail(), user.isAdmin());
    }

    @Transactional
    public String resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            throw new RuntimeException("Email is already verified");
        }

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);

        String verificationLink = baseUrl + "/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), user.getDisplayName(), verificationLink);

        return "Verification email sent. Please check your inbox.";
    }

    public String verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getUsed()) {
            throw new RuntimeException("Token has already been used");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        log.info("Email verified for user: {}", user.getEmail());
        return "Email verified successfully. You can now log in.";
    }

    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
        passwordResetTokenRepository.save(resetToken);

        String resetLink = baseUrl + "/api/auth/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getDisplayName(), resetLink);

        return "Password reset link sent to your email.";
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user: {}", email);
    }

    @Transactional
    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getUsed()) {
            throw new RuntimeException("Reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset for user: {}", user.getEmail());
        return "Password reset successfully. You can now log in.";
    }
}
