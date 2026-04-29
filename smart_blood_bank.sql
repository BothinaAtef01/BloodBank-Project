-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2026 at 02:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_blood_bank`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood_inventory`
--

CREATE TABLE `blood_inventory` (
  `inventory_id` int(11) NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `blood_type` varchar(5) DEFAULT NULL,
  `quantity_liters` decimal(10,2) DEFAULT 0.00,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blood_inventory`
--

INSERT INTO `blood_inventory` (`inventory_id`, `hospital_id`, `blood_type`, `quantity_liters`, `last_update`) VALUES
(1, 1, 'A+', 11.68, '2026-04-28 22:03:00'),
(2, 1, 'A-', 12.14, '2026-04-28 22:03:00'),
(3, 1, 'B+', 20.67, '2026-04-28 22:03:00'),
(4, 1, 'B-', 21.90, '2026-04-28 22:03:00'),
(5, 1, 'O+', 22.52, '2026-04-28 22:03:00'),
(6, 1, 'O-', 21.90, '2026-04-28 22:03:00'),
(7, 1, 'AB+', 16.92, '2026-04-28 22:03:00'),
(8, 1, 'AB-', 13.90, '2026-04-28 22:03:00'),
(9, 2, 'A+', 13.74, '2026-04-28 22:03:00'),
(10, 2, 'A-', 22.00, '2026-04-28 22:03:00'),
(11, 2, 'B+', 23.79, '2026-04-28 22:03:00'),
(12, 2, 'B-', 7.94, '2026-04-28 22:03:00'),
(13, 2, 'O+', 23.35, '2026-04-28 22:03:00'),
(14, 2, 'O-', 7.91, '2026-04-28 22:03:00'),
(15, 2, 'AB+', 24.50, '2026-04-28 22:03:00'),
(16, 2, 'AB-', 13.79, '2026-04-28 22:03:00'),
(17, 3, 'A+', 10.43, '2026-04-28 22:03:00'),
(18, 3, 'A-', 5.77, '2026-04-28 22:03:00'),
(19, 3, 'B+', 12.55, '2026-04-28 22:03:00'),
(20, 3, 'B-', 20.48, '2026-04-28 22:03:00'),
(21, 3, 'O+', 19.71, '2026-04-28 22:03:00'),
(22, 3, 'O-', 12.14, '2026-04-28 22:03:00'),
(23, 3, 'AB+', 16.55, '2026-04-28 22:03:00'),
(24, 3, 'AB-', 21.34, '2026-04-28 22:03:00'),
(25, 4, 'A+', 12.07, '2026-04-28 22:03:00'),
(26, 4, 'A-', 11.31, '2026-04-28 22:03:00'),
(27, 4, 'B+', 15.34, '2026-04-28 22:03:00'),
(28, 4, 'B-', 17.77, '2026-04-28 22:03:00'),
(29, 4, 'O+', 17.83, '2026-04-28 22:03:00'),
(30, 4, 'O-', 10.84, '2026-04-28 22:03:00'),
(31, 4, 'AB+', 15.71, '2026-04-28 22:03:00'),
(32, 4, 'AB-', 21.03, '2026-04-28 22:03:00'),
(33, 5, 'A+', 13.03, '2026-04-28 22:03:00'),
(34, 5, 'A-', 17.05, '2026-04-28 22:03:00'),
(35, 5, 'B+', 21.16, '2026-04-28 22:03:00'),
(36, 5, 'B-', 9.65, '2026-04-28 22:03:00'),
(37, 5, 'O+', 19.78, '2026-04-28 22:03:00'),
(38, 5, 'O-', 24.96, '2026-04-28 22:03:00'),
(39, 5, 'AB+', 20.47, '2026-04-28 22:03:00'),
(40, 5, 'AB-', 22.45, '2026-04-28 22:03:00'),
(41, 6, 'A+', 5.84, '2026-04-28 22:03:00'),
(42, 6, 'A-', 16.84, '2026-04-28 22:03:00'),
(43, 6, 'B+', 21.67, '2026-04-28 22:03:00'),
(44, 6, 'B-', 12.85, '2026-04-28 22:03:00'),
(45, 6, 'O+', 14.24, '2026-04-28 22:03:00'),
(46, 6, 'O-', 7.65, '2026-04-28 22:03:00'),
(47, 6, 'AB+', 10.53, '2026-04-28 22:03:00'),
(48, 6, 'AB-', 24.68, '2026-04-28 22:03:00'),
(49, 7, 'A+', 6.82, '2026-04-28 22:03:00'),
(50, 7, 'A-', 15.06, '2026-04-28 22:03:00'),
(51, 7, 'B+', 9.85, '2026-04-28 22:03:00'),
(52, 7, 'B-', 19.08, '2026-04-28 22:03:00'),
(53, 7, 'O+', 20.85, '2026-04-28 22:03:00'),
(54, 7, 'O-', 22.02, '2026-04-28 22:03:00'),
(55, 7, 'AB+', 22.52, '2026-04-28 22:03:00'),
(56, 7, 'AB-', 21.57, '2026-04-28 22:03:00'),
(57, 8, 'A+', 15.29, '2026-04-28 22:03:00'),
(58, 8, 'A-', 6.75, '2026-04-28 22:03:00'),
(59, 8, 'B+', 22.86, '2026-04-28 22:03:00'),
(60, 8, 'B-', 9.05, '2026-04-28 22:03:00'),
(61, 8, 'O+', 11.69, '2026-04-28 22:03:00'),
(62, 8, 'O-', 6.27, '2026-04-28 22:03:00'),
(63, 8, 'AB+', 11.29, '2026-04-28 22:03:00'),
(64, 8, 'AB-', 12.65, '2026-04-28 22:03:00'),
(65, 9, 'A+', 24.39, '2026-04-28 22:03:00'),
(66, 9, 'A-', 18.99, '2026-04-28 22:03:00'),
(67, 9, 'B+', 16.79, '2026-04-28 22:03:00'),
(68, 9, 'B-', 21.98, '2026-04-28 22:03:00'),
(69, 9, 'O+', 14.52, '2026-04-28 22:03:00'),
(70, 9, 'O-', 21.67, '2026-04-28 22:03:00'),
(71, 9, 'AB+', 19.77, '2026-04-28 22:03:00'),
(72, 9, 'AB-', 8.84, '2026-04-28 22:03:00'),
(73, 10, 'A+', 19.90, '2026-04-28 22:03:00'),
(74, 10, 'A-', 7.97, '2026-04-28 22:03:00'),
(75, 10, 'B+', 15.15, '2026-04-28 22:03:00'),
(76, 10, 'B-', 6.86, '2026-04-28 22:03:00'),
(77, 10, 'O+', 23.84, '2026-04-28 22:03:00'),
(78, 10, 'O-', 13.64, '2026-04-28 22:03:00'),
(79, 10, 'AB+', 11.66, '2026-04-28 22:03:00'),
(80, 10, 'AB-', 12.37, '2026-04-28 22:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donation_id` int(11) NOT NULL,
  `donor_unique_id` varchar(50) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `hemoglobin_level` decimal(4,2) DEFAULT NULL,
  `virus_test` varchar(50) DEFAULT 'Negative',
  `donation_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`donation_id`, `donor_unique_id`, `staff_id`, `hospital_id`, `hemoglobin_level`, `virus_test`, `donation_date`) VALUES
(1, 'DB - 9997', 8, 4, 12.90, 'negative', '2024-06-08 00:00:00'),
(2, 'DB - 8695', 6, 2, 12.40, 'negative', '2024-03-03 00:00:00'),
(3, 'DB - 9162', 1, 1, 13.40, 'negative', '2024-10-28 00:00:00'),
(4, 'DB - 1720', 9, 4, 13.40, 'negative', '2024-02-28 00:00:00'),
(5, 'DB - 8120', 1, 8, 13.50, 'negative', '2025-07-29 00:00:00'),
(6, 'DB - 2283', 9, 1, 13.00, 'positive', '2026-02-14 00:00:00'),
(7, 'DB - 9863', 1, 6, 12.90, 'positive', '2024-11-25 00:00:00'),
(8, 'DB - 7266', 3, 2, 12.20, 'positive', '2025-07-24 00:00:00'),
(9, 'DB - 8910', 7, 3, 12.70, 'positive', '2025-05-02 00:00:00'),
(10, 'DB - 5035', 8, 9, 12.20, 'positive', '2024-06-08 00:00:00'),
(11, 'DB - 5602', 6, 4, 13.40, 'negative', '2024-08-18 00:00:00'),
(12, 'DB - 2376', 6, 9, 13.10, 'negative', '2025-04-22 00:00:00'),
(13, 'DB - 0270', 1, 4, 13.00, 'positive', '2024-04-18 00:00:00'),
(14, 'DB - 3486', 1, 7, 12.40, 'positive', '2024-06-08 00:00:00'),
(15, 'DB - 7818', 8, 1, 12.30, 'negative', '2024-04-11 00:00:00'),
(16, 'DB - 1927', 4, 6, 12.80, 'positive', '2024-01-14 00:00:00'),
(17, 'DB - 6288', 7, 4, 13.20, 'negative', '2024-05-31 00:00:00'),
(18, 'DB - 3200', 2, 2, 12.40, 'negative', '2025-06-30 00:00:00'),
(19, 'DB - 4810', 6, 10, 13.30, 'negative', '2025-02-13 00:00:00'),
(20, 'DB - 1401', 6, 3, 13.20, 'positive', '2026-04-25 00:00:00'),
(21, 'DB - 8971', 8, 9, 13.30, 'negative', '2026-04-17 00:00:00'),
(22, 'DB - 0401', 2, 8, 12.40, 'positive', '2024-08-13 00:00:00'),
(23, 'DB - 4570', 7, 5, 12.20, 'negative', '2024-10-24 00:00:00'),
(24, 'DB - 7423', 1, 2, 13.00, 'negative', '2024-11-18 00:00:00'),
(25, 'DB - 3646', 3, 2, 12.00, 'negative', '2024-08-29 00:00:00'),
(26, 'DB - 7974', 4, 1, 12.50, 'positive', '2025-01-27 00:00:00'),
(27, 'DB - 5633', 5, 10, 12.40, 'negative', '2024-09-11 00:00:00'),
(28, 'DB - 9244', 6, 1, 13.00, 'positive', '2025-05-01 00:00:00'),
(29, 'DB - 3647', 5, 8, 12.30, 'negative', '2025-03-17 00:00:00'),
(30, 'DB - 4489', 2, 10, 13.00, 'positive', '2024-08-06 00:00:00'),
(31, 'DB - 8361', 6, 1, 13.10, 'positive', '2025-06-15 00:00:00'),
(32, 'DB - 9711', 1, 4, 12.90, 'positive', '2024-06-30 00:00:00'),
(33, 'DB - 6914', 1, 6, 13.00, 'negative', '2024-02-20 00:00:00'),
(34, 'DB - 9270', 5, 3, 13.10, 'positive', '2024-04-05 00:00:00'),
(35, 'DB - 1659', 4, 3, 12.70, 'positive', '2024-11-17 00:00:00'),
(36, 'DB - 8811', 9, 3, 13.00, 'negative', '2024-08-06 00:00:00'),
(37, 'DB - 7457', 3, 7, 12.50, 'negative', '2024-03-13 00:00:00'),
(38, 'DB - 0907', 10, 5, 12.90, 'negative', '2024-06-07 00:00:00'),
(39, 'DB - 3792', 2, 10, 12.80, 'negative', '2025-11-05 00:00:00'),
(40, 'DB - 0381', 3, 10, 12.10, 'positive', '2024-02-06 00:00:00'),
(41, 'DB - 2257', 9, 2, 13.50, 'negative', '2025-10-29 00:00:00'),
(42, 'DB - 7396', 4, 3, 12.20, 'positive', '2025-12-04 00:00:00'),
(43, 'DB - 4102', 10, 5, 12.60, 'positive', '2024-07-06 00:00:00'),
(44, 'DB - 5589', 7, 9, 13.40, 'positive', '2026-04-29 00:00:00'),
(45, 'DB - 1245', 9, 4, 12.10, 'positive', '2025-08-20 00:00:00'),
(46, 'DB - 6674', 4, 7, 12.30, 'negative', '2024-04-02 00:00:00'),
(47, 'DB - 3341', 8, 6, 12.50, 'positive', '2024-09-25 00:00:00'),
(48, 'DB - 8892', 4, 1, 12.10, 'positive', '2024-03-20 00:00:00'),
(49, 'DB - 4450', 4, 5, 12.40, 'negative', '2025-12-08 00:00:00'),
(50, 'DB - 0012', 4, 5, 12.20, 'positive', '2025-01-18 00:00:00'),
(51, 'DB - 1201', 2, 2, 12.70, 'negative', '2025-03-04 00:00:00'),
(52, 'DB - 1202', 6, 2, 13.50, 'negative', '2025-10-09 00:00:00'),
(53, 'DB - 1203', 3, 8, 12.00, 'negative', '2025-06-11 00:00:00'),
(54, 'DB - 1204', 3, 6, 12.10, 'negative', '2025-08-05 00:00:00'),
(55, 'DB - 1205', 7, 5, 13.40, 'positive', '2025-03-02 00:00:00'),
(56, 'DB - 1206', 2, 2, 12.40, 'positive', '2024-12-10 00:00:00'),
(57, 'DB - 1207', 9, 1, 13.20, 'negative', '2024-03-11 00:00:00'),
(58, 'DB - 1208', 4, 6, 13.10, 'positive', '2024-05-25 00:00:00'),
(59, 'DB - 1209', 6, 5, 12.40, 'positive', '2024-01-04 00:00:00'),
(60, 'DB - 1210', 6, 6, 12.50, 'positive', '2026-04-06 00:00:00'),
(61, 'DB - 1211', 9, 4, 12.10, 'positive', '2026-01-21 00:00:00'),
(62, 'DB - 1212', 2, 1, 13.40, 'negative', '2025-09-23 00:00:00'),
(63, 'DB - 1213', 2, 6, 12.50, 'negative', '2025-09-06 00:00:00'),
(64, 'DB - 1214', 8, 9, 13.00, 'positive', '2024-01-14 00:00:00'),
(65, 'DB - 1215', 1, 1, 12.30, 'negative', '2024-04-14 00:00:00'),
(66, 'DB - 1216', 8, 3, 12.40, 'negative', '2026-03-01 00:00:00'),
(67, 'DB - 1217', 10, 1, 12.60, 'negative', '2025-02-07 00:00:00'),
(68, 'DB - 1218', 3, 7, 12.70, 'positive', '2025-07-02 00:00:00'),
(69, 'DB - 1219', 1, 3, 12.10, 'negative', '2025-01-03 00:00:00'),
(70, 'DB - 1220', 7, 9, 12.80, 'negative', '2024-10-15 00:00:00'),
(71, 'DB - 1221', 8, 7, 12.20, 'negative', '2025-02-04 00:00:00'),
(72, 'DB - 1222', 10, 5, 12.60, 'negative', '2025-08-20 00:00:00'),
(73, 'DB - 1223', 8, 9, 13.10, 'positive', '2025-11-25 00:00:00'),
(74, 'DB - 1224', 5, 10, 12.40, 'negative', '2024-06-17 00:00:00'),
(75, 'DB - 1225', 2, 2, 12.50, 'positive', '2024-03-02 00:00:00'),
(76, 'DB - 1226', 8, 4, 12.80, 'negative', '2024-06-27 00:00:00'),
(77, 'DB - 1227', 8, 10, 13.10, 'negative', '2026-02-19 00:00:00'),
(78, 'DB - 1228', 8, 2, 12.30, 'negative', '2025-11-18 00:00:00'),
(79, 'DB - 1229', 1, 6, 13.30, 'negative', '2026-03-23 00:00:00'),
(80, 'DB - 1230', 6, 2, 13.30, 'negative', '2025-04-24 00:00:00'),
(81, 'DB - 1231', 4, 2, 13.10, 'positive', '2025-01-12 00:00:00'),
(82, 'DB - 1232', 9, 10, 13.40, 'positive', '2025-08-10 00:00:00'),
(83, 'DB - 1233', 2, 5, 13.40, 'positive', '2024-04-01 00:00:00'),
(84, 'DB - 1234', 4, 5, 12.50, 'positive', '2024-07-05 00:00:00'),
(85, 'DB - 1235', 4, 2, 12.70, 'positive', '2025-07-11 00:00:00'),
(86, 'DB - 1236', 3, 3, 12.90, 'positive', '2024-12-20 00:00:00'),
(87, 'DB - 1237', 4, 5, 12.10, 'positive', '2024-07-15 00:00:00'),
(88, 'DB - 1238', 10, 9, 12.50, 'positive', '2025-04-05 00:00:00'),
(89, 'DB - 1239', 8, 2, 12.60, 'negative', '2024-11-25 00:00:00'),
(90, 'DB - 1240', 8, 5, 12.40, 'negative', '2025-07-23 00:00:00'),
(91, 'DB - 1241', 7, 3, 12.40, 'negative', '2024-04-26 00:00:00'),
(92, 'DB - 1242', 10, 3, 12.70, 'positive', '2026-03-29 00:00:00'),
(93, 'DB - 1243', 5, 4, 12.50, 'negative', '2026-02-12 00:00:00'),
(94, 'DB - 1244', 2, 1, 13.00, 'positive', '2026-01-12 00:00:00'),
(95, 'DB - 1246', 9, 9, 12.60, 'negative', '2025-11-11 00:00:00'),
(96, 'DB - 1247', 2, 6, 12.10, 'negative', '2024-03-02 00:00:00'),
(97, 'DB - 1248', 8, 6, 12.70, 'negative', '2025-02-08 00:00:00'),
(98, 'DB - 1249', 1, 7, 12.40, 'positive', '2025-08-15 00:00:00'),
(99, 'DB - 1250', 7, 10, 13.30, 'positive', '2025-11-13 00:00:00'),
(100, 'DB - 5809', 6, 6, 12.10, 'negative', '2025-02-14 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `donors`
--

CREATE TABLE `donors` (
  `id` int(11) NOT NULL,
  `donor_unique_id` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `total_points` int(5) DEFAULT 0,
  `last_donation_date` date DEFAULT NULL,
  `age` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donors`
--

INSERT INTO `donors` (`id`, `donor_unique_id`, `username`, `password`, `full_name`, `blood_type`, `total_points`, `last_donation_date`, `age`) VALUES
(1, 'DB - 9997', 'tmckevany_u1', 'bQ9*\'8\'HCD<DW', 'Tammi McKevany', 'O-', 20, '2026-03-08', 59),
(2, 'DB - 8695', 'mcumes_u2', 'tF0+}5P!G', 'Mose Cumes', 'AB-', 20, '2024-11-21', 39),
(3, 'DB - 9162', 'sollerenshaw_u3', 'hV5,9d{\"rHSR@', 'Stillman Ollerenshaw', 'O+', 30, '2022-07-22', 48),
(4, 'DB - 1720', 'eoldfield_u4', 'cL8@GguHl2JgH0>', 'Elsi Oldfield', 'O-', 20, '2025-04-27', 28),
(5, 'DB - 8120', 'kphythean_u5', 'rM1\'/hGYK9', 'Keary Phythean', 'B+', 20, '2025-05-26', 55),
(6, 'DB - 2283', 'cwenger_u6', 'oW5.Y_U.xd%Elg0', 'Coralie Wenger', 'AB-', 20, '2025-09-22', 23),
(7, 'DB - 9863', 'lmcclements_u7', 'eR5#hLstsE=L#\"n?', 'Lorant McClements', 'AB+', 30, '2025-12-05', 52),
(8, 'DB - 7266', 'epabelik_u8', 'sA0(%r6u&{v`AAm5tNH', 'Eldon Pabelik', 'B+', 20, '2025-02-16', 24),
(9, 'DB - 8910', 'lhamshaw_u9', 'uE1`TS<#FMsAq>xI', 'Lena Hamshaw', 'B+', 10, '2022-09-20', 48),
(10, 'DB - 5035', 'akleinhaut_u10', 'zJ0_mNp%)&Ky', 'Aprilette Kleinhaut', 'B-', 20, '2025-03-26', 48),
(11, 'DB - 5602', 'pattenborough_u11', 'uE2+Ab#E*\"*a', 'Phyllys Attenborough', 'A+', 10, '2024-08-18', 30),
(12, 'DB - 2376', 'dbrunesco_u12', 'wP9)%4_i>,!9rr$h4D', 'Dickie Brunesco', 'A-', 20, '2022-07-01', 56),
(13, 'DB - 0270', 'ljiggins_u13', 'oK1\"@pZ*{%A`2p$15L~', 'Lyman Jiggins', 'AB-', 20, '2023-09-10', 45),
(14, 'DB - 3486', 'bribbens_u14', 'jT2/UuGxMi`(ETk', 'Bridie Ribbens', 'O+', 30, '2022-09-20', 56),
(15, 'DB - 7818', 'hprandini_u15', 'uY9&ovcb4oR', 'Helsa Prandini', 'AB-', 30, '2023-03-14', 28),
(16, 'DB - 1927', 'bphilippeaux_u16', 'nZ3!Xe*A0Qap/o,DtX', 'Bobby Philippeaux', 'A-', 20, '2025-07-09', 18),
(17, 'DB - 6288', 'tblanking_u17', 'yB3\'0zU<?EXjdg', 'Thalia Blanking', 'A+', 20, '2024-02-07', 30),
(18, 'DB - 3200', 'bpollington_u18', 'gN6$Z.E395lLf', 'Bevon Pollington', 'B-', 10, '2022-10-19', 25),
(19, 'DB - 4810', 'gdmytryk_u19', 'vJ2/bluZUH@`NdT(#ohR', 'Gaylene Dmytryk', 'A+', 30, '2024-06-27', 30),
(20, 'DB - 1401', 'kbette_u20', 'gL1eV$o~/EY9k(1', 'Kathryn Bette', 'A-', 10, '2023-03-28', 46),
(21, 'DB - 8971', 'bchurchley_u21', 'fD3{n}7rQqYO', 'Bunny Churchley', 'AB-', 10, '2025-03-03', 57),
(22, 'DB - 0401', 'dgai_u22', 'iR6`?#j.LDu@J=', 'Dorrie Gai', 'O-', 10, '2023-03-22', 26),
(23, 'DB - 4570', 'rblore_u23', 'yV8?fuo\"GL{H', 'Rance Blore', 'A-', 30, '2023-03-02', 38),
(24, 'DB - 7423', 'gdacks_u24', 'nD8$pXK_h1', 'Gaylor Dacks', 'B+', 10, '2024-05-26', 65),
(25, 'DB - 3646', 'hdunnet_u25', 'mC3\"Y=vd!6/rVp}!,2B\"', 'Hasty Dunnet', 'AB+', 30, '2022-10-19', 61),
(26, 'DB - 7974', 'wbrame_u26', 'rI1@q+Dgt,@|bC>', 'Wren Brame', 'AB-', 30, '2025-11-22', 22),
(27, 'DB - 5633', 'mguitte_u27', 'bB4{nNnn&(r', 'Marie-jeanne Guitte', 'O+', 30, '2023-06-12', 31),
(28, 'DB - 9244', 'ggrafton_u28', 'iI7%_Khq0\"73\'Z)t}', 'Glenna Grafton-Herbert', 'AB-', 20, '2024-01-07', 18),
(29, 'DB - 3647', 'hboundey_u29', 'wA7}xr7Jnq*(D', 'Hilda Boundey', 'AB+', 20, '2024-07-16', 24),
(30, 'DB - 4489', 'lgreiser_u30', 'yK1<2gTiS6d4q.', 'Lindsey Greiser', 'AB+', 20, '2023-04-22', 27),
(31, 'DB - 8361', 'hgrzelczak_u31', 'zZ6)y@\'xK', 'Hobey Grzelczak', 'O+', 20, '2024-12-15', 35),
(32, 'DB - 9711', 'gsurgison_u32', 'kA0,IU!Ax8', 'Gerhardine Surgison', 'AB-', 30, '2024-11-19', 52),
(33, 'DB - 6914', 'twaples_u33', 'sB1F<O&U1', 'Talbert Waples', 'O-', 20, '2025-12-07', 33),
(34, 'DB - 9270', 'rdomenico_u34', 'wF6!`$\'9Us<D!_PR', 'Roxana Domenico', 'B-', 30, '2026-04-20', 53),
(35, 'DB - 1659', 'fhaug_u35', 'qS0@3iP/`%+', 'Fletch Haug', 'AB+', 30, '2023-06-29', 19),
(36, 'DB - 8811', 'idignam_u36', 'jB0>}~odLQX%1tH', 'Inigo Dignam', 'AB+', 20, '2022-12-20', 53),
(37, 'DB - 7457', 'sharley_u37', 'fK1%m2Tg8D0JSr(n5m', 'Sherwin Harley', 'A+', 30, '2026-02-06', 19),
(38, 'DB - 0907', 'sfurnival_u38', 'bZ7\'2N!plL}`/6', 'Steve Furnival', 'B-', 10, '2023-12-31', 43),
(39, 'DB - 3792', 'dgofford_u39', 'fD7+_5N7qq}!ER6?)', 'Ddene Gofford', 'AB+', 30, '2024-02-17', 32),
(40, 'DB - 0381', 'adoelle_u40', 'jL4(X.|EjEZzi|', 'Adena Doelle', 'AB-', 10, '2023-02-05', 31),
(41, 'DB - 2257', 'iwebby_u41', 'wC4%QVYZ,M', 'Issiah Webby', 'A+', 10, '2023-04-26', 35),
(42, 'DB - 7396', 'ocampione_u42', 'vB2qw~|cQ.', 'Oberon Campione', 'O+', 10, '2022-11-25', 62),
(43, 'DB - 4102', 'ahassan_u43', 'pW3!kL9#mN', 'Ahmed Hassan', 'O+', 20, '2024-01-12', 36),
(44, 'DB - 5589', 'skhalil_u44', 'sA5@vR8*zX', 'Sara Khalil', 'A-', 10, '2025-05-18', 22),
(45, 'DB - 1245', 'jdoe_u45', 'dD9#fG2^hK', 'John Doe', 'B+', 30, '2024-09-30', 62),
(46, 'DB - 6674', 'mzaki_u46', 'mZ1&xY4$qP', 'Mona Zaki', 'AB+', 20, '2023-02-14', 21),
(47, 'DB - 3341', 'ofathy_u47', 'oF6*tH7!uL', 'Omar Fathy', 'O-', 20, '2025-11-05', 51),
(48, 'DB - 8892', 'lmourad_u48', 'lL2(bV5#rW', 'Lila Mourad', 'A+', 10, '2024-04-22', 62),
(49, 'DB - 4450', 'syassin_u49', 'sY8^mK3%pQ', 'Sami Yassin', 'B-', 30, '2023-10-10', 24),
(50, 'DB - 0012', 'nali_u50', 'nA4!jH9&sZ', 'Noura Ali', 'O+', 30, '2024-06-25', 37),
(51, 'DB - 1201', 'ksayed_u51', 'kS1!fM4@pW', 'Karim Sayed', 'B+', 30, '2025-08-14', 30),
(52, 'DB - 1202', 'lfarid_u52', 'lF5#vR8*zX', 'Layla Farid', 'A-', 30, '2023-12-05', 34),
(53, 'DB - 1203', 'hadel_u53', 'hA9&kL2^hK', 'Hany Adel', 'O+', 10, '2024-02-28', 46),
(54, 'DB - 1204', 'dsamy_u54', 'dS2%mN1!oP', 'Dina Samy', 'AB+', 30, '2026-01-10', 41),
(55, 'DB - 1205', 'anour_u55', 'aN6(xY4$qP', 'Ali Nour', 'O-', 20, '2025-03-15', 54),
(56, 'DB - 1206', 'rezzat_u56', 'rE3$uL7!rW', 'Rania Ezzat', 'A+', 20, '2024-09-11', 50),
(57, 'DB - 1207', 'sbakr_u57', 'sB8@mK3%pQ', 'Sameh Bakr', 'B-', 20, '2023-05-22', 61),
(58, 'DB - 1208', 'nfawzy_u58', 'nF4*jH9&sZ', 'Nadia Fawzy', 'O+', 30, '2025-11-30', 50),
(59, 'DB - 1209', 'amaher_u59', 'aM1#fM2@xL', 'Adel Maher', 'AB-', 20, '2026-02-14', 45),
(60, 'DB - 1210', 'szaki_u60', 'sZ7!pD4$vK', 'Salma Zaki', 'B+', 10, '2024-07-04', 19),
(61, 'DB - 1211', 'tamin_u61', 'tA9^mN1!oP', 'Tarek Amin', 'A-', 30, '2025-12-28', 47),
(62, 'DB - 1212', 'ykhalil_u62', 'yK5@uR8#zQ', 'Yasmine Khalil', 'O-', 10, '2023-04-01', 19),
(63, 'DB - 1213', 'msalem_u63', 'mS2&yH4&vS', 'Mostafa Salem', 'AB+', 30, '2024-01-10', 53),
(64, 'DB - 1214', 'hgamal_u64', 'hG6!kL9#mN', 'Hala Gamal', 'A+', 30, '2025-10-12', 23),
(65, 'DB - 1215', 'wbakr_u65', 'wB4#sA7@xL', 'Wael Bakr', 'B-', 20, '2023-06-18', 43),
(66, 'DB - 1216', 'freda_u66', 'fR1(pV5#rW', 'Farida Reda', 'O+', 30, '2024-03-25', 47),
(67, 'DB - 1217', 'esaleh_u67', 'eS8^mK3%pQ', 'Ehab Saleh', 'AB-', 10, '2025-09-09', 18),
(68, 'DB - 1218', 'gahmed_u68', 'gA4!jH9&sZ', 'Ghada Ahmed', 'B+', 30, '2022-11-05', 36),
(69, 'DB - 1219', 'htawfik_u69', 'hT3#fM2@xL', 'Hassan Tawfik', 'A-', 30, '2026-05-20', 34),
(70, 'DB - 1220', 'yadel_u70', 'yA7*pD4$vK', 'Yasmin Adel', 'O-', 10, '2024-10-14', 58),
(71, 'DB - 1221', 'asabri_u71', 'aS9&mN1!oP', 'Amr Sabri', 'AB+', 10, '2026-02-28', 59),
(72, 'DB - 1222', 'sdiab_u72', 'sD5@uR8#zQ', 'Sherine Diab', 'A+', 20, '2025-07-19', 57),
(73, 'DB - 1223', 'tabdel_u73', 'tA2*yH4&vS', 'Tamer Abdel', 'B-', 30, '2023-12-15', 61),
(74, 'DB - 1224', 'ahosny_u74', 'aH6!kL9#mN', 'Angham Hosny', 'O+', 30, '2024-04-30', 34),
(75, 'DB - 1225', 'mali_u75', 'mA4#sA7@xL', 'Mohamed Ali', 'AB-', 20, '2025-09-11', 57),
(76, 'DB - 1226', 'nhamaki_u76', 'nH1(pV5#rW', 'Nancy Hamaki', 'B+', 20, '2024-01-05', 49),
(77, 'DB - 1227', 'eajram_u77', 'eA8^mK3%pQ', 'Elissa Ajram', 'A-', 10, '2022-11-22', 59),
(78, 'DB - 1228', 'akhoury_u78', 'aK4!jH9&sZ', 'Assala Khoury', 'O-', 20, '2025-06-14', 60),
(79, 'DB - 1229', 'mnasri_u79', 'mN3#fM2@xL', 'Majid Nasri', 'AB+', 10, '2023-03-18', 24),
(80, 'DB - 1230', 'aalmohandis_u80', 'aA7*pD4$vK', 'Ahlam Almohandis', 'A+', 30, '2024-12-01', 22),
(81, 'DB - 1231', 'rshamsi_u81', 'rS9&mN1!oP', 'Rashed Shamsi', 'B-', 10, '2025-05-10', 18),
(82, 'DB - 1232', 'falmajid_u82', 'fA5@uR8#zQ', 'Fares Almajid', 'O+', 20, '2023-10-20', 58),
(83, 'DB - 1233', 'mkaram_u83', 'mK2*yH4&vS', 'Myriam Karam', 'AB-', 30, '2026-02-12', 51),
(84, 'DB - 1234', 'rfares_u84', 'rF6!kL9#mN', 'Ragheb Fares', 'B+', 20, '2024-08-30', 57),
(85, 'DB - 1235', 'nalama_u85', 'nA4#sA7@xL', 'Najwa Alama', 'A-', 30, '2023-01-15', 57),
(86, 'DB - 1236', 'gkaram_u86', 'gK1(pV5#rW', 'George Karam', 'O-', 20, '2025-11-11', 27),
(87, 'DB - 1237', 'kwassouf_u87', 'kW8^mK3%pQ', 'Kazem Wassouf', 'AB+', 30, '2024-04-05', 18),
(88, 'DB - 1238', 'salsaher_u88', 'sS4!jH9&sZ', 'Saber Alsaher', 'A+', 20, '2022-09-22', 44),
(89, 'DB - 1239', 'hrebai_u89', 'hR3#fM2@xL', 'Hussein Rebai', 'B-', 10, '2026-02-14', 65),
(90, 'DB - 1240', 'naljasmi_u90', 'nA7*pD4$vK', 'Nawal Aljasmi', 'O+', 30, '2025-06-18', 38),
(91, 'DB - 1241', 'aalkuwaiti_u91', 'aA9&mN1!oP', 'Abdallah Alkuwaiti', 'AB-', 10, '2023-12-12', 51),
(92, 'DB - 1242', 'aalrowaished_u92', 'aA5@uR8#zQ', 'Asma Alrowaished', 'B+', 20, '2024-05-25', 51),
(93, 'DB - 1243', 'slmnawar_u93', 'sL2*yH4&vS', 'Saad Lmnawar', 'A-', 10, '2022-11-01', 64),
(94, 'DB - 1244', 'blamjarred_u94', 'bL6!kL9#mN', 'Balqees Lamjarred', 'O-', 10, '2025-03-10', 48),
(96, 'DB - 1246', 'tabdo_u96', 'tA1(pV5#rW', 'Talal Abdo', 'A+', 20, '2023-01-14', 60),
(97, 'DB - 1247', 'zmaddah_u97', 'zM8^mK3%pQ', 'Zikra Maddah', 'B-', 20, '2025-12-25', 62),
(98, 'DB - 1248', 'wmohamed_u98', 'wM4!jH9&sZ', 'Warda Mohamed', 'O+', 10, '2024-04-12', 64),
(99, 'DB - 1249', 'ukulthum_u99', 'uK3#fM2@xL', 'Umm Kulthum', 'AB-', 30, '2022-10-05', 47),
(100, 'DB - 1250', 'ahalim_u100', 'aA7*pD4$vK', 'Abdel Halim', 'B+', 30, '2023-09-19', 30),
(101, 'DB - 5809', NULL, NULL, 'Fleurette Kibbel', 'AB+', 0, '2026-03-08', 45),
(102, 'DB - 0088', NULL, NULL, 'Shamus Paprotny', 'AB+', 0, '2026-04-18', 33),
(103, 'DB - 4940', NULL, NULL, 'Lurlene Mauro', 'O-', 0, '2025-05-16', 29),
(104, 'DB - 1603', NULL, NULL, 'Kaleb Abel', 'B-', 0, '2026-03-08', 51),
(105, 'DB - 5819', NULL, NULL, 'Fleurette Kibbel', 'AB+', 10, '2026-02-08', 40),
(106, 'DB - 1088', NULL, NULL, 'Shamus Paprotny', 'AB+', 20, '2025-06-07', 22),
(107, 'DB - 4941', NULL, NULL, 'Lurlene Mauro', 'O-', 30, '2022-05-21', 37),
(108, 'DB - 1613', NULL, NULL, 'Kaleb Abel', 'B-', 10, '2024-08-11', 55),
(109, 'DB - 9280', NULL, NULL, 'Oren Totterdell', 'B-', 20, '2024-11-07', 19),
(110, 'DB - 3881', NULL, NULL, 'Berkley Dreschler', 'A-', 30, '2023-05-03', 42),
(111, 'DB - 6079', NULL, NULL, 'Mendie Alyokhin', 'B-', 10, '2022-12-02', 28),
(112, 'DB - 6939', NULL, NULL, 'Damien Pidduck', 'AB+', 20, '2024-07-16', 63),
(113, 'DB - 2641', NULL, NULL, 'Glenn Cheater', 'O+', 30, '2022-12-16', 47),
(114, 'DB - 5739', NULL, NULL, 'Dacy Paolucci', 'B+', 10, '2025-06-09', 31);

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `hospital_id` int(11) NOT NULL,
  `hospital_name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `contact_info` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`hospital_id`, `hospital_name`, `location`, `contact_info`) VALUES
(1, 'WINTHROP UNIVERSITY HOSPITAL', '505 HEWLETT ST ', '184-345-2863'),
(2, 'HEARTLAND REGIONAL MEDICAL CENTER', '5325 FARAON ST ', '770-185-2730'),
(3, 'ST. VINCENT HOSPITAL', '455 SAINT MICHAELS DR MEDICAL STAFF OFFICE', '398-364-7105'),
(4, 'LOWER BUCKS HOSPITAL', '501 BATH RD ', '196-150-1917'),
(5, 'ST. PETER\'S HOSPITALOF THE CITY OF ALBANY', 'PO BOX 14890 ', '942-833-6542'),
(6, 'HARRIS METHODIST HOSPITAL HEB', '6000 STERLING DR ', '634-467-6886'),
(7, 'SPEARE MEMORIAL HOSPITAL', '16 HOSPITAL RD ', '632-832-9257'),
(8, 'GRAND VIEW HOSPITAL', 'PO BOX 1111 ', '285-737-2006'),
(9, 'COLUMBIA OCALA REGIONAL MEDICAL CENTER PHYSICIAN GROUP INC', '700 SE 5TH TER SUITE 5', '770-620-3246'),
(10, 'CHRISTIAN MEDICAL CENTER', '213 N POINDEXTER ST ', '138-391-7835');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `hospital_id`, `full_name`, `username`, `password`) VALUES
(1, 1, 'Mandie Ruprich', 'mruprich0', 'qV9_?p>O<tV2M9s@+#'),
(2, 2, 'Sauveur Lunn', 'slunn1', 'bF5+\'Y4?,M/'),
(3, 3, 'Rosmunda Botger', 'rbotger2', 'gP2?f%D>uBG=aj'),
(4, 4, 'Ahmad Mazzei', 'amazzei3', 'uC3+gR61q@\'3YC'),
(5, 5, 'Nobe Winney', 'nwinney4', 'xN7,#Ryp#>_bB'),
(6, 6, 'Ronald Kelinge', 'rkelinge5', 'rC9.v(\',ECe_$%1'),
(7, 7, 'Orland LeEstut', 'oleestut6', 'yG5~b0sRMs.)<Jg'),
(8, 8, 'Tobiah Lacasa', 'tlacasa7', 'nL9<+BKG6pvpVQ'),
(9, 9, 'Pet Woofendell', 'pwoofendell8', 'gN7$V}$BiMPS'),
(10, 10, 'Franchot Farden', 'ffarden9', 'nV5#v3A2q_\"J');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `hospital_id` (`hospital_id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `donor_unique_id` (`donor_unique_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `hospital_id` (`hospital_id`);

--
-- Indexes for table `donors`
--
ALTER TABLE `donors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `donor_unique_id` (`donor_unique_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`hospital_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `hospital_id` (`hospital_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `donors`
--
ALTER TABLE `donors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `hospital_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  ADD CONSTRAINT `blood_inventory_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`);

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`donor_unique_id`) REFERENCES `donors` (`donor_unique_id`),
  ADD CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `donations_ibfk_3` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
