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
public class TeacherScopeFilter extends OncePerRequestFilter {

    private static final String TEACHER_AUTHORITY = "ROLE_ENSEIGNANT";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!isTeacher(authentication) || isAllowedForTeacher(request)) {
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

    private boolean isTeacher(Authentication authentication) {
        return authentication != null
            && authentication.isAuthenticated()
            && authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(TEACHER_AUTHORITY::equals);
    }

    private boolean isAllowedForTeacher(HttpServletRequest request) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String method = request.getMethod();
        String requestPath = resolveRequestPath(request);
        if (!StringUtils.hasText(requestPath)) {
            return false;
        }

        if (requestPath.startsWith("/api/auth")) {
            return true;
        }

        if (HttpMethod.GET.matches(method) && requestPath.startsWith("/api/departments")) {
            return true;
        }

        if (HttpMethod.GET.matches(method) && "/api/dashboard/personal".equals(requestPath)) {
            return true;
        }

        if (isAllowedIndividualReportRequest(method, requestPath)) {
            return true;
        }

        if (isAllowedTeacherActivityRequest(method, requestPath)) {
            return true;
        }

        if (isAllowedTeacherWorkflowRequest(method, requestPath)) {
            return true;
        }

        if (HttpMethod.POST.matches(method) && requestPath.matches("^/api/workflow/\\d+/submit$")) {
            return true;
        }

        if (isAssistantChatRequest(method, requestPath)) {
            return true;
        }

        return requestPath.startsWith("/api/health");
    }

    private boolean isAllowedIndividualReportRequest(String method, String requestUri) {
        if (HttpMethod.GET.matches(method)) {
            return "/api/reports".equals(requestUri) || requestUri.matches("^/api/reports/\\d+/download$");
        }

        return HttpMethod.POST.matches(method)
            && ("/api/reports/individual/pdf".equals(requestUri) || "/api/reports/individual/excel".equals(requestUri));
    }

    private boolean isAllowedTeacherActivityRequest(String method, String requestUri) {
        if (HttpMethod.GET.matches(method)) {
            return requestUri.startsWith("/api/teaching-activities")
                || requestUri.startsWith("/api/supervision-activities")
                || requestUri.startsWith("/api/research-activities")
                || requestUri.startsWith("/api/event-activities")
                || requestUri.startsWith("/api/exam-surveillance-activities")
                || requestUri.startsWith("/api/responsibility-activities")
                || requestUri.startsWith("/api/availability-requests");
        }

        if (HttpMethod.POST.matches(method)) {
            return "/api/teaching-activities".equals(requestUri)
                || requestUri.matches("^/api/teaching-activities/\\d+/submit$")
                || "/api/supervision-activities".equals(requestUri)
                || "/api/research-activities".equals(requestUri)
                || "/api/event-activities".equals(requestUri)
                || "/api/exam-surveillance-activities".equals(requestUri)
                || "/api/responsibility-activities".equals(requestUri)
                || "/api/availability-requests/leave".equals(requestUri)
                || "/api/availability-requests/mission".equals(requestUri);
        }

        if (HttpMethod.PUT.matches(method) || HttpMethod.DELETE.matches(method)) {
            return requestUri.matches("^/api/teaching-activities/\\d+$")
                || requestUri.matches("^/api/supervision-activities/\\d+$")
                || requestUri.matches("^/api/research-activities/\\d+$")
                || requestUri.matches("^/api/event-activities/\\d+$")
                || requestUri.matches("^/api/exam-surveillance-activities/\\d+$")
                || requestUri.matches("^/api/responsibility-activities/\\d+$");
        }

        return false;
    }

    private boolean isAssistantChatRequest(String method, String requestPath) {
        return HttpMethod.POST.matches(method)
            && ("/api/assistant/chat".equals(requestPath) || "/api/assistant/chat/".equals(requestPath));
    }

    private boolean isAllowedTeacherWorkflowRequest(String method, String requestPath) {
        if (!HttpMethod.GET.matches(method)) {
            return false;
        }

        return "/api/workflow/activities".equals(requestPath) || requestPath.matches("^/api/workflow/\\d+/history$");
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
