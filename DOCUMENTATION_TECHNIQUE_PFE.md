# Documentation Technique PFE

## 1. Titre du projet

Plateforme intelligente de suivi des activites academiques et de generation automatique de rapports academiques basee sur l automatisation des workflows

## 2. Objectif technique

L application permet de :

- authentifier les utilisateurs avec JWT
- gerer les roles academiques
- declarer les activites academiques
- soumettre et valider les enseignements selon un workflow
- calculer des indicateurs
- generer des rapports PDF et Excel
- centraliser les informations academiques

## 3. Stack technique

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Maven

### Frontend

- Angular 21
- TypeScript
- Reactive Forms
- HttpClient

### Base de donnees

- MySQL
- phpMyAdmin

## 4. Architecture generale

Le projet suit une architecture en 3 couches :

1. Frontend Angular
2. Backend Spring Boot REST API
3. Base de donnees MySQL

Flux principal :

1. L utilisateur se connecte via Angular.
2. Angular envoie la requete au backend.
3. Le backend verifie l utilisateur et retourne un token JWT.
4. Angular stocke le token et l envoie dans les requetes suivantes.
5. Le backend applique la logique metier puis lit ou ecrit dans MySQL.

## 5. Modules implementes

### Backend

- Health check
- Authentification JWT
- Gestion des utilisateurs
- Gestion des departements
- Gestion des enseignements
- Workflow de validation
- Gestion des encadrements
- Gestion des activites de recherche
- Generation de rapports PDF et Excel
- Dashboard personnel, departemental et global

### Frontend

- Page login
- Dashboard
- Gestion des utilisateurs
- Gestion des enseignements
- Gestion des encadrements
- Gestion de la recherche
- Generation et historique des rapports
- Workflow et historique de validation

## 6. Base de donnees

Principales tables :

- `departments`
- `users`
- `activities`
- `teaching_activities`
- `supervision_activities`
- `research_activities`
- `event_activities`
- `exam_surveillance_activities`
- `responsibility_activities`
- `validation_history`
- `reports`
- `notifications`

Vues :

- `v_teacher_kpis`
- `v_department_kpis`

## 7. Securite

La securite repose sur :

- login via email et mot de passe
- generation d un token JWT
- transmission du token dans le header `Authorization`
- controle d acces selon le role

Roles utilises :

- `ENSEIGNANT`
- `CHEF_DEPARTEMENT`
- `ADMINISTRATION`
- `SUPER_ADMIN`

## 8. Workflow de validation

Le workflow actuel s applique au module enseignement :

1. L enseignant cree un enseignement en brouillon.
2. L enseignant soumet l activite.
3. Le chef de departement peut valider, rejeter ou demander correction.
4. L administration peut faire la validation finale.
5. Chaque decision est historisee dans `validation_history`.

## 9. Rapports

Types actuellement exposes dans l application :

- rapport individuel PDF
- rapport individuel Excel
- historique des rapports generes

Les fichiers sont aussi stockes dans le backend dans le dossier :

```text
backend/generated-reports
```

## 10. Lancement du projet

### Base de donnees

1. Demarrer `Apache` et `MySQL` dans XAMPP
2. Ouvrir `phpMyAdmin`
3. Importer `schema-pfe-mysql.sql`
4. Importer `donnees-test-pfe.sql`

### Backend

Dans le dossier `backend` :

```powershell
& "C:\Maven\apache-maven-3.9.14\bin\mvn.cmd" spring-boot:run
```

URL :

```text
http://localhost:8081
```

### Frontend

Dans le dossier `frontend` :

```powershell
npm.cmd start
```

URL :

```text
http://localhost:4200
```

## 11. Comptes de test

- `superadmin@esprit.tn / 123456`
- `admin@esprit.tn / 123456`
- `chef.info@esprit.tn / 123456`
- `enseignant@esprit.tn / 123456`

## 12. Perspectives d amelioration

- workflow pour les autres types d activites
- notifications email
- filtres avances
- export departemental et institutionnel
- dashboards plus graphiques
- analyse predictive des charges
