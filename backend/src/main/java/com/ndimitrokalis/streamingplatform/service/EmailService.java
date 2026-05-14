package com.ndimitrokalis.streamingplatform.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String to, String username, String verificationLink) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("verificationLink", verificationLink);

        String html = templateEngine.process("email-verification", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Streaming Platform");
            helper.setTo(to);
            helper.setSubject("Verify your email - Streaming Platform");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String username, String resetLink) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("resetLink", resetLink);

        String html = templateEngine.process("password-reset", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Streaming Platform");
            helper.setTo(to);
            helper.setSubject("Reset your password - Streaming Platform");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
