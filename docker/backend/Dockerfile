FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copier le JAR généré par Maven
COPY target/*.jar app.jar

# Variables d'environnement par défaut
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/pfe_academic_platform?useSSL=false&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root
ENV APP_JWT_SECRET=dev-only-jwt-secret-replace-me-in-prod

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
