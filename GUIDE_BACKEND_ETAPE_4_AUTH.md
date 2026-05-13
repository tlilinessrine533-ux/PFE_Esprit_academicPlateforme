# Guide backend etape 4 - Authentification JWT

## Objectif
Ajouter un vrai login JWT au backend.

## Ce qui a ete ajoute
- `POST /api/auth/login`
- `GET /api/auth/me`
- protection des routes avec `JWT`
- configuration `Spring Security`

## Point important pour vos donnees de test
Au demarrage, les utilisateurs importes avec les anciens `temp_hash_*` sont automatiquement convertis en mot de passe de test :

```text
123456
```

Cela sert seulement pour le developpement local.

## Etapes de test

### 1. Redemarrer le backend

```powershell
& "C:\Maven\apache-maven-3.9.14\bin\mvn.cmd" spring-boot:run
```

### 2. Tester le login
Utilisez cette commande PowerShell :

```powershell
$body = @{
  email = "admin@esprit.tn"
  password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $body
```

### 3. Recuperer le token
La reponse contient :
- `token`
- `tokenType`
- `expiresIn`
- `user`

### 4. Tester l'utilisateur connecte

```powershell
$login = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $body

$token = $login.token

Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

### 5. Tester la liste des utilisateurs avec JWT

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/users" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Comptes de test
Vous pouvez utiliser par exemple :
- `admin@esprit.tn`
- `chef.info@esprit.tn`
- `enseignant@esprit.tn`

Mot de passe de test :

```text
123456
```

## Ce que vous obtenez maintenant
- backend connecte a MySQL
- CRUD utilisateurs
- authentification JWT
- routes protegees

## Suite logique
La prochaine etape est :
- module declaration des enseignements
- puis workflow de validation
