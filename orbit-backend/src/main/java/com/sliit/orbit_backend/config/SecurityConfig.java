package com.sliit.orbit_backend.config;

import org.springframework.beans.factory.annotation.Value;
import com.sliit.orbit_backend.security.JwtAuthFilter;
import com.sliit.orbit_backend.security.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOriginsRaw;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2SuccessHandler oAuth2SuccessHandler)
            throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Public ────────────────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/bookings/public/**").permitAll()

                // ── Self-service profile (any authenticated user) ─────────
                .requestMatchers("/api/users/me").authenticated()
                .requestMatchers("/api/users/me/profile").authenticated()

                // ── Resources: public read, MANAGER manages ───────────────
                .requestMatchers(HttpMethod.GET,    "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.POST,   "/api/resources/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/resources/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH,  "/api/resources/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasAnyRole("MANAGER", "ADMIN")

                // ── Bookings: MANAGER approves/rejects, USER creates ──────
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "MANAGER", "ADMIN")

                // ── Tickets: TECHNICIAN + ADMIN manage, USER creates ──────
                // Attachment download is public so <img> tags work in browser
                .requestMatchers(HttpMethod.GET, "/api/tickets/attachments/**").permitAll()
                .requestMatchers("/api/tickets/**").hasAnyRole("USER", "TECHNICIAN", "MANAGER", "ADMIN")

                // ── Notifications: any logged-in user ─────────────────────
                .requestMatchers("/api/notifications/**").authenticated()

                // ── Users: ADMIN only (except /me routes above) ───────────
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                // ── Everything else requires login ────────────────────────
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Allows any local IP dynamically
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
