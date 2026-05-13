# Guide backend Spring Boot

## 1. Ce que j'ai prepare
Le projet backend est deja cree dans :
- `backend`

## 2. Votre objectif maintenant
Votre but est juste de lancer une premiere version du backend.

Ne cherchez pas encore a faire tout le projet.

L'objectif de cette etape est seulement :
- verifier que Spring Boot fonctionne
- verifier que la connexion a MySQL est correcte
- verifier qu'une route API repond

## 3. Ce que vous devez faire exactement

### Etape 1
Ouvrez le dossier :
- `c:\Users\Asus\Desktop\NV PFE\backend`

### Etape 2
Assurez-vous que `XAMPP` est lance et que `MySQL` fonctionne.

### Etape 3
Ouvrez un terminal dans le dossier `backend`.

### Etape 4
Tapez exactement cette commande :

```powershell
& 'C:\Maven\apache-maven-3.9.14\bin\mvn.cmd' spring-boot:run
```

### Etape 5
Attendez que le projet termine son demarrage.

Vous devez voir a la fin un message du genre :
- `Started AcademicPlatformApplication`

### Etape 6
Ouvrez dans votre navigateur :

```text
http://localhost:8080/api/health
```

### Etape 7
Si tout marche, vous devez voir une reponse proche de :

```json
{
  "status": "UP",
  "message": "Backend Spring Boot is running"
}
```

## 4. Si vous avez une erreur de connexion a la base
Ouvrez ce fichier :
- `backend/src/main/resources/application.properties`

Puis verifiez :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pfe_academic_platform?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

Si votre MySQL a un mot de passe, remplissez la ligne `password`.

## 5. Si vous avez une erreur Maven
Envoyez-moi :
- le message exact
- la derniere partie de l'erreur

## 6. Apres cette etape
Quand le backend demarre correctement, la suite sera :
1. creer les entites JPA
2. creer les repositories
3. creer les services
4. faire l'authentification
5. creer les premiers endpoints CRUD
