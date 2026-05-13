# Backend Spring Boot

## Ce dossier contient
- un projet Spring Boot de depart
- la connexion vers MySQL
- un endpoint simple pour tester que le backend demarre

## Fichiers importants
- `pom.xml`
- `src/main/resources/application.properties`
- `src/main/java/com/esprit/academicplatform/AcademicPlatformApplication.java`
- `src/main/java/com/esprit/academicplatform/health/HealthController.java`
- `.mail.env.example`
- `start-dev.ps1`

## Avant de lancer
Assurez-vous que :
- XAMPP est ouvert
- MySQL est demarre
- la base `pfe_academic_platform` existe deja dans phpMyAdmin

## Configuration locale securisee
Les informations sensibles ne doivent pas etre gardees dans le code.

1. Copiez `.mail.env.example` vers `.mail.env`
2. Renseignez dans `.mail.env` vos secrets locaux :
- `APP_JWT_SECRET`
- `SPRING_DATASOURCE_PASSWORD` si necessaire
- les parametres SMTP
- les destinataires du workflow
 - les variables `APP_PASSKEY_*` si le frontend n'est pas servi depuis `http://localhost:4200`
3. Gardez `.mail.env` prive sur votre machine

## Face ID / biometrie
La connexion biometrie est basee sur WebAuthn/passkey.

- en local, `http://localhost:4200` fonctionne directement
- si vous changez de domaine ou de port, mettez a jour `APP_PASSKEY_RP_ID` et `APP_PASSKEY_ORIGIN`
- pour la connexion biometrie, l'utilisateur active d'abord Face ID / biometrie depuis son profil

## Reconnaissance faciale par camera
Une connexion faciale par camera est aussi disponible en option.

- les modeles sont servis localement depuis `frontend/public/models`
- chaque compte doit d'abord enregistrer un visage de reference depuis le profil
- le seuil de comparaison se regle avec `APP_FACE_RECOGNITION_MATCH_THRESHOLD`

## Commande de lancement
Depuis le dossier `backend`, utilisez de preference :

```powershell
.\start-dev.ps1
```

Cette commande charge automatiquement les variables de `.mail.env`.

Sinon, avec votre Maven installe :

```text
c:\Users\Asus\Desktop\NV PFE\backend
```

## URL de test
Quand le projet demarre, ouvrez :

```text
http://localhost:8080/api/health
```

Vous devez voir un JSON avec :
- `status`
- `message`

## Prochaine etape
Apres verification du lancement :
- creer l'entite `User`
- creer l'entite `Department`
- creer l'entite `Activity`
- creer les repositories
- creer le premier module `auth`
