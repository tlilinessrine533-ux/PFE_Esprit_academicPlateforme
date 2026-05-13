package com.esprit.academicplatform.config;

import com.esprit.academicplatform.auth.JwtAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityFilterRegistrationConfig {

    @Bean
    FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration(
        JwtAuthenticationFilter filter
    ) {
        return disabledRegistration(filter);
    }

    @Bean
    FilterRegistrationBean<SuperAdminScopeFilter> superAdminScopeFilterRegistration(
        SuperAdminScopeFilter filter
    ) {
        return disabledRegistration(filter);
    }

    @Bean
    FilterRegistrationBean<DepartmentHeadScopeFilter> departmentHeadScopeFilterRegistration(
        DepartmentHeadScopeFilter filter
    ) {
        return disabledRegistration(filter);
    }

    @Bean
    FilterRegistrationBean<TeacherScopeFilter> teacherScopeFilterRegistration(
        TeacherScopeFilter filter
    ) {
        return disabledRegistration(filter);
    }

    @Bean
    FilterRegistrationBean<MandatoryTwoFactorFilter> mandatoryTwoFactorFilterRegistration(
        MandatoryTwoFactorFilter filter
    ) {
        return disabledRegistration(filter);
    }

    private <T extends jakarta.servlet.Filter> FilterRegistrationBean<T> disabledRegistration(T filter) {
        FilterRegistrationBean<T> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}
