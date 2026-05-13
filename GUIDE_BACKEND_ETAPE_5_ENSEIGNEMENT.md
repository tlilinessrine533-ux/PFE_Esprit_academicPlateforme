# Guide backend etape 5 - Declaration des enseignements

## Objectif
Permettre a l'utilisateur connecte de :
- lister les enseignements
- voir un enseignement
- creer un enseignement
- modifier un enseignement
- supprimer un enseignement

## Endpoints ajoutes
- `GET /api/teaching-activities`
- `GET /api/teaching-activities/{id}`
- `POST /api/teaching-activities`
- `PUT /api/teaching-activities/{id}`
- `DELETE /api/teaching-activities/{id}`

## Regles importantes
- un enseignant voit ses propres enseignements
- chef de departement, administration et super admin peuvent voir tous les enseignements
- un enseignant modifie seulement ses propres enseignements
- administration et super admin peuvent tout modifier

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

## Test 2 - lister les enseignements

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/teaching-activities" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 3 - creer un enseignement

```powershell
$teachingBody = @{
  programName = "Licence Business Computing"
  className = "3A"
  moduleName = "Developpement Web"
  semester = "S2"
  teachingMode = "PRESENTIEL"
  language = "Francais"
  plannedHours = 30.00
  completedHours = 12.00
  academicYear = "2025-2026"
  syllabusPath = "syllabus_dev_web.pdf"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8081/api/teaching-activities" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $teachingBody
```

## Test 4 - voir un enseignement

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/teaching-activities/1" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 5 - modifier un enseignement

```powershell
$updateBody = @{
  programName = "Licence Business Computing"
  className = "3A"
  moduleName = "Developpement Web"
  semester = "S2"
  teachingMode = "PRESENTIEL"
  language = "Francais"
  plannedHours = 30.00
  completedHours = 18.00
  academicYear = "2025-2026"
  syllabusPath = "syllabus_dev_web_v2.pdf"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:8081/api/teaching-activities/6" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $updateBody
```

## Test 6 - supprimer un enseignement

```powershell
Invoke-RestMethod -Method Delete `
  -Uri "http://localhost:8081/api/teaching-activities/6" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Suite logique
Apres validation de ce module :
- soumission de l'activite
- validation chef de departement
- validation finale administration
