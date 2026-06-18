pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        IMAGE_BACKEND          = 'academic-platform-backend'
        IMAGE_FRONTEND         = 'academic-platform-frontend'
        TAG                     = "${env.BUILD_NUMBER}"

        SONAR_HOST_URL          = 'http://localhost:9000'
        SONAR_PROJECT_KEY       = 'academic-platform'
        // SONAR_AUTH_TOKEN injecte via credential Jenkins (Secret text)

        NEXUS_URL               = 'http://localhost:8081/repository/maven-snapshots/'
        NEXUS_REPO_ID           = 'nexus-snapshots'
    }

    stages {

        /**************** DEVELOPMENT PHASE ****************/

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Pre-commit Security Hooks') {
            steps {
                script {
                    sh '''
                        echo "Installation et execution des hooks de securite (pre-commit)..."
                        if ! dpkg -s python3-venv >/dev/null 2>&1; then
                            sudo apt-get update && sudo apt-get install -y python3-venv python3-pip
                        fi
                        if ! command -v pre-commit &> /dev/null; then
                            python3 -m venv venv
                            . venv/bin/activate
                            pip install pre-commit detect-secrets
                        else
                            . venv/bin/activate || true
                        fi
                        pre-commit install || true
                        pre-commit run --all-files || true
                    '''
                }
            }
        }

        stage('Build, Test & Package Backend') {
            steps {
                dir('backend') {
                    sh 'java -version'
                    sh 'mvn -version'
                    sh 'mvn clean package'
                }
            }
        }

        stage('Verify JAR') {
            steps {
                dir('backend') {
                    sh 'ls -l target/*.jar'
                }
            }
        }

        stage('JaCoCo Coverage Report') {
            steps {
                dir('backend') {
                    sh 'mvn jacoco:report || true'
                }
                step([$class: 'JacocoPublisher',
                    execPattern: '**/backend/target/jacoco.exec',
                    classPattern: '**/backend/target/classes',
                    sourcePattern: '**/backend/src/main/java',
                    exclusionPattern: '**/*Test*'
                ])
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'npm install'
                    sh 'npx ng build --configuration production'
                }
            }
        }

        /**************** ACCEPTANCE / QA PHASE ****************/

        // RAM hote tres limitee : on demarre SonarQube uniquement pour cette etape,
        // puis on l'arrete pour laisser la RAM aux etapes suivantes (Docker build, Trivy, ZAP).
        stage('Start SonarQube') {
            steps {
                sh '''
                    docker network inspect devsecops-net >/dev/null 2>&1 || docker network create devsecops-net
                    docker start sonarqube || docker run -d --name sonarqube --network devsecops-net -p 9000:9000 sonarqube:lts-community
                    echo "Attente du demarrage de SonarQube..."
                    for i in $(seq 1 30); do
                        if curl -s -o /dev/null http://localhost:9000; then
                            echo "SonarQube est pret."
                            break
                        fi
                        sleep 10
                    done
                '''
            }
        }

        stage('SAST - SonarQube Analysis') {
            steps {
                dir('backend') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        sh '''
                            mvn sonar:sonar \
                                -Dsonar.projectKey=academic-platform-backend \
                                -Dsonar.host.url=http://localhost:9000 \
                                -Dsonar.login=$SONAR_AUTH_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Stop SonarQube') {
            steps {
                sh 'docker stop sonarqube || true'
            }
        }

        stage('SCA - Dependency Check') {
            steps {
                dir('backend') {
                    sh 'mvn org.owasp:dependency-check-maven:check -Dformat=HTML || true'
                }
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'backend/target',
                    reportFiles: 'dependency-check-report.html',
                    reportName: 'OWASP Dependency-Check Report'
                ])
            }
        }

        stage('Secrets Scan - Gitleaks') {
            steps {
                script {
                    sh '''
                        echo "Telechargement et execution de Gitleaks..."
                        rm -f gitleaks.tar.gz gitleaks
                        GITLEAKS_URL=$(curl -s https://api.github.com/repos/gitleaks/gitleaks/releases/latest | grep browser_download_url | grep linux_x64.tar.gz | cut -d '"' -f 4)
                        curl -L -o gitleaks.tar.gz "$GITLEAKS_URL"
                        tar -xzf gitleaks.tar.gz gitleaks
                        chmod +x gitleaks
                        ./gitleaks detect \
                            --source . \
                            --no-git \
                            --report-format json \
                            --report-path gitleaks-report.json \
                            --no-banner || true
                    '''
                }
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'gitleaks-report.json',
                    reportName: 'Gitleaks JSON Report'
                ])
            }
        }

        stage('Docker Build & Scan') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_BACKEND}:${TAG} -f devops/docker/backend/Dockerfile backend/"
                    sh "docker build -t ${IMAGE_FRONTEND}:${TAG} -f devops/docker/frontend/Dockerfile ."

                    sh '''
                        echo "Scan de l'image avec Trivy..."
                        if ! command -v trivy &> /dev/null; then
                            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
                        fi
                        mkdir -p contrib
                        curl -sL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl -o contrib/html.tpl
                    '''
                    sh """
                        ./bin/trivy image \
                            --timeout 20m \
                            --exit-code 0 \
                            --severity MEDIUM,HIGH,CRITICAL \
                            --format template \
                            --template "@contrib/html.tpl" \
                            --output trivy-backend-report.html \
                            ${IMAGE_BACKEND}:${TAG} || true
                    """
                }
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'trivy-backend-report.html',
                    reportName: 'Trivy Report'
                ])
            }
        }

        stage('DAST - OWASP ZAP Scan') {
            steps {
                script {
                    sh '''
                        docker rm -f zap-target-backend || true
                        docker run -d --name zap-target-backend -p 8089:8089 academic-platform-backend:${TAG}
                        sleep 30
                        docker run --rm -v $(pwd):/zap/wrk/:rw \
                            owasp/zap2docker-stable zap-baseline.py \
                            -t http://host.docker.internal:8089 -r zap-report.html || true
                        docker rm -f zap-target-backend || true
                    '''
                }
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'zap-report.html',
                    reportName: 'OWASP ZAP Report'
                ])
            }
        }

        /**************** PRODUCTION PHASE ****************/

        stage('Start Nexus') {
            steps {
                sh '''
                    docker network inspect devsecops-net >/dev/null 2>&1 || docker network create devsecops-net
                    docker start nexus || docker run -d --name nexus --network devsecops-net -p 8081:8081 sonatype/nexus3:latest
                    echo "Attente du demarrage de Nexus..."
                    for i in $(seq 1 30); do
                        if curl -s -o /dev/null http://localhost:8081; then
                            echo "Nexus est pret."
                            break
                        fi
                        sleep 10
                    done
                '''
            }
        }

        stage('Deploy to Nexus') {
            steps {
                dir('backend') {
                    sh "mvn deploy -DskipTests -DaltDeploymentRepository=${NEXUS_REPO_ID}::default::${NEXUS_URL}"
                }
            }
        }

        stage('Stop Nexus') {
            steps {
                sh 'docker stop nexus || true'
            }
        }

        stage('Deploy Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKERHUB_CREDENTIALS,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                    sh "docker tag ${IMAGE_BACKEND}:${TAG} ${DOCKER_USER}/${IMAGE_BACKEND}:${TAG}"
                    sh "docker tag ${IMAGE_BACKEND}:${TAG} ${DOCKER_USER}/${IMAGE_BACKEND}:latest"
                    sh "docker push ${DOCKER_USER}/${IMAGE_BACKEND}:${TAG}"
                    sh "docker push ${DOCKER_USER}/${IMAGE_BACKEND}:latest"

                    sh "docker tag ${IMAGE_FRONTEND}:${TAG} ${DOCKER_USER}/${IMAGE_FRONTEND}:${TAG}"
                    sh "docker tag ${IMAGE_FRONTEND}:${TAG} ${DOCKER_USER}/${IMAGE_FRONTEND}:latest"
                    sh "docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:${TAG}"
                    sh "docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:latest"
                }
            }
        }

        /**************** OPERATIONS PHASE ****************/

        stage('Start Monitoring Containers') {
            steps {
                sh '''
                    docker network inspect devsecops-net >/dev/null 2>&1 || docker network create devsecops-net
                    docker start prometheus || docker run -d --name prometheus --network devsecops-net -p 9090:9090 -v /vagrant/devops/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro prom/prometheus:latest
                    docker start grafana || docker run -d --name grafana --network devsecops-net -p 3000:3000 -e GF_SECURITY_ADMIN_USER=admin -e GF_SECURITY_ADMIN_PASSWORD=admin -v /vagrant/devops/monitoring/grafana/datasources:/etc/grafana/provisioning/datasources:ro grafana/grafana:latest
                '''
            }
        }

        stage('Email Notification') {
            steps {
                emailext(
                    subject: 'Succes de la pipeline DevSecOps - Academic Platform',
                    body: 'Final Report: The pipeline has completed successfully. No action required.',
                    to: 't95135876@gmail.com'
                )
            }
        }
    }

    post {
        success {
            script {
                emailext(
                    subject: "Build Success: ${currentBuild.fullDisplayName}",
                    body: "Le build a reussi ! Consultez les details a ${env.BUILD_URL}",
                    to: 't95135876@gmail.com'
                )
            }
        }
        failure {
            script {
                emailext(
                    subject: "Build Failed: ${currentBuild.fullDisplayName}",
                    body: "Le build a echoue. Consultez les details a ${env.BUILD_URL}",
                    to: 't95135876@gmail.com'
                )
            }
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
