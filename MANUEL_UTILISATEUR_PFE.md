# Manuel Utilisateur PFE

## 1. Presentation

Cette application permet aux utilisateurs academiques de :

- declarer leurs activites
- suivre les validations
- consulter les statistiques
- generer des rapports

## 2. Connexion

### Etapes

1. Ouvrir l application Angular.
2. Saisir l email.
3. Saisir le mot de passe.
4. Cliquer sur `Se connecter`.

Comptes de test :

- `admin@esprit.tn / 123456`
- `chef.info@esprit.tn / 123456`
- `enseignant@esprit.tn / 123456`

## 3. Dashboard

La page `Dashboard` permet de voir :

- heures prevues et realisees
- nombre d encadrements
- activites de recherche
- etat des validations
- statistiques globales selon le role

## 4. Gestion des utilisateurs

Cette page est surtout destinee a l administration et au super administrateur.

Elle permet de :

- consulter les utilisateurs
- creer un utilisateur
- supprimer un utilisateur

### Ajouter un utilisateur

1. Ouvrir `Utilisateurs`
2. Remplir le formulaire
3. Choisir le role
4. Choisir le departement si besoin
5. Cliquer sur `Creer l utilisateur`

## 5. Enseignements

Cette page permet de :

- ajouter un enseignement
- consulter les cours declares
- soumettre un cours au workflow

### Ajouter un enseignement

1. Ouvrir `Enseignements`
2. Remplir les champs
3. Cliquer sur `Ajouter le cours`

### Soumettre un enseignement

1. Dans la liste, trouver le cours
2. Cliquer sur `Soumettre`

## 6. Encadrements

La page `Encadrements` permet de :

- ajouter un PFE, stage, memoire ou these
- consulter la liste des encadrements
- voir les indicateurs principaux

### Ajouter un encadrement

1. Ouvrir `Encadrements`
2. Saisir les informations de l etudiant
3. Choisir le type et le role dans le jury
4. Cliquer sur `Ajouter l encadrement`

## 7. Recherche

La page `Recherche` permet de :

- declarer une publication
- consulter les recherches enregistrees
- voir un resume des indicateurs

### Ajouter une publication

1. Ouvrir `Recherche`
2. Remplir le titre, la revue et l annee
3. Ajouter l indexation ou le DOI si disponible
4. Cliquer sur `Ajouter la recherche`

## 8. Rapports

La page `Rapports` permet de :

- generer un rapport PDF
- generer un rapport Excel
- consulter l historique des rapports
- telecharger un rapport genere

### Generer un rapport

1. Ouvrir `Rapports`
2. Saisir la periode academique
3. Cliquer sur `Generer PDF` ou `Generer Excel`

## 9. Workflow

La page `Workflow` permet de :

- voir les enseignements soumis
- valider ou rejeter une activite
- demander une correction
- consulter l historique complet des decisions

### Validation departementale

1. Ouvrir `Workflow`
2. Aller dans la section `Chef de departement`
3. Cliquer sur `Valider`, `A corriger` ou `Rejeter`
4. Ajouter un commentaire si besoin

### Validation finale

1. Ouvrir `Workflow`
2. Aller dans la section `Administration`
3. Cliquer sur l action souhaitee

### Voir l historique

1. Ouvrir `Workflow`
2. Cliquer sur `Voir historique`
3. Lire les etapes affichees dans le panneau de droite

## 10. Deconnexion

Pour quitter l application :

1. Cliquer sur `Se deconnecter` dans le menu lateral

## 11. Conseils d utilisation

- toujours verifier que le backend tourne avant d ouvrir Angular
- utiliser `2025-2026` comme periode de test
- ne pas fermer le terminal backend pendant les tests
- actualiser la page apres une grosse modification si necessaire
