# Guide backend etape 2

## Objectif
Avoir les entites JPA de base du projet connectees a votre base MySQL.

## Ce qui a ete ajoute
- les enums metier
- l'entite `Department`
- l'entite `User`
- l'entite abstraite `Activity`
- les sous-types d'activite
- `ValidationHistory`
- `Report`
- `Notification`
- `UserRepository`
- un endpoint simple : `/api/users/count`

## URL de verification
Quand le backend redemarre, ouvrez :

```text
http://localhost:8080/api/users/count
```

Si tout va bien, vous devez voir :

```json
{"count":4}
```

## Pourquoi cette etape est importante
- elle relie votre code Java a vos tables MySQL
- elle prepare les prochains modules CRUD
- elle prepare l'authentification plus tard

## Prochaine etape
Apres verification :
- creer les DTO
- creer le module gestion des utilisateurs
- commencer le module authentification
