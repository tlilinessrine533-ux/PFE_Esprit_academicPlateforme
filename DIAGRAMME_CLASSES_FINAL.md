# Diagramme de classes final

## Objectif
Cette version corrigee du diagramme de classes est plus propre, plus realiste et plus facile a defendre devant l'encadrant.

Elle respecte :
- votre cahier des charges
- les remarques deja identifiees dans la revue UML
- une logique simple pour le futur developpement backend

## 1. Idee generale
Le systeme tourne autour de 4 blocs principaux :
- les utilisateurs
- les activites academiques
- l'historique de validation
- les rapports

L'idee la plus importante est :
- un utilisateur cree plusieurs activites
- chaque activite appartient a un seul utilisateur
- une activite peut passer par plusieurs decisions de validation
- un rapport est genere pour un utilisateur ou pour un contexte administratif

## 2. Classes principales

### Department
Represente un departement academique.

Attributs :
- id : Long
- nom : String

### User
Represente un utilisateur de la plateforme.

Attributs :
- id : Long
- nom : String
- prenom : String
- email : String
- passwordHash : String
- role : RoleEnum

Remarque :
- `role` peut prendre des valeurs comme `ENSEIGNANT`, `CHEF_DEPARTEMENT`, `ADMINISTRATION`, `SUPER_ADMIN`

### Activite
Classe abstraite qui regroupe les informations communes a toutes les activites.

Attributs :
- id : Long
- dateCreation : Date
- statut : StatutActivite
- anneeUniversitaire : String

Remarque :
- cette classe ne se cree pas directement
- elle sert de base aux autres types d'activites

## 3. Sous-classes de Activite

### Enseignement
Attributs :
- formation : String
- classe : String
- module : String
- semestre : String
- langue : String
- typeEnseignement : String
- heuresPrevues : double
- heuresRealisees : double
- syllabus : String

### Encadrement
Attributs :
- typeEncadrement : String
- etudiant : String
- filiere : String
- titreSujet : String
- statutEncadrement : String
- roleJury : String

### Recherche
Attributs :
- typePublication : String
- titre : String
- revueOuConference : String
- anneePublication : int
- indexation : String
- doi : String

### Evenement
Attributs :
- typeEvenement : String
- titre : String
- dateEvenement : Date
- roleOrganisation : String

### Surveillance
Attributs :
- session : String
- semestre : String
- heures : int

### Responsabilite
Attributs :
- typeResponsabilite : String
- dateDebut : Date
- dateFin : Date

## 4. Workflow et reporting

### ValidationHistory
Cette classe garde la trace de chaque decision dans le workflow.

Attributs :
- id : Long
- dateDecision : Date
- decision : DecisionValidation
- commentaire : String
- niveauValidation : String

Exemples de decision :
- `SOUMIS`
- `VALIDE`
- `REJETE`
- `A_CORRIGER`

### Rapport
Represente un rapport genere par le systeme.

Attributs :
- id : Long
- typeRapport : String
- format : FormatRapport
- dateGeneration : Date
- fichier : String
- periode : String

## 5. Enumerations conseillees

### RoleEnum
- ENSEIGNANT
- CHEF_DEPARTEMENT
- ADMINISTRATION
- SUPER_ADMIN

### StatutActivite
- BROUILLON
- SOUMISE
- VALIDEE_DEPARTEMENT
- VALIDEE_FINALE
- REJETEE
- A_CORRIGER

### FormatRapport
- PDF
- EXCEL

### DecisionValidation
- SOUMIS
- VALIDE
- REJETE
- A_CORRIGER

## 6. Relations entre les classes

### Department et User
- un departement contient plusieurs utilisateurs
- un utilisateur appartient a un seul departement

Relation :
- `Department 1 ---- * User`

### User et Activite
- un utilisateur peut creer plusieurs activites
- une activite appartient a un seul utilisateur

Relation :
- `User 1 ---- * Activite`

### Activite et ValidationHistory
- une activite peut avoir plusieurs decisions de validation
- chaque ligne d'historique appartient a une seule activite

Relation :
- `Activite 1 ---- * ValidationHistory`

### User et ValidationHistory
- une decision de validation est prise par un utilisateur
- un utilisateur peut prendre plusieurs decisions

Relation :
- `User 1 ---- * ValidationHistory`

### User et Rapport
- un utilisateur peut generer plusieurs rapports
- un rapport est associe a un utilisateur createur ou proprietaire

Relation :
- `User 1 ---- * Rapport`

## 7. Ce qu'il faut retirer de votre ancienne version
Pour garder un diagramme metier propre, retirez de la version principale :
- `TableauBord`
- `Performance`
- `Prime`
- `Role` comme classe separee

Pourquoi :
- `TableauBord` est plutot une vue
- `Performance` est un calcul derive
- `Prime` peut etre un resultat calcule
- `Role` peut etre gere plus simplement avec un `Enum`

## 8. Version simple a dessiner
Si vous voulez une version propre dans Draw.io ou StarUML, dessinez seulement :
- Department
- User
- Activite
- Enseignement
- Encadrement
- Recherche
- Evenement
- Surveillance
- Responsabilite
- ValidationHistory
- Rapport

Puis :
- mettez l'heritage entre `Activite` et ses sous-classes
- ajoutez les relations avec les multiplicites

## 9. Conseils pour bien presenter
- ecrivez `Activite` en classe abstraite
- utilisez des `Enum` pour les statuts et les roles
- ne surchargez pas le diagramme avec des classes de calcul ou d'affichage
- gardez le diagramme centre sur les donnees metier

## 10. Conclusion
Cette version est meilleure parce qu'elle :
- respecte mieux les regles UML
- prepare bien la base de donnees
- facilite le developpement du backend
- correspond a un vrai workflow de validation

## 11. Suite
La prochaine etape logique apres ce diagramme est :
- faire le schema de base de donnees
- puis commencer l'architecture backend
