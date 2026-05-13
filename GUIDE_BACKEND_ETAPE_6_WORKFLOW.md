# Guide backend etape 6 - Workflow de validation

## Objectif
Ajouter un vrai workflow sur les enseignements :
- soumission par l'enseignant
- validation departementale
- validation finale
- rejet
- demande de correction
- historique des decisions

## Endpoints ajoutes
- `POST /api/teaching-activities/{id}/submit`
- `GET /api/teaching-activities/pending/department`
- `POST /api/teaching-activities/{id}/department-review`
- `GET /api/teaching-activities/pending/final`
- `POST /api/teaching-activities/{id}/final-review`
- `GET /api/teaching-activities/{id}/validation-history`

## Regles metier
- un enseignant peut soumettre son propre enseignement
- un enseignant ne modifie plus un enseignement deja soumis
- le chef de departement voit les enseignements de son departement
- le chef de departement traite les enseignements en statut `SOUMISE`
- l'administration traite les enseignements en statut `VALIDEE_DEPARTEMENT`

## Test 1 - Enseignant : soumettre

### Connexion enseignant

```powershell
$teacherBody = @{
  email = "enseignant@esprit.tn"
  password = "123456"
} | ConvertTo-Json

$teacherLogin = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $teacherBody

$teacherToken = $teacherLogin.token
```

### Soumission
Remplacez `6` par l'id de votre enseignement si besoin.

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/teaching-activities/6/submit" `
  -Headers @{ Authorization = "Bearer $teacherToken" }
```

## Test 2 - Chef de departement : voir les demandes en attente

```powershell
$chefBody = @{
  email = "chef.info@esprit.tn"
  password = "123456"
} | ConvertTo-Json

$chefLogin = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $chefBody

$chefToken = $chefLogin.token

Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/teaching-activities/pending/department" `
  -Headers @{ Authorization = "Bearer $chefToken" }
```

## Test 3 - Chef de departement : valider, rejeter ou demander correction

### Validation departementale

```powershell
$departmentReviewBody = @{
  decision = "VALIDE"
  commentText = "Cours conforme et valide"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/teaching-activities/6/department-review" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $chefToken" } `
  -Body $departmentReviewBody
```

### Demande de correction

```powershell
$departmentCorrectionBody = @{
  decision = "A_CORRIGER"
  commentText = "Merci de corriger le nombre d'heures"
} | ConvertTo-Json
```

### Rejet

```powershell
$departmentRejectBody = @{
  decision = "REJETE"
  commentText = "Cette declaration n'est pas conforme"
} | ConvertTo-Json
```

## Test 4 - Administration : liste finale a traiter

```powershell
$adminBody = @{
  email = "admin@esprit.tn"
  password = "123456"
} | ConvertTo-Json

$adminLogin = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $adminBody

$adminToken = $adminLogin.token

Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/teaching-activities/pending/final" `
  -Headers @{ Authorization = "Bearer $adminToken" }
```

## Test 5 - Administration : validation finale

```powershell
$finalReviewBody = @{
  decision = "VALIDE"
  commentText = "Validation finale confirmee"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/teaching-activities/6/final-review" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $adminToken" } `
  -Body $finalReviewBody
```

## Test 6 - Historique

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/teaching-activities/6/validation-history" `
  -Headers @{ Authorization = "Bearer $adminToken" }
```

## Suite logique
Apres validation de ce workflow :
- module encadrement
- module recherche
- generation des rapports
