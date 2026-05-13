# Guide backend etape 8 - Module recherche scientifique

## Objectif
Permettre a l'utilisateur connecte de :
- lister les activites de recherche
- voir une activite de recherche
- creer une activite de recherche
- modifier une activite de recherche
- supprimer une activite de recherche
- voir un petit resume des indicateurs de recherche

## Endpoints ajoutes
- `GET /api/research-activities`
- `GET /api/research-activities/summary`
- `GET /api/research-activities/{id}`
- `POST /api/research-activities`
- `PUT /api/research-activities/{id}`
- `DELETE /api/research-activities/{id}`

## Regles
- un enseignant voit ses propres activites de recherche
- un chef de departement voit les activites de recherche de son departement
- l'administration et le super admin voient tout
- un enseignant ne modifie que ses activites en brouillon ou a corriger

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

## Test 2 - liste des activites de recherche

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/research-activities" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 3 - resume des indicateurs

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/research-activities/summary" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 4 - creer une activite de recherche

```powershell
$researchBody = @{
  publicationType = "ARTICLE"
  title = "Automatisation des workflows academiques"
  venueName = "International Journal of Academic Systems"
  publicationYear = 2026
  indexingName = "Scopus"
  doi = "10.5555/pfe.2026.002"
  academicYear = "2025-2026"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/research-activities" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $researchBody
```

## Test 5 - voir le detail

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/research-activities/3" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 6 - modifier une activite de recherche
Remplacez `6` par l'id cree si besoin.

```powershell
$updateBody = @{
  publicationType = "ARTICLE"
  title = "Automatisation intelligente des workflows academiques"
  venueName = "International Journal of Academic Systems"
  publicationYear = 2026
  indexingName = "Scopus"
  doi = "10.5555/pfe.2026.002"
  academicYear = "2025-2026"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:8081/api/research-activities/6" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $updateBody
```

## Test 7 - suppression

```powershell
Invoke-RestMethod -Method Delete `
  -Uri "http://localhost:8081/api/research-activities/6" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Suite logique
Apres ce module :
- rapports PDF et Excel
- dashboard et indicateurs globaux
