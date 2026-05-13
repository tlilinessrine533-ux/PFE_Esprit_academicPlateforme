package com.esprit.academicplatform.config;

import com.esprit.academicplatform.auth.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SuperAdminScopeFilter superAdminScopeFilter;
    private final DepartmentHeadScopeFilter departmentHeadScopeFilter;
    private final TeacherScopeFilter teacherScopeFilter;
    private final MandatoryTwoFactorFilter mandatoryTwoFactorFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable())
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "");
                    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"message\":\"Authentification requise.\"}");
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "");
                    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"message\":\"Acces refuse.\"}");
                })
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/health", "/api/health/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login/verify-2fa").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/passkeys/login/options", "/api/auth/passkeys/login/finish")
                    .permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/face-recognition/login").permitAll()
                .requestMatchers(HttpMethod.POST,
                        "/api/auth/password-reset/request",
                        "/api/auth/password-reset/confirm",
                        "/api/auth/password-reset/phone/request", 
                        "/api/auth/password-reset/phone/confirm"
                    ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/departments", "/api/departments/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/signup-requests").denyAll()
                .requestMatchers(HttpMethod.POST, "/api/signup-requests/*/approve", "/api/signup-requests/*/reject")
                    .hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/signup-requests/**").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                .requestMatchers("/api/auth/passkeys", "/api/auth/passkeys/**").authenticated()
                .requestMatchers("/api/auth/face-recognition", "/api/auth/face-recognition/**").authenticated()
                .requestMatchers("/api/auth/two-factor", "/api/auth/two-factor/**").authenticated()
                .requestMatchers("/api/users/**").hasRole("SUPER_ADMIN")
                .requestMatchers(
                    "/api/teaching-activities/**",
                    "/api/supervision-activities/**",
                    "/api/research-activities/**",
                    "/api/event-activities/**",
                    "/api/exam-surveillance-activities/**",
                    "/api/availability-requests/**"
                ).hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT")
                .requestMatchers("/api/responsibility-activities/**")
                .hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT")
                .requestMatchers(HttpMethod.GET, "/api/dashboard/personal")
                    .hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/dashboard/department").hasRole("CHEF_DEPARTEMENT")
                .requestMatchers(HttpMethod.GET, "/api/dashboard/global").hasAnyRole("ADMINISTRATION", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reports").hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/reports/individual/pdf", "/api/reports/individual/excel")
                    .hasRole("ENSEIGNANT")
                .requestMatchers(HttpMethod.POST, "/api/reports/department/pdf", "/api/reports/department/excel")
                    .hasRole("CHEF_DEPARTEMENT")
                .requestMatchers(HttpMethod.POST, "/api/reports/institution/pdf", "/api/reports/institution/excel")
                    .hasAnyRole("ADMINISTRATION", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reports/*/download")
                    .hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/workflow/activities", "/api/workflow/*/history")
                    .hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION")
                .requestMatchers(HttpMethod.GET, "/api/workflow/pending/department").hasRole("CHEF_DEPARTEMENT")
                .requestMatchers(HttpMethod.GET, "/api/workflow/pending/final").hasRole("ADMINISTRATION")
                .requestMatchers(HttpMethod.POST, "/api/workflow/*/submit").hasRole("ENSEIGNANT")
                .requestMatchers(HttpMethod.POST, "/api/workflow/*/department-review").hasRole("CHEF_DEPARTEMENT")
                .requestMatchers(HttpMethod.POST, "/api/workflow/*/final-review").hasRole("ADMINISTRATION")
                .requestMatchers(HttpMethod.GET, "/api/administration/absences")
                    .hasAnyRole("CHEF_DEPARTEMENT", "ADMINISTRATION")
                .requestMatchers(HttpMethod.GET, "/api/administration/config", "/api/administration/evaluations", "/api/administration/history")
                    .hasRole("ADMINISTRATION")
                .requestMatchers(HttpMethod.PUT, "/api/administration/config").hasRole("ADMINISTRATION")
                .requestMatchers(HttpMethod.POST, "/api/administration/evaluations/*/final-decision")
                    .hasRole("ADMINISTRATION")
                .requestMatchers(HttpMethod.POST, "/api/assistant/chat", "/api/assistant/chat/")
                .hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN")
                      //  .permitAll()
                .anyRequest().denyAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(superAdminScopeFilter, JwtAuthenticationFilter.class)
            .addFilterAfter(departmentHeadScopeFilter, SuperAdminScopeFilter.class)
            .addFilterAfter(teacherScopeFilter, DepartmentHeadScopeFilter.class)
            .addFilterAfter(mandatoryTwoFactorFilter, TeacherScopeFilter.class)
            .build();
    }
}
