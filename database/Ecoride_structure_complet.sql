
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ecoride DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ecoride;

-- Table utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table voitures
CREATE TABLE voitures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    marque VARCHAR(100),
    modele VARCHAR(100),
    immatriculation VARCHAR(50) UNIQUE,
    nb_places INT NOT NULL DEFAULT 4,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table trajets (covoiturages)
CREATE TABLE trajets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conducteur_id INT NOT NULL,
    lieu_depart VARCHAR(255),
    lieu_arrivee VARCHAR(255),
    date_depart DATETIME,
    prix DECIMAL(5,2),
    nb_places_disponibles INT,
    voiture_id INT,
    FOREIGN KEY (conducteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id) ON DELETE SET NULL
);

-- Table reservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    trajet_id INT NOT NULL,
    statut ENUM('en_attente', 'confirmé', 'annulé') DEFAULT 'en_attente',
    date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE
);
