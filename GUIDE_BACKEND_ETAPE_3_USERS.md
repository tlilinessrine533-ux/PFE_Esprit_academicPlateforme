# Guide backend etape 3

## Objectif
Tester le module de gestion des utilisateurs.

## Ce qui a ete ajoute
- `GET /api/departments`
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

## Important
Le mot de passe n'est plus renvoye dans les reponses API.

Il est encode cote backend avant enregistrement.

## Tests simples

### 1. Lister les departements
Ouvrez :

```text
http://localhost:8081/api/departments
```

### 2. Lister les utilisateurs
Ouvrez :

```text
http://localhost:8081/api/users
```

### 3. Voir un utilisateur
Ouvrez :

```text
http://localhost:8081/api/users/4
```

### 4. Creer un utilisateur
Dans Postman ou dans un client REST, envoyez :

```http
POST http://localhost:8081/api/users
Content-Type: application/json
```

```json
{
  "firstName": "Sami",
  "lastName": "Trabelsi",
  "email": "sami.trabelsi@esprit.tn",
  "password": "123456",
  "role": "ENSEIGNANT",
  "departmentId": 1,
  "isActive": true
}
```

### 5. Modifier un utilisateur

```http
PUT http://localhost:8081/api/users/4
Content-Type: application/json
```

```json
{
  "firstName": "Mohamed",
  "lastName": "Ali",
  "email": "enseignant@esprit.tn",
  "role": "ENSEIGNANT",
  "departmentId": 1,
  "isActive": true
}
```

### 6. Supprimer un utilisateur

```http
DELETE http://localhost:8081/api/users/5
```

## Suite logique
Apres validation de ce module :
- faire le module authentification JWT
- faire la gestion des enseignements
