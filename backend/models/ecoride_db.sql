-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mar. 20 mai 2025 à 12:24
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
-- Base de données : `ecoride`
--
CREATE DATABASE IF NOT EXISTS `ecoride` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ecoride`;

-- --------------------------------------------------------

--
-- Structure de la table `configuration`
--

DROP TABLE IF EXISTS `configuration`;
CREATE TABLE IF NOT EXISTS `configuration` (
  `id_configuration` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_configuration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `covoiturage`
--

DROP TABLE IF EXISTS `covoiturage`;
CREATE TABLE IF NOT EXISTS `covoiturage` (
  `covoiturage_id` int(11) NOT NULL AUTO_INCREMENT,
  `date_depart` date DEFAULT NULL,
  `heure_depart` time DEFAULT NULL,
  `lieu_depart` varchar(50) DEFAULT NULL,
  `date_arrivee` date DEFAULT NULL,
  `heure_arrivee` time DEFAULT NULL,
  `lieu_arrivee` varchar(50) DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `nb_places` int(11) DEFAULT NULL,
  `prix_personne` decimal(6,2) DEFAULT NULL,
  `fumeur` tinyint(1) DEFAULT 0,
  `animaux` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`covoiturage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `detient`
--

DROP TABLE IF EXISTS `detient`;
CREATE TABLE IF NOT EXISTS `detient` (
  `voiture_id` int(11) NOT NULL,
  `marque_id` int(11) NOT NULL,
  PRIMARY KEY (`voiture_id`),
  KEY `marque_id` (`marque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `dispose`
--

DROP TABLE IF EXISTS `dispose`;
CREATE TABLE IF NOT EXISTS `dispose` (
  `id_configuration` int(11) NOT NULL,
  `parametre_id` int(11) NOT NULL,
  PRIMARY KEY (`id_configuration`,`parametre_id`),
  KEY `parametre_id` (`parametre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `gere`
--

DROP TABLE IF EXISTS `gere`;
CREATE TABLE IF NOT EXISTS `gere` (
  `voiture_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  PRIMARY KEY (`voiture_id`),
  KEY `utilisateur_id` (`utilisateur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `marque`
--

DROP TABLE IF EXISTS `marque`;
CREATE TABLE IF NOT EXISTS `marque` (
  `marque_id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`marque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parametre`
--

DROP TABLE IF EXISTS `parametre`;
CREATE TABLE IF NOT EXISTS `parametre` (
  `parametre_id` int(11) NOT NULL AUTO_INCREMENT,
  `propriete` varchar(50) NOT NULL,
  `valeur` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`parametre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participe`
--

DROP TABLE IF EXISTS `participe`;
CREATE TABLE IF NOT EXISTS `participe` (
  `utilisateur_id` int(11) NOT NULL,
  `covoiturage_id` int(11) NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`covoiturage_id`),
  KEY `covoiturage_id` (`covoiturage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `possede`
--

DROP TABLE IF EXISTS `possede`;
CREATE TABLE IF NOT EXISTS `possede` (
  `utilisateur_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`role_id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `utilisateur_id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `adresse` varchar(50) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `photo` blob DEFAULT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `credit` int(11) DEFAULT 20,
  PRIMARY KEY (`utilisateur_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilise`
--

DROP TABLE IF EXISTS `utilise`;
CREATE TABLE IF NOT EXISTS `utilise` (
  `covoiturage_id` int(11) NOT NULL,
  `voiture_id` int(11) NOT NULL,
  PRIMARY KEY (`covoiturage_id`),
  KEY `voiture_id` (`voiture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `voiture`
--

DROP TABLE IF EXISTS `voiture`;
CREATE TABLE IF NOT EXISTS `voiture` (
  `voiture_id` int(11) NOT NULL AUTO_INCREMENT,
  `modele` varchar(50) DEFAULT NULL,
  `immatriculation` varchar(50) DEFAULT NULL,
  `energie` varchar(50) DEFAULT NULL,
  `couleur` varchar(50) DEFAULT NULL,
  `date_premiere_immatriculation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`voiture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `detient`
--
ALTER TABLE `detient`
  ADD CONSTRAINT `detient_ibfk_1` FOREIGN KEY (`voiture_id`) REFERENCES `voiture` (`voiture_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detient_ibfk_2` FOREIGN KEY (`marque_id`) REFERENCES `marque` (`marque_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `dispose`
--
ALTER TABLE `dispose`
  ADD CONSTRAINT `dispose_ibfk_1` FOREIGN KEY (`id_configuration`) REFERENCES `configuration` (`id_configuration`) ON DELETE CASCADE,
  ADD CONSTRAINT `dispose_ibfk_2` FOREIGN KEY (`parametre_id`) REFERENCES `parametre` (`parametre_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `gere`
--
ALTER TABLE `gere`
  ADD CONSTRAINT `gere_ibfk_1` FOREIGN KEY (`voiture_id`) REFERENCES `voiture` (`voiture_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gere_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`utilisateur_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `participe`
--
ALTER TABLE `participe`
  ADD CONSTRAINT `participe_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`utilisateur_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participe_ibfk_2` FOREIGN KEY (`covoiturage_id`) REFERENCES `covoiturage` (`covoiturage_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `possede`
--
ALTER TABLE `possede`
  ADD CONSTRAINT `possede_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`utilisateur_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `possede_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `utilise`
--
ALTER TABLE `utilise`
  ADD CONSTRAINT `utilise_ibfk_1` FOREIGN KEY (`covoiturage_id`) REFERENCES `covoiturage` (`covoiturage_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `utilise_ibfk_2` FOREIGN KEY (`voiture_id`) REFERENCES `voiture` (`voiture_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
