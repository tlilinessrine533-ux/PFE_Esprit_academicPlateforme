# Guide backend etape 7 - Module encadrement

## Objectif
Permettre a l'utilisateur connecte de :
- lister les encadrements
- voir un encadrement
- creer un encadrement
- modifier un encadrement
- supprimer un encadrement
- voir un petit resume des indicateurs

## Endpoints ajoutes
- `GET /api/supervision-activities`
- `GET /api/supervision-activities/summary`
- `GET /api/supervision-activities/{id}`
- `POST /api/supervision-activities`
- `PUT /api/supervision-activities/{id}`
- `DELETE /api/supervision-activities/{id}`

## Regles
- un enseignant voit ses propres encadrements
- un chef de departement voit les encadrements de son departement
- l'administration et le super admin voient tout
- un enseignant ne modifie que ses encadrements en brouillon ou a corriger

## Test 1 - connexion

```powershell
$body = @{
  email = "enseignant@esprit.tn"
  password = "123456"
} | ConvertTo-Json

$login = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body $body

$token = $login.token
```

## Test 2 - liste des encadrements

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/supervision-activities" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 3 - resume indicateurs

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/supervision-activities/summary" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 4 - creer un encadrement

```powershell
$supervisionBody = @{
  supervisionType = "PFE"
  studentName = "Amira Ben Ali"
  studentProgram = "Business Computing"
  subjectTitle = "Plateforme intelligente de reporting academique"
  supervisionStatus = "EN_COURS"
  roleInJury = "ENCADRANT"
  academicYear = "2025-2026"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/supervision-activities" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $supervisionBody
```

## Test 5 - voir le detail

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/supervision-activities/2" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 6 - modifier un encadrement
Remplacez `6` par l'id cree si besoin.

```powershell
$updateBody = @{
  supervisionType = "PFE"
  studentName = "Amira Ben Ali"
  studentProgram = "Business Computing"
  subjectTitle = "Plateforme intelligente de reporting academique"
  supervisionStatus = "SOUTENU"
  roleInJury = "ENCADRANT"
  academicYear = "2025-2026"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:8081/api/supervision-activities/6" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $updateBody
```

## Test 7 - suppression

```powershell
Invoke-RestMethod -Method Delete `
  -Uri "http://localhost:8081/api/supervision-activities/6" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Suite logique
Apres ce module :
- module recherche scientifique
- puis rapports PDF et Excel
