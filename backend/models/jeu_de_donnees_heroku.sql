-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mar. 20 mai 2025 à 12:28
-- Version du serveur : 10.11.11-MariaDB-0ubuntu0.24.04.2
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : ecoride
--

--
-- Déchargement des données de la table configuration
--

DELETE FROM configuration;
ALTER TABLE configuration AUTO_INCREMENT = 1;
INSERT INTO configuration (id_configuration) VALUES (1);

--
-- Déchargement des données de la table parametre
--

DELETE FROM parametre;
ALTER TABLE parametre AUTO_INCREMENT = 1;
INSERT INTO parametre (parametre_id, propriete, valeur) VALUES(1, 'site_name', 'EcoRide');
INSERT INTO parametre (parametre_id, propriete, valeur) VALUES(2, 'version', '1.0');
INSERT INTO parametre (parametre_id, propriete, valeur) VALUES(3, 'maintenance_mode', 'off');

--
-- Déchargement des données de la table dispose
--

DELETE FROM dispose;
INSERT INTO dispose (id_configuration, parametre_id) VALUES(1, 1);
INSERT INTO dispose (id_configuration, parametre_id) VALUES(1, 2);
INSERT INTO dispose (id_configuration, parametre_id) VALUES(1, 3);

--
-- Déchargement des données de la table role
--

DELETE FROM role;
ALTER TABLE role AUTO_INCREMENT = 1;
INSERT INTO role (libelle) VALUES('Conducteur');
INSERT INTO role (libelle) VALUES('Passager');
INSERT INTO role (libelle) VALUES('Administrateur');

--
-- Déchargement des données de la table utilisateur
--

DELETE FROM utilisateur;
ALTER TABLE utilisateur AUTO_INCREMENT = 1;
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Dupont', 'Jean', 'jean.dupont@example.com', 'motdepasse123', '0612345678', '12 rue des Lilas, Paris', '1985-06-15', NULL, 'jdupont', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Martin', 'Claire', 'claire.martin@example.com', 'azerty789', '0678123456', '34 avenue Victor Hugo, Lyon', '1990-11-22', NULL, 'cmartin', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Bernard', 'Paul', 'paul.bernard@example.com', 'paul1234', '0601020304', '5 rue des Fleurs, Marseille', '1982-02-10', NULL, 'pbernard', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Lemoine', 'Sophie', 'sophie.lemoine@example.com', 'sophie5678', '0611223344', '7 avenue des Champs, Lille', '1995-08-30', NULL, 'slemoine', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Moreau', 'Antoine', 'antoine.moreau@example.com', 'antoine91011', '0699887766', '9 boulevard Saint-Michel, Bordeaux', '1988-12-05', NULL, 'amoreau', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Dubois', 'Elise', 'elise.dubois@example.com', 'elise1213', '0655443322', '11 place de la République, Nantes', '1992-04-17', NULL, 'edubois', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Faure', 'Lucas', 'lucas.faure@example.com', 'lucas1415', '0644332211', '13 rue de la Paix, Strasbourg', '1987-07-21', NULL, 'lfaure', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Roux', 'Emma', 'emma.roux@example.com', 'emma1617', '0633221100', '15 avenue Victor Hugo, Toulouse', '1994-03-12', NULL, 'eroux', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Petit', 'Julien', 'julien.petit@example.com', 'julien1819', '0622110099', '17 rue Lafayette, Grenoble', '1989-09-09', NULL, 'jpetit', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Garnier', 'Chloe', 'chloe.garnier@example.com', 'chloe2021', '0611009988', '19 boulevard Haussmann, Nice', '1991-11-11', NULL, 'cgarnier', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Chevalier', 'Maxime', 'maxime.chevalier@example.com', 'maxime2223', '0600998877', '21 rue de Rivoli, Paris', '1986-05-23', NULL, 'mchevalier', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Leroy', 'Amelie', 'amelie.leroy@example.com', 'amelie2425', '0699887766', '23 avenue des Champs, Lyon', '1993-10-14', NULL, 'aleroy', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Michel', 'Nicolas', 'nicolas.michel@example.com', 'nicolas2627', '0688776655', '25 rue Saint-Honoré, Marseille', '1984-01-02', NULL, 'nmichel', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Blanc', 'Laura', 'laura.blanc@example.com', 'laura2829', '0677665544', '27 boulevard Voltaire, Lille', '1996-06-06', NULL, 'lblanc', 20);
INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, photo, pseudo, credit) VALUES('Fontaine', 'David', 'david.fontaine@example.com', 'david3031', '0666554433', '29 rue de la Paix, Bordeaux', '1983-03-03', NULL, 'dfontaine', 20);


--
-- Déchargement des données de la table preference_utilisateur
--

DELETE FROM preference_utilisateur;
INSERT INTO preference_utilisateur (utilisateur_id, immatriculation, marque, modele, couleur, energie, date_premiere_immatriculation, nb_places, fumeur, animaux)
VALUES (1, 'AA-111-AA', 'Peugeot', '208', 'Rouge', 'Essence', '2018-01-01', 3, TRUE, FALSE);

--
-- Déchargement des données de la table possede
--

