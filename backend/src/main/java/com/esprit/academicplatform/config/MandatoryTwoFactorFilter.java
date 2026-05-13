package com.esprit.academicplatform.config;

import com.esprit.academicplatform.auth.AuthSecurityState;
import com.esprit.academicplatform.auth.AuthSecurityStateRepository;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class MandatoryTwoFactorFilter extends OncePerRequestFilter {

    private static final Set<String> MANDATORY_TWO_FACTOR_AUTHORITIES = Set.of(
        "ROLE_SUPER_ADMIN",
        "ROLE_ADMINISTRATION",
        "ROLE_CHEF_DEPARTEMENT"
    );

    private final UserRepository userRepository;
    private final AuthSecurityStateRepository authSecurityStateRepository;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!requiresMandatoryTwoFactor(authentication) || isAllowedWithoutTwoFactor(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = extractAuthenticatedEmail(authentication);
        if (!StringUtils.hasText(email) || isTwoFactorEnabled(email)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"Activation de la double authentification requise.\"}");
    }

    @Override
    protected boolean shouldNotFilterErrorDispatch() {
        return true;
    }

    private boolean requiresMandatoryTwoFactor(Authentication authentication) {
        return authentication != null
            && authentication.isAuthenticated()
            && authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(MANDATORY_TWO_FACTOR_AUTHORITIES::contains);
    }

    private boolean isAllowedWithoutTwoFactor(HttpServletRequest request) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String requestPath = resolveRequestPath(request);
        if (!StringUtils.hasText(requestPath)) {
            return false;
        }

        if (requestPath.startsWith("/api/auth")) {
            return true;
        }

        if (HttpMethod.GET.matches(request.getMethod()) && requestPath.startsWith("/api/departments")) {
            return true;
        }

        if (isAssistantChatRequest(request.getMethod(), requestPath)) {
            return true;
        }

        return requestPath.startsWith("/api/health");
    }

    private boolean isAssistantChatRequest(String method, String requestPath) {
        return HttpMethod.POST.matches(method)
            && ("/api/assistant/chat".equals(requestPath) || "/api/assistant/chat/".equals(requestPath));
    }

    private String extractAuthenticatedEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            return normalizeEmail(userDetails.getUsername());
        }

        if (principal instanceof String username) {
            return normalizeEmail(username);
        }

        return null;
    }

    private boolean isTwoFactorEnabled(String email) {
        return userRepository.findByEmail(email)
            .map(User::getId)
            .flatMap(authSecurityStateRepository::findById)
            .map(AuthSecurityState::isTwoFactorEnabled)
            .orElse(false);
    }

    private String normalizeEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String resolveRequestPath(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        if (StringUtils.hasText(servletPath)) {
            return normalizeApiPath(servletPath);
        }

        String requestUri = request.getRequestURI();
        if (!StringUtils.hasText(requestUri)) {
            return null;
        }

        String contextPath = request.getContextPath();
        if (StringUtils.hasText(contextPath) && requestUri.startsWith(contextPath)) {
            String normalizedPath = requestUri.substring(contextPath.length());
            return normalizeApiPath(StringUtils.hasText(normalizedPath) ? normalizedPath : "/");
        }

        return normalizeApiPath(requestUri);
    }

    private String normalizeApiPath(String path) {
        if (!StringUtils.hasText(path)) {
            return path;
        }

        int apiPrefixIndex = path.indexOf("/api/");
        return apiPrefixIndex > 0 ? path.substring(apiPrefixIndex) : path;
    }
}
