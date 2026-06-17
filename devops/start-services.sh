#!/bin/bash
set -e

docker network inspect devsecops-net >/dev/null 2>&1 || docker network create devsecops-net

if [ ! "$(docker ps -aq -f name=^sonarqube$)" ]; then
    docker run -d --name sonarqube \
        --network devsecops-net \
        -p 9000:9000 \
        sonarqube:lts-community
fi

if [ ! "$(docker ps -aq -f name=^nexus$)" ]; then
    docker run -d --name nexus \
        --network devsecops-net \
        -p 8081:8081 \
        sonatype/nexus3:latest
fi

if [ ! "$(docker ps -aq -f name=^prometheus$)" ]; then
    docker run -d --name prometheus \
        --network devsecops-net \
        -p 9090:9090 \
        -v /vagrant/devops/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro \
        prom/prometheus:latest
fi

if [ ! "$(docker ps -aq -f name=^grafana$)" ]; then
    docker run -d --name grafana \
        --network devsecops-net \
        -p 3000:3000 \
        -e GF_SECURITY_ADMIN_USER=admin \
        -e GF_SECURITY_ADMIN_PASSWORD=admin \
        -v /vagrant/devops/monitoring/grafana/datasources:/etc/grafana/provisioning/datasources:ro \
        grafana/grafana:latest
fi

echo "Containers demarres :"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
