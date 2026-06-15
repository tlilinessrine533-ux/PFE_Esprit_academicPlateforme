FROM jenkins/jenkins:lts

USER root

# -----------------------------------------------
# Installation de Docker CLI (pour builder des images depuis Jenkins)
# -----------------------------------------------
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list \
    && apt-get update && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------
# Installation de Node.js 22 (pour Angular 21)
# -----------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g @angular/cli \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------
# Installation de Maven 3.9 (pour Spring Boot)
# -----------------------------------------------
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz | tar xz -C /opt \
    && ln -s /opt/apache-maven-3.9.6/bin/mvn /usr/bin/mvn

# -----------------------------------------------
# Installation de Java 21 JDK (requis pour Maven + Spring Boot)
# -----------------------------------------------
RUN apt-get update && apt-get install -y wget \
    && wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_linux_hotspot_21.0.3_9.tar.gz -O /tmp/jdk21.tar.gz \
    && mkdir -p /opt/java \
    && tar xzf /tmp/jdk21.tar.gz -C /opt/java --strip-components=1 \
    && rm /tmp/jdk21.tar.gz \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/opt/java
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# -----------------------------------------------
# Installation d'Ansible (pour le déploiement)
# -----------------------------------------------
RUN apt-get update && apt-get install -y python3-pip sshpass \
    && pip3 install ansible --break-system-packages \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------
# Installation de SonarScanner CLI (pour l'analyse frontend)
# -----------------------------------------------
RUN curl -fsSL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip -o /tmp/sonar-scanner.zip \
    && apt-get update && apt-get install -y unzip \
    && unzip /tmp/sonar-scanner.zip -d /opt \
    && ln -s /opt/sonar-scanner-5.0.1.3006-linux/bin/sonar-scanner /usr/bin/sonar-scanner \
    && rm /tmp/sonar-scanner.zip \
    && rm -rf /var/lib/apt/lists/*

USER jenkins
