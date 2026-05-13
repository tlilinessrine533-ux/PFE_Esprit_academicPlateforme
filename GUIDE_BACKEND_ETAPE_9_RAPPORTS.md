# Guide backend etape 9 - Rapports PDF et Excel

## Objectif
Generer un rapport individuel annuel a partir des donnees de :
- enseignement
- encadrement
- recherche

Formats disponibles :
- PDF
- Excel

## Endpoints ajoutes
- `GET /api/reports`
- `POST /api/reports/individual/pdf?periodLabel=2025-2026`
- `POST /api/reports/individual/excel?periodLabel=2025-2026`
- `GET /api/reports/{id}/download`

## Ce que fait la generation
- calcule les indicateurs de l'utilisateur connecte
- recupere ses activites de l'annee universitaire demandee
- genere un fichier PDF ou Excel
- sauvegarde le fichier dans le dossier `generated-reports`
- enregistre une trace dans la table `reports`

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

## Test 2 - generer le PDF

```powershell
Invoke-WebRequest -Method Post `
  -Uri "http://localhost:8081/api/reports/individual/pdf?periodLabel=2025-2026" `
  -Headers @{ Authorization = "Bearer $token" } `
  -OutFile "C:\Users\Asus\Desktop\rapport_individuel_2025_2026.pdf"
```

## Test 3 - generer le fichier Excel

```powershell
Invoke-WebRequest -Method Post `
  -Uri "http://localhost:8081/api/reports/individual/excel?periodLabel=2025-2026" `
  -Headers @{ Authorization = "Bearer $token" } `
  -OutFile "C:\Users\Asus\Desktop\rapport_individuel_2025_2026.xlsx"
```

## Test 4 - voir l'historique

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:8081/api/reports" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Test 5 - telecharger un rapport deja enregistre
Remplacez `1` par l'id renvoye dans l'historique.

```powershell
Invoke-WebRequest -Method Get `
  -Uri "http://localhost:8081/api/reports/1/download" `
  -Headers @{ Authorization = "Bearer $token" } `
  -OutFile "C:\Users\Asus\Desktop\rapport_retelecharge.pdf"
```

## Resultat attendu
Apres les tests, vous devez avoir :
- un fichier PDF sur le Bureau
- un fichier Excel sur le Bureau
- des lignes dans la table `reports`
- des fichiers enregistres aussi dans le dossier backend `generated-reports`

## Suite logique
Apres cette etape :
- dashboard global
- statistiques institutionnelles
- frontend Angular
