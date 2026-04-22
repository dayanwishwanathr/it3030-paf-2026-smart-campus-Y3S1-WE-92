package com.sliit.orbit_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret:orbit-dev-secret-key-change-me-please-2026}")
    private String secret;

    @Value("${app.jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ── Token generation (includes campusId + verified claims) ─────────────────
    public String generateToken(String email, String role, String campusId, boolean verified) {
        return Jwts.builder()
                .subject(email)
                .claim("role",     role)
                .claim("campusId", campusId)   // null until profile completed
                .claim("verified", verified)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Extractors ─────────────────────────────────────────────────────────────
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public String extractCampusId(String token) {
        return getClaims(token).get("campusId", String.class);
    }

    public boolean extractVerified(String token) {
        Boolean v = getClaims(token).get("verified", Boolean.class);
        return v != null && v;
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
