# 🚀 Academic Platform — Infrastructure DevOps Complète

Ce projet contient **toute l'infrastructure DevOps** prête à l'emploi pour l'application **Academic Platform** (Angular 21 + Spring Boot 3.4.4).

> **⚠️ POUR LE DÉVELOPPEUR : Vous n'avez rien à installer manuellement. Tout est conteneurisé. Suivez les étapes ci-dessous.**

---

## 📋 Ce qui est inclus automatiquement

| Outil | Rôle | Port | URL |
|---|---|---|---|
| **Jenkins** | CI/CD — Build, Test, Deploy automatique | 8080 | http://192.168.56.10:8080 |
| **SonarQube** | Analyse qualité du code | 9000 | http://192.168.56.10:9000 |
| **Nexus** | Registre d'artefacts (JAR, Docker) | 8082 | http://192.168.56.10:8082 |
| **Prometheus** | Collecte de métriques backend | 9090 | http://192.168.56.10:9090 |
| **Grafana** | Tableaux de bord monitoring | 3000 | http://192.168.56.10:3000 |
| **MailHog** | Serveur email de test | 8025 | http://192.168.56.10:8025 |
| **MySQL 8** | Base de données | 3306 | — |
| **PostgreSQL 15** | Base de données SonarQube | interne | — |
| **Frontend** | Interface Angular | 80 | http://192.168.56.10 |
| **Backend** | API Spring Boot | 8081 | http://192.168.56.10:8081 |

> **Jenkins inclut déjà** : Maven 3.9, Node.js 22, Angular CLI, Java 21, Docker CLI, SonarScanner et Ansible. Aucun plugin supplémentaire n'est nécessaire pour exécuter la pipeline.

---

## 🛠️ Prérequis (3 logiciels à installer)

| Logiciel | Version | Téléchargement | Vérification |
|---|---|---|---|
| **VirtualBox** | ≥ 7.0 | https://www.virtualbox.org/wiki/Downloads | `VBoxManage --version` |
| **Vagrant** | ≥ 2.4 | https://www.vagrantup.com/downloads | `vagrant --version` |
| **Ansible** | ≥ 2.15 | `pip install ansible` | `ansible --version` |

