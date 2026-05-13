package com.esprit.academicplatform.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SuperAdminScopeFilter extends OncePerRequestFilter {

    private static final String SUPER_ADMIN_AUTHORITY = "ROLE_SUPER_ADMIN";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!isSuperAdmin(authentication) || isAllowedForSuperAdmin(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"Acces refuse.\"}");
    }

    @Override
    protected boolean shouldNotFilterErrorDispatch() {
        return true;
    }

    private boolean isSuperAdmin(Authentication authentication) {
        return authentication != null
            && authentication.isAuthenticated()
            && authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(SUPER_ADMIN_AUTHORITY::equals);
    }

    private boolean isAllowedForSuperAdmin(HttpServletRequest request) {
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

        return requestPath.startsWith("/api/users")
            || requestPath.startsWith("/api/signup-requests")
            || requestPath.startsWith("/api/reports")
            || (HttpMethod.GET.matches(request.getMethod()) && requestPath.startsWith("/api/dashboard/"))
            || isAssistantChatRequest(request.getMethod(), requestPath)
            || requestPath.startsWith("/api/health");
    }

    private boolean isAssistantChatRequest(String method, String requestPath) {
        return HttpMethod.POST.matches(method)
            && ("/api/assistant/chat".equals(requestPath) || "/api/assistant/chat/".equals(requestPath));
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
