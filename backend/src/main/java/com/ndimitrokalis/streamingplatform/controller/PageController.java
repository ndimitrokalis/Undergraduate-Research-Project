package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class PageController {

    private final AuthService authService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/api/auth/verify")
    public String verifyEmail(@RequestParam String token) {
        try {
            authService.verifyEmail(token);
            return "redirect:" + frontendUrl + "/login?verified=true";
        } catch (RuntimeException e) {
            return "redirect:" + frontendUrl + "/login?error=" + java.net.URLEncoder.encode(e.getMessage(), java.nio.charset.StandardCharsets.UTF_8);
        }
    }

    @GetMapping("/api/auth/reset-password")
    public String resetPassword(@RequestParam String token) {
        return "redirect:" + frontendUrl + "/reset-password?token=" + token;
    }
}