> **💡 Sous Windows ?** Installez [WSL2](https://learn.microsoft.com/fr-fr/windows/wsl/install) avec Ubuntu, puis dans WSL : `sudo apt install ansible`. VirtualBox et Vagrant s'installent sur Windows normalement.
> **⚠️ RAM requise** : La VM utilise **8 Go de RAM**. Votre machine doit avoir au minimum **16 Go de RAM**.

---

## 🚀 Démarrage en 3 étapes

### Étape 1 — Cloner et préparer
```bash
git clone <url-du-depot>
cd <nom-du-projet>
```

### Étape 2 — Créer la machine virtuelle
```bash
vagrant up
```
> ⏱️ Durée : ~5 minutes. Crée une VM Ubuntu 22.04 (8 Go RAM, 4 CPUs, IP : `192.168.56.10`).

### Étape 3 — Déployer toute l'infrastructure
```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```
> ⏱️ Durée : ~10 minutes la première fois (téléchargement des images Docker).
> À la fin, le playbook affiche **toutes les URLs et mots de passe** dans le terminal.

---

## 🔑 Identifiants par défaut

| Service | Utilisateur | Mot de passe |
|---|---|---|
| **SonarQube** | `admin` | `admin` |
| **Grafana** | `admin` | `admin` |
| **MySQL** | `root` | `root` |

### Jenkins (mot de passe initial unique) :
```bash
vagrant ssh
docker exec academic_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Nexus (mot de passe initial unique) :
```bash
vagrant ssh
docker exec academic_nexus cat /nexus-data/admin.password
```

---

## ⚙️ Configuration Initiale (À faire UNE SEULE FOIS)

L'infrastructure démarre automatiquement, mais les outils sécurisés nécessitent une configuration initiale manuelle via leur interface web.

### 1. Configuration de SonarQube (http://192.168.56.10:9000)
Pour que la pipeline Jenkins puisse envoyer l'analyse à SonarQube :
1. Connectez-vous avec `admin` / `admin` et changez le mot de passe.
2. Allez dans **Administration > Security**.
3. Décochez **"Force user authentication"** (cela autorise Jenkins à envoyer l'analyse sans token complexe, idéal pour le développement local).

### 2. Configuration de Jenkins (http://192.168.56.10:8080)
1. Collez le **mot de passe initial** (récupéré via la commande de la section Identifiants).
2. Cliquez sur **"Install suggested plugins"** et attendez la fin de l'installation.
3. Créez votre compte administrateur.
4. **Ajouter les accès Docker Hub** :
   - Allez dans **Manage Jenkins > Credentials > System > Global credentials (unrestricted)**.
   - Cliquez sur **Add Credentials**.
   - Type : `Username with password`.
   - Username : *votre nom d'utilisateur Docker Hub*.
   - Password : *votre mot de passe Docker Hub*.
   - **ID** : `docker-hub-credentials` *(très important, doit être écrit exactement comme ça)*.
5. **Créer la Pipeline** :
   - Cliquez sur **New Item**.
   - Nommez-le `Academic-Platform-Pipeline`, choisissez **Pipeline**, et cliquez sur OK.
   - Dans la section *Pipeline*, choisissez **Definition : Pipeline script from SCM**.
   - **SCM** : Git
   - **Repository URL** : *L'URL de votre dépôt GitHub contenant le projet.*
   - **Script Path** : `Jenkinsfile`.
   - Sauvegardez et cliquez sur **Build Now** !

---

## 📁 Structure du projet

```
academic-platform/                       (racine du projet GitHub)
│
├── frontend/                            ← Code Angular (développeur)
├── backend/                             ← Code Spring Boot (développeur)
│
├── Jenkinsfile                          ← Pipeline CI/CD (copier depuis jenkins/)
├── docker-compose.yml                   ← Tous les services
├── Vagrantfile                          ← Création de la VM
│
├── docker/
│   ├── frontend/
│   │   ├── Dockerfile                   ← Build Angular → Nginx
│   │   └── nginx.conf                   ← Proxy /api → Backend
│   ├── backend/
│   │   └── Dockerfile                   ← Build Spring Boot → JAR
│   └── jenkins/
│       └── Dockerfile                   ← Jenkins custom (Maven, Node, Docker)
│
├── ansible/
│   ├── inventory.ini                    ← IP de la VM Vagrant
│   └── playbook.yml                     ← Installation automatique
│
└── monitoring/
    ├── prometheus.yml                   ← Scraping /actuator/prometheus
    └── grafana/
        └── datasources/
            └── prometheus.yml           ← Connexion auto Grafana → Prometheus
```

---

## 🔄 Comment intégrer dans le projet réel

### Pour le développeur : Intégration dans votre dépôt GitHub

1. **Copier le contenu de ce dossier `devops/`** à la racine de votre projet GitHub (à côté de `frontend/` et `backend/`).

2. **Copier le `Jenkinsfile`** depuis `jenkins/Jenkinsfile` vers la **racine** du projet :
   ```bash
   cp jenkins/Jenkinsfile ./Jenkinsfile
   ```

3. **Dans le `pom.xml` du backend**, ajoutez ces dépendances pour activer les métriques Prometheus :
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   <dependency>
       <groupId>io.micrometer</groupId>
       <artifactId>micrometer-registry-prometheus</artifactId>
   </dependency>
   ```

4. **Dans `application.properties`**, ajoutez :
   ```properties
   management.endpoints.web.exposure.include=health,info,prometheus,metrics
   management.prometheus.metrics.export.enabled=true
   ```

---

## 📊 Monitoring : Que superviser dans Grafana ?

Une fois Grafana ouvert (http://192.168.56.10:3000), Prometheus est **déjà connecté automatiquement**. Créez un dashboard avec ces métriques :

| Métrique | Requête PromQL |
|---|---|
| CPU JVM | `process_cpu_usage` |
| Mémoire Heap | `jvm_memory_used_bytes{area="heap"}` |
| Requêtes HTTP/sec | `rate(http_server_requests_seconds_count[5m])` |
| Temps de réponse moyen | `rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m])` |

---

## 🛑 Commandes utiles

### Vagrant
```bash
vagrant up              # Démarrer la VM
vagrant halt            # Arrêter la VM (les données sont conservées)
vagrant destroy -f      # Supprimer la VM (tout est perdu)
vagrant ssh             # Se connecter en SSH à la VM
```

### Docker (dans la VM via `vagrant ssh`)
```bash
cd /opt/academic-platform

docker compose ps                    # État de tous les services
docker compose logs -f               # Tous les logs en temps réel
docker compose logs -f backend       # Logs du backend uniquement
docker compose restart backend       # Redémarrer un service
docker compose down                  # Tout arrêter
docker compose up -d                 # Tout relancer
```
