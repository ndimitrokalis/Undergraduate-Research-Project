package com.ndimitrokalis.streamingplatform.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        String secret = "c3RyZWFtaW5nLXBsYXRmb3JtLWRldi1zZWNyZXQta2V5LTI1Ni1iaXQtbG9uZw==";
        jwtUtil = new JwtUtil(secret, 86400000L);
    }

    @Test
    void generateToken_shouldReturnNonNullToken() {
        String token = jwtUtil.generateToken("test@example.com", false);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email, false);
        assertEquals(email, jwtUtil.extractEmail(token));
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email, false);
        assertTrue(jwtUtil.isTokenValid(token, email));
    }

    @Test
    void isTokenValid_shouldReturnFalseForWrongEmail() {
        String token = jwtUtil.generateToken("test@example.com", false);
        assertFalse(jwtUtil.isTokenValid(token, "other@example.com"));
    }

    @Test
    void isTokenValid_shouldThrowForExpiredToken() {
        JwtUtil shortLivedJwt = new JwtUtil(
                "c3RyZWFtaW5nLXBsYXRmb3JtLWRldi1zZWNyZXQta2V5LTI1Ni1iaXQtbG9uZw==", 0L);
        String token = shortLivedJwt.generateToken("test@example.com", false);
        assertThrows(Exception.class, () -> shortLivedJwt.isTokenValid(token, "test@example.com"));
    }

    @Test
    void extractEmail_shouldThrowForInvalidToken() {
        assertThrows(Exception.class, () -> jwtUtil.extractEmail("invalid.token.here"));
    }
}
