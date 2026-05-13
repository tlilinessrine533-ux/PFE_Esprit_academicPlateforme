# Diagramme de cas d'utilisation final

## Objectif
Cette version est la version corrigee et simplifiee du diagramme de cas d'utilisation de la plateforme.

Elle est adaptee a votre cahier des charges et plus facile a dessiner dans Draw.io ou StarUML.

## 1. Acteurs

### Enseignant
L'enseignant peut :
- s'authentifier
- gerer son profil academique
- declarer un enseignement
- declarer un encadrement
- declarer une activite de recherche
- declarer une responsabilite academique
- declarer une surveillance d'examen
- declarer une organisation d'evenement
- modifier une activite
- supprimer une activite brouillon
- soumettre une activite
- consulter le statut de validation
- generer un rapport individuel
- exporter ses donnees en Excel
- consulter son tableau de bord

### Chef de departement
Le chef de departement peut :
- s'authentifier
- consulter les activites des enseignants
- valider une activite
- rejeter une activite
- demander une correction
- consulter l'historique des validations
- generer un rapport departemental
- consulter le tableau de bord departemental

### Administration
L'administration peut :
- s'authentifier
- gerer les utilisateurs
- effectuer la validation finale
- consulter l'historique des validations
- generer un rapport institutionnel
- exporter les donnees en Excel
- calculer les indicateurs de performance
- calculer la prime de performance
- consulter le tableau de bord global

### Super Administrateur
Le super administrateur peut :
- s'authentifier
- gerer les roles
- gerer les parametres systeme
- gerer les referentiels

## 2. Cas d'utilisation principaux a dessiner

### Pour l'enseignant
- S'authentifier
- Gerer profil academique
- Declarer enseignement
- Declarer encadrement
- Declarer activite recherche
- Declarer responsabilite academique
- Declarer surveillance examen
- Declarer organisation evenement
- Modifier activite
- Supprimer activite brouillon
- Soumettre activite
- Consulter statut validation
- Generer rapport individuel
- Exporter Excel
- Consulter tableau de bord personnel

### Pour le chef de departement
- S'authentifier
- Consulter activites enseignants
- Valider activite
- Rejeter activite
- Demander correction
- Consulter historique validations
- Generer rapport departemental
- Consulter tableau de bord departemental

### Pour l'administration
- S'authentifier
- Gerer utilisateurs
- Validation finale
- Consulter historique validations
- Generer rapport institutionnel
- Exporter Excel
- Calculer indicateurs de performance
- Calculer prime de performance
- Consulter tableau de bord global

### Pour le super administrateur
- S'authentifier
- Gerer roles
- Gerer parametres systeme
- Gerer referentiels

## 3. Relations importantes

### Include
Vous pouvez dessiner les relations suivantes :
- Generer rapport individuel <<include>> Calculer indicateurs de performance
- Generer rapport departemental <<include>> Calculer indicateurs de performance
- Generer rapport institutionnel <<include>> Calculer indicateurs de performance
- Calculer prime de performance <<include>> Calculer indicateurs de performance

### Remarque importante
Ne reliez pas tous les cas d'utilisation a `S'authentifier` avec `<<include>>`.

La bonne pratique ici est :
- relier directement chaque acteur au cas `S'authentifier`
- laisser les autres cas sans fleches `include` vers l'authentification

## 4. Version simple a dessiner

### Etape 1
Dessinez le rectangle du systeme :
- Plateforme de suivi des activites academiques

### Etape 2
Dessinez les 4 acteurs a gauche :
- Enseignant
- Chef de departement
- Administration
- Super Administrateur

### Etape 3
Placez au centre les cas d'utilisation de l'enseignant :
- S'authentifier
- Gerer profil academique
- Declarer enseignement
- Declarer encadrement
- Declarer activite recherche
- Declarer responsabilite academique
- Declarer surveillance examen
- Declarer organisation evenement
- Modifier activite
- Supprimer activite brouillon
- Soumettre activite
- Consulter statut validation
- Generer rapport individuel
- Exporter Excel
- Consulter tableau de bord personnel

### Etape 4
Ajoutez a droite ou en haut les cas du chef de departement :
- Consulter activites enseignants
- Valider activite
- Rejeter activite
- Demander correction
- Consulter historique validations
- Generer rapport departemental
- Consulter tableau de bord departemental

### Etape 5
Ajoutez les cas de l'administration :
- Gerer utilisateurs
- Validation finale
- Generer rapport institutionnel
- Calculer indicateurs de performance
- Calculer prime de performance
- Consulter tableau de bord global

### Etape 6
Ajoutez les cas du super administrateur :
- Gerer roles
- Gerer parametres systeme
- Gerer referentiels

## 5. Conseils pour que le diagramme soit propre
- utilisez des noms courts
- ne surchargez pas le schema avec trop de fleches
- gardez les cas d'utilisation metier, pas les details techniques
- si le schema devient trop grand, vous pouvez faire une version generale et une version detaillee

## 6. Conclusion
Cette version est plus propre que votre premier diagramme parce qu'elle :
- complete le workflow
- ajoute les fonctionnalites manquantes
- evite la surcharge autour de l'authentification
- separe mieux les responsabilites de chaque acteur

## 7. Suite
La prochaine etape sera le diagramme de classes final corrige.
