# Guide backend etape 10 - Dashboard et statistiques

## Objectif
Fournir des indicateurs JSON pour :
- tableau de bord personnel
- tableau de bord departemental
- tableau de bord global

## Endpoints ajoutes
- `GET /api/dashboard/personal?periodLabel=2025-2026`
- `GET /api/dashboard/department?periodLabel=2025-2026`
- `GET /api/dashboard/department?periodLabel=2025-2026&departmentId=1`
- `GET /api/dashboard/global?periodLabel=2025-2026`

## Ce que retourne le dashboard

### Personnel
- nombre d'enseignements
- heures prevues et realisees
- ecart horaire
- nombre d'encadrements
- nombre de PFE
- nombre de recherches
- nombre d'articles
- nombre de publications indexees
- nombre d'activites soumises / validees / rejetees
- nombre de rapports generes

### Departemental
- nombre d'utilisateurs
- nombre d'enseignants
- nombre d'enseignements
- total heures realisees
- nombre d'encadrements
- nombre de PFE
- nombre d'activites de recherche
- nombre d'activites soumises / validees / rejetees
- nombre de rapports generes

### Global
- nombre de departements
- nombre total d'utilisateurs
- nombre d'enseignants
- nombre d'enseignements
- total heures realisees
- nombre d'encadrements
- nombre de PFE
- nombre d'activites de recherche
- nombre d'activites soumises / validees / rejetees
- nombre de rapports generes

## Test 1 - Dashboard personnel

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

Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/dashboard/personal?periodLabel=2025-2026" `
  -Headers @{ Authorization = "Bearer $teacherToken" }
```

## Test 2 - Dashboard departemental
Le chef de departement peut utiliser son propre departement sans `departmentId`.

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
  -Uri "http://localhost:8081/api/dashboard/department?periodLabel=2025-2026" `
  -Headers @{ Authorization = "Bearer $chefToken" }
```

## Test 3 - Dashboard global

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
  -Uri "http://localhost:8081/api/dashboard/global?periodLabel=2025-2026" `
  -Headers @{ Authorization = "Bearer $adminToken" }
```

## Test 4 - Dashboard departemental via admin

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/dashboard/department?periodLabel=2025-2026&departmentId=1" `
  -Headers @{ Authorization = "Bearer $adminToken" }
```

## Suite logique
Apres cette etape, la suite naturelle est :
- frontend Angular
- ecrans login, dashboard, utilisateurs, enseignements
