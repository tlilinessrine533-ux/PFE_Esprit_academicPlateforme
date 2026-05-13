# Plan PFE

## 1. Sujet
Plateforme intelligente de suivi des activites academiques et de generation automatique de rapports academiques basee sur l'automatisation des workflows.

## 2. Objectif du projet
Construire une application web qui permet de :
- declarer les activites academiques
- centraliser les donnees
- soumettre les activites a validation
- calculer automatiquement les charges et indicateurs
- generer des rapports PDF et Excel

## 3. Stack recommandee
Pour un PFE en developpement et architecture logicielle, je recommande :
- Frontend : Angular
- Backend : Spring Boot
- Base de donnees : MySQL
- Administration base de donnees : phpMyAdmin
- Authentification : JWT
- Rapports : PDF + Excel

Pourquoi :
- Angular correspond au cahier des charges
- Spring Boot est tres valorise dans les projets academiques
- MySQL est tres simple a utiliser avec phpMyAdmin
- phpMyAdmin vous aidera a visualiser facilement les tables et les donnees

## 4. Perimetre conseille
### Version 1 - MVP soutenable
- authentification
- gestion des roles
- declaration des enseignements
- declaration des encadrements
- declaration de recherche scientifique simple
- soumission pour validation
- validation chef de departement
- validation finale administration
- calcul automatique des heures
- rapport individuel PDF
- export Excel
- dashboard simple

### Version 2 - Extensions
- notifications automatiques
- surveillance des examens
- organisation d'evenements
- rapports institutionnels avances
- indicateurs plus pousses

## 5. Ce que votre backlog couvre deja
Le backlog actuel couvre bien les points prioritaires suivants :
- login / logout
- creation de comptes
- roles
- declaration des enseignements
- encadrement / jurys
- soumission
- validation / rejet
- rapport annuel PDF
- rapport departemental
- export Excel
- dashboard

## 6. Ce qu'il manque encore pour etre aligne a 100%
- gestion du profil academique
- validation finale par administration
- demande de correction
- role super administrateur
- historique complet des decisions
- responsabilites academiques detaillees
- surveillance des examens
- organisation d'evenements
- types de rapports promotion / prime / institution

## 7. Etapes du projet
### Etape 1 - Cadrage final
Livrable :
- version finale du backlog
- liste finale des modules
- definition du MVP

### Etape 2 - UML
Livrable :
- diagramme de cas d'utilisation
- diagramme de classes
- diagrammes de sequence

### Etape 3 - Base de donnees
Livrable :
- MCD / schema relationnel
- tables principales
- relations et contraintes

### Etape 4 - Backend
Livrable :
- projet Spring Boot
- authentification JWT
- API REST
- logique de validation
- calculs automatiques

### Etape 5 - Frontend
Livrable :
- projet Angular
- ecrans de connexion
- formulaires de declaration
- pages de validation
- dashboard

### Etape 6 - Rapports
Livrable :
- generation PDF
- export Excel
- rapport individuel
- rapport departemental

### Etape 7 - Tests
Livrable :
- tests fonctionnels
- verification des calculs
- verification du workflow

### Etape 8 - Documentation et soutenance
Livrable :
- documentation technique
- manuel utilisateur
- slides de soutenance
- demonstration

## 8. Ordre intelligent de developpement
1. Authentification et roles
2. Gestion des utilisateurs
3. Declaration des enseignements
4. Encadrement et jurys
5. Recherche scientifique
6. Workflow de validation
7. Rapports
8. Dashboard

## 9. Entites principales a prevoir
- User
- Department
- Activity
- TeachingActivity
- SupervisionActivity
- ResearchActivity
- ExamSupervision
- AcademicResponsibility
- EventOrganization
- ValidationHistory
- Report
- Notification

## 10. Prochaine etape
Commencer par finaliser :
- le backlog
- le diagramme de cas d'utilisation
- le diagramme de classes

Ensuite seulement, on passe a la base de donnees puis au code.