DELETE FROM possede;
INSERT INTO possede (utilisateur_id, role_id) VALUES(1, 1);
INSERT INTO possede (utilisateur_id, role_id) VALUES(2, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(2, 3);
INSERT INTO possede (utilisateur_id, role_id) VALUES(3, 1);
INSERT INTO possede (utilisateur_id, role_id) VALUES(4, 1);
INSERT INTO possede (utilisateur_id, role_id) VALUES(5, 1);
INSERT INTO possede (utilisateur_id, role_id) VALUES(6, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(7, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(8, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(9, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(10, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(11, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(12, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(13, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(14, 2);
INSERT INTO possede (utilisateur_id, role_id) VALUES(15, 2);

--
-- Déchargement des données de la table marque
--

DELETE FROM marque;
ALTER TABLE marque AUTO_INCREMENT = 1;
INSERT INTO marque (libelle) VALUES('Peugeot');
INSERT INTO marque (libelle) VALUES('Renault');
INSERT INTO marque (libelle) VALUES('Citroën');
INSERT INTO marque (libelle) VALUES('Ford');
INSERT INTO marque (libelle) VALUES('Volkswagen');

--
-- Déchargement des données de la table voiture
--

DELETE FROM voiture;
ALTER TABLE voiture AUTO_INCREMENT = 1;
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation) VALUES('208', 'AB-123-CD', 'Essence', 'Rouge', '2018-03-10');
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation) VALUES('Zoe', 'XY-456-ZW', 'Électrique', 'Blanc', '2021-07-22');
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation) VALUES('C3', 'CD-789-EF', 'Diesel', 'Bleu', '2017-05-15');
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation) VALUES('Fiesta', 'EF-234-GH', 'Essence', 'Noir', '2019-09-10');
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation) VALUES('Golf', 'GH-567-IJ', 'Hybride', 'Gris', '2020-11-20');

--
-- Déchargement des données de la table detient
--

DELETE FROM detient;
INSERT INTO detient (voiture_id, marque_id) VALUES(1, 1);
INSERT INTO detient (voiture_id, marque_id) VALUES(2, 2);
INSERT INTO detient (voiture_id, marque_id) VALUES(3, 3);
INSERT INTO detient (voiture_id, marque_id) VALUES(4, 4);
INSERT INTO detient (voiture_id, marque_id) VALUES(5, 5);


--
-- Déchargement des données de la table gere
--

DELETE FROM gere;
INSERT INTO gere (voiture_id, utilisateur_id) VALUES(1, 1);
INSERT INTO gere (voiture_id, utilisateur_id) VALUES(2, 2);
INSERT INTO gere (voiture_id, utilisateur_id) VALUES(3, 3);
INSERT INTO gere (voiture_id, utilisateur_id) VALUES(4, 4);
INSERT INTO gere (voiture_id, utilisateur_id) VALUES(5, 5);

--
-- Déchargement des données de la table covoiturage
--

DELETE FROM covoiturage;
ALTER TABLE covoiturage AUTO_INCREMENT = 1;
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-01-15', '08:00:00', 'Paris', '2025-01-15', '12:00:00', 'Lyon', 'clos', 0, 15.00, 1, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-02-20', '14:00:00', 'Lyon', '2025-02-20', '18:00:00', 'Marseille', 'clos', 0, 20.00, 0, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-03-10', '09:00:00', 'Marseille', '2025-03-10', '13:00:00', 'Nice', 'clos', 0, 18.00, 1, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-01', '08:30:00', 'Paris', '2025-06-01', '12:00:00', 'Lyon', 'ouvert', 3, 15.00, 0, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-02', '14:00:00', 'Lyon', '2025-06-02', '18:00:00', 'Marseille', 'ouvert', 2, 20.00, 1, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-03', '09:00:00', 'Marseille', '2025-06-03', '13:00:00', 'Nice', 'ouvert', 4, 18.00, 0, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-04', '07:30:00', 'Lille', '2025-06-04', '11:30:00', 'Paris', 'ouvert', 3, 22.00, 1, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-05', '15:00:00', 'Bordeaux', '2025-06-05', '20:00:00', 'Toulouse', 'ouvert', 2, 17.00, 0, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-15', '10:00:00', 'Nice', '2025-06-15', '14:00:00', 'Marseille', 'ouvert', 3, 19.00, 1, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-20', '13:00:00', 'Lyon', '2025-06-20', '17:00:00', 'Geneva', 'ouvert', 4, 25.00, 0, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-06-25', '09:30:00', 'Paris', '2025-06-25', '13:30:00', 'Brussels', 'ouvert', 5, 30.00, 1, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-07-01', '08:00:00', 'Toulouse', '2025-07-01', '12:00:00', 'Bordeaux', 'ouvert', 2, 16.00, 0, 0);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-07-10', '15:00:00', 'Marseille', '2025-07-10', '19:00:00', 'Nice', 'ouvert', 3, 18.50, 1, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-07-15', '08:00:00', 'Nice', '2025-07-15', '12:00:00', 'Monaco', 'ouvert', 3, 12.00, 0, 1);
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_places, prix_personne, fumeur, animaux) VALUES('2025-08-01', '09:00:00', 'Paris', '2025-08-01', '13:00:00', 'Lyon', 'ouvert', 3, 16.00, 1, 1);

--
-- Déchargement des données de la table utilise
--

DELETE FROM utilise;
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(1, 1);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(6, 1);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(11, 1);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(7, 2);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(12, 2);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(14, 2);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(15, 2);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(3, 3);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(8, 3);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(13, 3);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(4, 4);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(9, 4);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(2, 5);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(5, 5);
INSERT INTO utilise (covoiturage_id, voiture_id) VALUES(10, 5);

--
-- Déchargement des données de la table participe
--

DELETE FROM participe;
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(1, 1);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(2, 2);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(3, 3);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(4, 4);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(5, 5);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(6, 1);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(6, 2);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(7, 3);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(8, 4);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(9, 5);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(10, 1);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(11, 2);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(12, 3);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(13, 4);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(14, 5);
INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES(15, 1);



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
