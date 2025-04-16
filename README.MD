# 🌿 EcoRide

EcoRide est une application web de covoiturage écologique développée dans le cadre d’un projet de fin d’étude. Ce projet fullstack vise à mettre en œuvre une application complète, de la maquette au déploiement, en validant des compétences en front-end, back-end, base de données, gestion de projet, sécurité et déploiement.

## 📑 Table des matières

- [🎓 Contexte du projet](#-contexte-du-projet)
- [🌍 Présentation d’EcoRide](#-présentation-decoride)
- [🗂️ User Stories complètes](#️-user-stories-complètes)
- [⚙️ Stack technique](#-stack-technique)
- [🖥️ Environnement de développement local (simurghserver)](#️-environnement-de-développement-local-simurghserver)
- [📦 Structure Git](#-structure-git)
- [🚀 Guide de déploiement local](#-guide-de-déploiement-local)
- [📁 Livrables attendus](#-livrables-attendus)

## 🎓 Contexte du projet

Ce projet est développé dans le cadre de la certification Graduate Développeur Fullstack chez Studi.  
Il permet de valider deux grands types d’activités :

### Activité – Type 1 : Front-End
- Installer et configurer son environnement de travail
- Maquetter des interfaces utilisateur
- Réaliser des interfaces statiques
- Développer des interfaces dynamiques

### Activité – Type 2 : Back-End
- Mise en place de bases SQL & NoSQL
- Développement des composants métiers côté serveur
- Documentation du déploiement

## 🌍 Présentation d’EcoRide

La startup EcoRide souhaite devenir la référence en covoiturage écologique.  
L'application doit permettre de réserver ou proposer un covoiturage en voiture, avec une attention particulière à la réduction d’empreinte carbone.  
José, directeur technique de l’entreprise, souhaite une application web aux couleurs de l’écologie. Seuls les trajets en voiture sont autorisés.

## 🗂️ User Stories complètes

### US 1 : Page d’accueil  
**Visiteur**  
- Présentation de l’entreprise + images  
- Barre de recherche d’itinéraire  
- Footer avec email + lien vers mentions légales

### US 2 : Menu de l’application  
**Visiteur**  
- Accès rapide : page d’accueil, covoiturages, connexion, contact

### US 3 : Vue des covoiturages  
**Visiteur**  
- Recherche par ville + date  
- Affiche les trajets disponibles : pseudo, photo, note, prix, horaires, nombre de places restantes  
- Mentionne si le voyage est écologique (voiture électrique)  
- Si aucun trajet : suggérer date alternative  
- Bouton « détail » pour chaque trajet

### US 4 : Filtres des covoiturages  
**Visiteur**  
- Filtres : type de véhicule (électrique), prix max, durée max, note minimale

### US 5 : Vue détaillée d’un covoiturage  
**Visiteur, Utilisateur**  
- Affiche tous les détails du trajet sélectionné  
- Infos véhicule, préférences conducteur, avis utilisateurs

### US 6 : Participer à un covoiturage  
**Visiteur, Utilisateur**  
- Si non connecté : rediriger vers login / création de compte  
- Si connecté : bouton « participer »  
- Double confirmation → retrait de crédits  
- Maj places restantes + historique utilisateur + enregistrement du trajet

### US 7 : Création de compte  
**Visiteur**  
- Saisie : pseudo, mail, mot de passe sécurisé  
- Compte crédité de 20 crédits à la création

### US 8 : Espace utilisateur  
**Utilisateur**  
- Choix du rôle : passager, chauffeur, les deux  
- Chauffeur : ajout véhicule(s), préférences (fumeur, animaux…), nombre de places  
- Passager : aucun champ requis spécifique

### US 9 : Saisir un voyage  
**Utilisateur**  
- Chauffeur : saisie départ/arrivée, sélection véhicule, prix  
- 2 crédits prélevés par la plateforme  
- Possibilité d’utiliser un véhicule existant ou d’en ajouter un nouveau

### US 10 : Historique des covoiturages  
**Utilisateur**  
- Visualisation des trajets passés  
- Possibilité d’annuler une réservation  
- Maj crédits et places disponibles  
- Si chauffeur annule → mail aux passagers

### US 11 : Démarrer et arrêter un covoiturage  
**Utilisateur**  
- Chauffeur : bouton « démarrer » puis « arrivée à destination »  
- Passagers notifiés par mail  
- Possibilité de valider / noter le trajet  
- Maj des crédits chauffeur après validation  
- Commentaire possible si trajet mal passé → remontée à un employé

### US 12 : Espace employé  
**Employé**  
- Valide ou rejette les avis utilisateurs  
- Accès aux trajets litigieux : noms, mails, résumé du trajet

### US 13 : Espace administrateur  
**Administrateur**  
- Création comptes employés  
- Accès aux statistiques : trajets/jour, crédits gagnés  
- Nombre total de crédits de la plateforme  
- Possibilité de suspendre comptes (utilisateurs / employés)

## ⚙️ Stack technique

- **Frontend** : HTML, CSS, JavaScript
- **Backend** : PHP avec PDO
- **Base SQL** : MariaDB
- **Base NoSQL** : MongoDB
- **Déploiement** : Heroku
- **Autres** : Apache2, Nginx, PM2, Mongo Express, phpMyAdmin, GitHub, VS Code

## 🖥️ Environnement de développement local (simurghserver)

### Informations générales

- Serveur local : HP EliteDesk 800 G1 USDT
- OS : Ubuntu Server 24.04.2 LTS
- IP locale : 192.168.1.112
- DNS local : `dev.local`, `api.local`, `mongo.local`
- Accès SSH : alias `serveur` depuis le Mac

### Répertoires montés automatiquement sur macOS

- `/srv/samba/NAS` → `~/NAS`
- `/srv/dev` → `~/dev`

### Script de montage automatique

- `~/scripts/mount-all.sh`
- Automatisé via `launchd`
- Alias : `monter`, raccourci Automator : “Monter Dev”

### Services installés

- Apache2 (port 8080)
- PHP 8.3 + phpMyAdmin
- MariaDB 10.11
- MongoDB 7.0
- Mongo Express (via PM2) → accessible via `mongo.local`
- Node.js + PM2
- NGINX pour reverse proxy

### Exemple de configuration réseau (Nginx ⇨ Apache)

```nginx
server {
    listen 80;
    server_name dev.local;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📦 Structure Git

- `main` : branche principale (stable)
- `develop` : branche de développement continue
- `feature/*` : une branche par fonctionnalité
- Processus : merge `feature` → `develop`, puis `develop` → `main`

## 🚀 Guide de déploiement local

### Prérequis

- Serveur Linux (ou poste local avec Apache/PHP/MariaDB/MongoDB)
- PHP 8.3 avec les extensions nécessaires (PDO, etc.)
- Apache2 ou NGINX
- MariaDB
- MongoDB
- Node.js (pour Mongo Express ou outils complémentaires)
- Git
- Navigateur moderne
- Éditeur de code (recommandé : VS Code)

---

### Étapes de déploiement local

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/<ton-utilisateur>/ecoride.git
   cd ecoride
   ```

2. **Configurer les fichiers**
   - Copier `.env.example` en `.env` si disponible
   - Adapter les paramètres de connexion à MariaDB et MongoDB

3. **Créer les bases de données**
   - Importer les fichiers SQL depuis le dossier `/database` dans phpMyAdmin ou via terminal :
     ```bash
     mysql -u root -p < database/schema.sql
     ```

4. **Configurer Apache ou NGINX**
   - Créer un VirtualHost pour `dev.local` pointant vers `/var/www/html/ecoride/public`
   - Exemple de bloc disponible dans ce README (section serveur local)

5. **Lancer le serveur Mongo Express (si utilisé)**
   ```bash
   pm2 start mongo-express --env production
   ```

6. **Accéder à l’application**
   - Frontend : http://dev.local/
   - Mongo Express : http://mongo.local/
   - phpMyAdmin : http://dev.local/phpmyadmin/

---

### ⚠️ Remarques

- Il est recommandé de forcer l’usage de HTTPS en production
- Modifier les permissions si nécessaire :
  ```bash
  sudo chown -R www-data:www-data /var/www/html/ecoride
  ```

- Vérifier les erreurs Apache dans :
  ```
  /var/log/apache2/dev_error.log
  ```

## 📁 Livrables attendus

- Lien GitHub public avec structure propre
- Application déployée (Heroku ou local)
- Script SQL de création + données
- Manuel utilisateur PDF
- Charte graphique PDF
- Maquettes (3 desktop + 3 mobile)
- Documentations technique & projet
- Kanban (Trello, Notion, etc.)
