# Guide phpMyAdmin pour votre PFE

## 1. Point important
`phpMyAdmin` n'est pas une base de donnees.

`phpMyAdmin` est l'outil graphique qui permet de gerer une base `MySQL` ou `MariaDB`.

Donc pour votre PFE, le choix devient :
- Frontend : Angular
- Backend : Spring Boot
- Base de donnees : MySQL
- Outil de gestion : phpMyAdmin

## 2. Fichier SQL pret
Le schema complet est deja prepare ici :
- `schema-pfe-mysql.sql`

Ce fichier contient :
- la creation de la base
- les tables principales
- les cles primaires
- les cles etrangeres
- les types `ENUM`
- deux vues simples pour les indicateurs

## 3. Les tables principales du projet

### Tables de base
- `departments`
- `users`

### Table mere
- `activities`

### Tables filles des activites
- `teaching_activities`
- `supervision_activities`
- `research_activities`
- `event_activities`
- `exam_surveillance_activities`
- `responsibility_activities`

### Tables de workflow et reporting
- `validation_history`
- `reports`
- `notifications`

## 4. Pourquoi cette structure est bonne
- elle suit votre diagramme de classes
- elle separe bien chaque type d'activite
- elle gere le workflow de validation
- elle prepare la generation des rapports
- elle facilite le developpement avec Spring Boot

## 5. Etapes dans phpMyAdmin

### Etape 1
Demarrez votre serveur MySQL.

Si vous utilisez XAMPP :
- ouvrez XAMPP
- demarrez `Apache`
- demarrez `MySQL`

### Etape 2
Ouvrez `phpMyAdmin`.

En general :
- `http://localhost/phpmyadmin`

### Etape 3
Cliquez sur l'onglet `Import`.

### Etape 4
Selectionnez le fichier :
- `schema-pfe-mysql.sql`

### Etape 5
Cliquez sur `Executer`.

### Etape 6
Verifiez que la base `pfe_academic_platform` a ete creee avec les tables suivantes :
- departments
- users
- activities
- teaching_activities
- supervision_activities
- research_activities
- event_activities
- exam_surveillance_activities
- responsibility_activities
- validation_history
- reports
- notifications

## 6. Comment comprendre la logique

### Exemple 1 - un enseignement
Quand un enseignant declare un cours :
- une ligne est ajoutee dans `activities`
- une ligne detaillee est ajoutee dans `teaching_activities`

### Exemple 2 - un encadrement
Quand un enseignant declare un PFE :
- une ligne est ajoutee dans `activities`
- une ligne detaillee est ajoutee dans `supervision_activities`

### Exemple 3 - validation
Quand une activite est soumise ou validee :
- le statut change dans `activities`
- une trace est ajoutee dans `validation_history`

## 7. Les vues pour le dashboard
Le script cree aussi :
- `v_teacher_kpis`
- `v_department_kpis`

Ces vues serviront plus tard pour :
- le tableau de bord
- les statistiques
- les indicateurs de performance

## 8. Ce que je vous conseille maintenant
Pour ne pas vous perdre, faites dans cet ordre :
1. importer le script SQL dans phpMyAdmin
2. verifier que toutes les tables existent
3. me dire si l'import a reussi ou m'envoyer l'erreur
4. ensuite on prepare les donnees de test
5. puis on commence le backend Spring Boot

## 9. Suite logique
La prochaine etape apres l'import est :
- inserer quelques departements
- inserer un super administrateur
- inserer un enseignant de test
- inserer un chef de departement de test

Ensuite, on pourra relier cette base au backend.
