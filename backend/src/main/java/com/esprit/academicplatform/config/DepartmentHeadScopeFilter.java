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
public class DepartmentHeadScopeFilter extends OncePerRequestFilter {

    private static final String DEPARTMENT_HEAD_AUTHORITY = "ROLE_CHEF_DEPARTEMENT";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!isDepartmentHead(authentication) || isAllowedForDepartmentHead(request)) {
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

    private boolean isDepartmentHead(Authentication authentication) {
        return authentication != null
            && authentication.isAuthenticated()
            && authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(DEPARTMENT_HEAD_AUTHORITY::equals);
    }

    private boolean isAllowedForDepartmentHead(HttpServletRequest request) {
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

        if (HttpMethod.GET.matches(request.getMethod())
            && ("/api/dashboard/department".equals(requestPath) || "/api/dashboard/personal".equals(requestPath))) {
            return true;
        }

        if (isAllowedWorkflowRequest(request.getMethod(), requestPath)) {
            return true;
        }

        if (isAllowedReportRequest(request.getMethod(), requestPath)) {
            return true;
        }

        if (isAllowedResponsibilityManagementRequest(request.getMethod(), requestPath)) {
            return true;
        }

        if (HttpMethod.GET.matches(request.getMethod()) && "/api/administration/absences".equals(requestPath)) {
            return true;
        }

        if (HttpMethod.GET.matches(request.getMethod()) && "/api/administration/evaluations".equals(requestPath)) {
            return true;
        }

        if (isAssistantChatRequest(request.getMethod(), requestPath)) {
            return true;
        }

        return HttpMethod.GET.matches(request.getMethod()) && isActivityConsultationRequest(requestPath);
    }

    private boolean isAllowedWorkflowRequest(String method, String requestUri) {
        if (HttpMethod.GET.matches(method)) {
            return "/api/workflow/activities".equals(requestUri)
                || "/api/workflow/pending/department".equals(requestUri)
                || requestUri.matches("^/api/workflow/\\d+/history$");
        }

        return HttpMethod.POST.matches(method) && requestUri.matches("^/api/workflow/\\d+/department-review$");
    }

    private boolean isAllowedReportRequest(String method, String requestUri) {
        if (HttpMethod.GET.matches(method)) {
            return "/api/reports".equals(requestUri) || requestUri.matches("^/api/reports/\\d+/download$");
        }

        return HttpMethod.POST.matches(method)
            && ("/api/reports/department/pdf".equals(requestUri) || "/api/reports/department/excel".equals(requestUri));
    }

    private boolean isActivityConsultationRequest(String requestUri) {
        return requestUri.startsWith("/api/teaching-activities")
            || requestUri.startsWith("/api/supervision-activities")
            || requestUri.startsWith("/api/research-activities")
            || requestUri.startsWith("/api/event-activities")
            || requestUri.startsWith("/api/exam-surveillance-activities")
            || requestUri.startsWith("/api/responsibility-activities")
            || requestUri.startsWith("/api/availability-requests");
    }

    private boolean isAllowedResponsibilityManagementRequest(String method, String requestUri) {
        if (HttpMethod.POST.matches(method)) {
            return "/api/responsibility-activities".equals(requestUri);
        }

        if (HttpMethod.PUT.matches(method) || HttpMethod.DELETE.matches(method)) {
            return requestUri.matches("^/api/responsibility-activities/\\d+$");
        }

        return false;
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
