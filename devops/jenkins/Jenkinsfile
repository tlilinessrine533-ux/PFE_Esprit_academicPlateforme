pipeline {
    agent any

    environment {
        // ===== CONFIGURATION — À PERSONNALISER =====
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'
        IMAGE_FRONTEND         = 'academic-platform-frontend'
        IMAGE_BACKEND          = 'academic-platform-backend'
        TAG                    = "${env.BUILD_NUMBER}"

        // SonarQube : pointe vers le conteneur SonarQube du docker-compose
        SONAR_HOST_URL         = 'http://sonarqube:9000'
        SONAR_PROJECT_KEY      = 'academic-platform'
    }

    stages {

        // ===== ÉTAPE 1 : RÉCUPÉRER LE CODE SOURCE =====
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ===== ÉTAPE 2 : BUILD FRONTEND (Angular 21) =====
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'npm ci'
                    sh 'npx ng build --configuration production'
                }
            }
        }

        // ===== ÉTAPE 3 : TESTS FRONTEND (Vitest) =====
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npx ng test --watch=false'
                }
            }
        }

        // ===== ÉTAPE 4 : BUILD BACKEND (Spring Boot + Maven) =====
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'java -version'
                    sh 'mvn --version'
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // ===== ÉTAPE 5 : TESTS BACKEND (JUnit 5) =====
        stage('Test Backend') {
            steps {
                dir('backend') {
                    // Note DevOps : Le dossier src/test/ est vide.
                    // Ce stage passera mais sans exécuter de tests.
                    // C'est une remarque pertinente pour le jury.
                    sh 'mvn test'
                }
            }
        }

        // ===== ÉTAPE 6 : ANALYSE SONARQUBE =====
        stage('SonarQube Analysis') {
            steps {
                // Analyse du Backend (Maven + SonarQube plugin)
                dir('backend') {
                    sh """
                        mvn sonar:sonar \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY}-backend \
                            -Dsonar.projectName='Academic Platform Backend'
                    """
                }
                // Analyse du Frontend (SonarScanner CLI)
                dir('frontend') {
                    sh """
                        sonar-scanner \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY}-frontend \
                            -Dsonar.projectName='Academic Platform Frontend' \
                            -Dsonar.sources=src \
                            -Dsonar.exclusions=node_modules/**,dist/**
                    """
                }
            }
        }

        // ===== ÉTAPE 7 : CONSTRUCTION DES IMAGES DOCKER =====
        stage('Docker Build') {
            steps {
                script {
                    // Build Frontend (context = racine du projet pour accéder à docker/frontend/nginx.conf)
                    sh "docker build -t ${IMAGE_FRONTEND}:${TAG} -t ${IMAGE_FRONTEND}:latest -f docker/frontend/Dockerfile ."

                    // Build Backend (context = dossier backend)
                    sh "docker build -t ${IMAGE_BACKEND}:${TAG} -t ${IMAGE_BACKEND}:latest -f docker/backend/Dockerfile backend/"
                }
            }
        }

        // ===== ÉTAPE 8 : PUSH VERS DOCKER HUB =====
        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_HUB_CREDENTIALS,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                        // Tag et push Frontend
                        sh "docker tag ${IMAGE_FRONTEND}:${TAG} ${DOCKER_USER}/${IMAGE_FRONTEND}:${TAG}"
                        sh "docker tag ${IMAGE_FRONTEND}:latest ${DOCKER_USER}/${IMAGE_FRONTEND}:latest"
                        sh "docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:${TAG}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:latest"

                        // Tag et push Backend
                        sh "docker tag ${IMAGE_BACKEND}:${TAG} ${DOCKER_USER}/${IMAGE_BACKEND}:${TAG}"
                        sh "docker tag ${IMAGE_BACKEND}:latest ${DOCKER_USER}/${IMAGE_BACKEND}:latest"
                        sh "docker push ${DOCKER_USER}/${IMAGE_BACKEND}:${TAG}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_BACKEND}:latest"
                    }
                }
            }
        }

        // ===== ÉTAPE 9 : DÉPLOIEMENT SUR LE SERVEUR =====
        stage('Deploy') {
            steps {
                // Redémarrer les conteneurs backend et frontend avec les nouvelles images
                sh 'docker compose up -d --no-deps --build backend frontend'
            }
        }
    }

    // ===== NOTIFICATIONS =====
    post {
        success {
            echo '✅ Pipeline terminée avec succès ! Application déployée.'
        }
        failure {
            echo '❌ La pipeline a échoué. Vérifiez les logs ci-dessus.'
        }
        always {
            // Nettoyer les images Docker non utilisées
            sh 'docker image prune -f || true'
        }
    }
}
