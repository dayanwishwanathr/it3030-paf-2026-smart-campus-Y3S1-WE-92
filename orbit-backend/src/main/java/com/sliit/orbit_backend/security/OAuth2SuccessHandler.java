package com.sliit.orbit_backend.security;

import java.io.IOException;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5174}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email   = oAuth2User.getAttribute("email");
        String name    = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Save new Google user if first time login, otherwise load existing
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .role(Role.USER)
                    .provider(AuthProvider.GOOGLE)
                    .profilePicture(picture)
                    .verified(false)   // must complete profile to verify
                    .build();
            return userRepository.save(Objects.requireNonNull(newUser, "OAuth user must not be null"));
        });

        // Generate JWT with verified + campusId claims
        String token = jwtUtil.generateToken(
                user.getEmail(), user.getRole().name(),
                user.getCampusId(), user.isVerified());

        String redirectUrl = frontendUrl + "/oauth2/success?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
