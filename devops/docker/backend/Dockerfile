FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar

ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/pfe_academic_platform?useSSL=false&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root
ENV APP_JWT_SECRET=dev-only-jwt-secret-replace-me-in-prod
ENV MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,prometheus,metrics
ENV MANAGEMENT_PROMETHEUS_METRICS_EXPORT_ENABLED=true

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]
