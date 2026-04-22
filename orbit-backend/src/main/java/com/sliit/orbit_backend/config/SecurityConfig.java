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

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2SuccessHandler oAuth2SuccessHandler) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // STATELESS: Spring Security never loads/saves SecurityContext from the
            // HTTP session, so the OAuth2 session auth can't override our JWT filter.
            // The OAuth2 handshake still works — it stores its state via a separate
            // session attribute (HttpSessionOAuth2AuthorizationRequestRepository),
            // which is independent of Spring Security's SecurityContextRepository.
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── OAuth2 & auth endpoints ───────────────────────────────
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // ── Resources: public read, MANAGER manages ───────────────
                .requestMatchers(HttpMethod.GET,    "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.POST,   "/api/resources/**").hasRole("MANAGER")
                .requestMatchers(HttpMethod.PUT,    "/api/resources/**").hasRole("MANAGER")
                .requestMatchers(HttpMethod.PATCH,  "/api/resources/**").hasRole("MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasRole("MANAGER")

                // ── Bookings: MANAGER approves/rejects, USER creates ──────
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "MANAGER", "ADMIN")

                // ── Tickets: TECHNICIAN + ADMIN manage, USER creates ──────
                .requestMatchers("/api/tickets/**").hasAnyRole("USER", "TECHNICIAN", "MANAGER", "ADMIN")

                // ── Notifications: any logged-in user ─────────────────────
                .requestMatchers("/api/notifications/**").authenticated()

                // ── Users: ADMIN only ─────────────────────────────────────
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                // ── Everything else requires login ────────────────────────
                .anyRequest().authenticated()
            )
<<<<<<< Updated upstream
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
=======
            // ── Wire OAuth2 login with our custom success handler ─────────
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
>>>>>>> Stashed changes
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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
        // Read comma-separated origins from application.properties
        List<String> origins = Arrays.asList(allowedOriginsRaw.split(","));
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
