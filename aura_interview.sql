-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 01:59 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aura_interview`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `organization_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `company_name`, `logo`, `address`, `city`, `state`, `country`, `phone_number`, `email`, `title`, `created_at`, `updated_at`, `organization_id`) VALUES
(1, 'KeyDevs', 'https://keydevs.net/assets/keydevs-logo.png', '123 Software Park, Main Blvd', 'Rawalpindi', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-05-14 16:36:59', '2025-05-15 13:16:37', 2),
(2, 'KeyDevs Technologies', 'https://keydevs.net/assets/keydevs-logo.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-05-14 16:37:53', '2025-05-15 13:16:37', 2),
(3, 'KeyDevs Force', 'https://keydevs.net/assets/keydevs-logo.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-05-14 16:38:44', '2025-05-15 13:16:37', 2);

-- --------------------------------------------------------

--
-- Table structure for table `cvs`
--

CREATE TABLE `cvs` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `personal_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`personal_info`)),
  `score` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('draft','invalid','processed') DEFAULT 'processed',
  `file_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs`
--

INSERT INTO `cvs` (`id`, `organization_id`, `job_id`, `file_path`, `personal_info`, `score`, `created_at`, `updated_at`, `status`, `file_hash`) VALUES
(1, 2, 1, 'sanafaizcv.pdf', '{\"name\": \"Sana Faiz\", \"email\": \"sana.faiz.muet83@gmail.com\", \"phone\": 3401116573, \"github\": null, \"address\": \"GOR Colony, Hyderabad\", \"summary\": \"Passionate and detail-oriented content writer eager to leverage strong writing skills and marketing expertise to create compelling, audience-centric content that drives brand visibility and engagement in the dynamic world of digital marketing\", \"website\": null, \"linkedin\": null, \"phone_country_code\": 92}', NULL, '2025-04-13 06:03:02', '2025-04-13 06:03:02', 'processed', NULL),
(2, 2, 1, 'resumee_1.pdf', '{\"name\": \"Oluwasomidoyin Olukemi Bello\", \"email\": \"bellodoyin@yahoo.com\", \"phone\": 8033711116, \"github\": null, \"address\": \"No.16, Kunle Malami Street, Oluyole Estate Ext., Ibadan, Nigeria.\", \"summary\": \"Consultant Obstetrician and Gynaecologist with 12 years of medical practice.\", \"website\": null, \"linkedin\": null, \"phone_country_code\": 234}', NULL, '2025-04-13 06:08:16', '2025-04-13 06:08:16', 'processed', NULL),
(3, 1, 1, '1744527721935-m.umar+Resume.pdf', '{\"email\": \"vomynez@mailinator.com\", \"fullName\": \"Adria Cobb\", \"phoneNumber\": \"+1 (662) 806-7638\"}', NULL, '2025-04-13 07:02:01', '2025-04-13 07:02:01', 'processed', NULL),
(4, 1, 1, '1744527729341-m.umar+Resume.pdf', '{\"email\": \"vomynez@mailinator.com\", \"fullName\": \"Adria Cobb\", \"phoneNumber\": \"+1 (662) 806-7638\"}', NULL, '2025-04-13 07:02:09', '2025-04-13 07:02:09', 'processed', NULL),
(5, 0, 0, '1744534878067-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:01:31', '2025-04-13 09:01:31', 'processed', NULL),
(6, 0, 0, '1744534901060-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:01:52', '2025-04-13 09:01:52', 'processed', NULL),
(7, 0, 0, '1744534968018-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:03:01', '2025-04-13 09:03:01', 'processed', NULL),
(8, 0, 0, '1744535075920-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:04:50', '2025-04-13 09:04:50', 'processed', NULL),
(9, 0, 0, '1744535851857-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:17:50', '2025-04-13 09:17:50', 'processed', NULL),
(10, 0, 0, '1744535929108-REHAN+MANSOOR+CV.pdf', '{\"email\": \"bydotudax@mailinator.com\", \"fullName\": \"Neve Baird\", \"phoneNumber\": \"+1 (624) 837-3535\"}', NULL, '2025-04-13 09:19:07', '2025-04-13 09:19:07', 'processed', NULL),
(11, 0, 0, '1744536879540-Muhammad-Taha-cv.pdf', '{\"email\": \"moxivu@mailinator.com\", \"fullName\": \"Kermit Puckett\", \"phoneNumber\": \"+1 (133) 501-2335\"}', NULL, '2025-04-13 09:34:46', '2025-04-13 09:34:46', 'processed', NULL),
(12, 0, 0, '1744537126807-Muhammad-Taha-cv.pdf', '{\"email\": \"moxivu@mailinator.com\", \"fullName\": \"Kermit Puckett\", \"phoneNumber\": \"+1 (133) 501-2335\"}', NULL, '2025-04-13 09:38:56', '2025-04-13 09:38:56', 'processed', NULL),
(13, 2, 0, '1744538954064-Jamshaid\'s+Resume+(5).pdf', '{\"email\": \"vilysopyru@mailinator.com\", \"fullName\": \"Kylie Wall\", \"phoneNumber\": \"+1 (147) 554-1319\"}', NULL, '2025-04-13 10:09:22', '2025-04-13 10:09:22', 'processed', NULL),
(14, 2, 0, '1744539198878-M+husnain.pdf', '{\"email\": \"xidagorec@mailinator.com\", \"fullName\": \"Blaine Delacruz\", \"phoneNumber\": \"+1 (544) 518-5755\"}', NULL, '2025-04-13 10:13:21', '2025-04-13 10:13:21', 'processed', NULL),
(15, 2, 0, '1744539346660-Muneeb+Javed.pdf', '{\"email\": \"zydozarad@mailinator.com\", \"fullName\": \"Kennedy Lowery\", \"phoneNumber\": \"+1 (633) 868-9173\"}', NULL, '2025-04-13 10:15:58', '2025-04-13 10:15:58', 'processed', NULL),
(16, 2, 0, '1744539409889-m.umar+Resume.pdf', '{\"email\": \"fugutylada@mailinator.com\", \"fullName\": \"Aquila Shepard\", \"phoneNumber\": \"+1 (128) 918-5526\"}', NULL, '2025-04-13 10:17:04', '2025-04-13 10:17:04', 'processed', NULL),
(17, 2, 1, '1744546393765-talha_dev.pdf', '{\"email\": \"funinaku@mailinator.com\", \"fullName\": \"Clayton Lamb\", \"phoneNumber\": \"+1 (142) 164-3248\"}', NULL, '2025-04-13 12:13:21', '2025-04-13 12:13:21', 'processed', NULL),
(18, 2, 1, '1744546789077-REHAN+MANSOOR+CV.pdf', '{\"email\": \"tomyj@mailinator.com\", \"fullName\": \"Maxwell Sheppard\", \"phoneNumber\": \"+1 (343) 932-2715\"}', NULL, '2025-04-13 12:20:06', '2025-04-13 12:20:06', 'processed', NULL),
(19, 2, 0, '1744626809742-Muneeb+Javed.pdf', '{\"email\": \"xofajosuku@mailinator.com\", \"fullName\": \"Reece Valentine\", \"phoneNumber\": \"+1 (715) 357-2828\"}', NULL, '2025-04-14 10:33:51', '2025-04-14 10:33:51', 'processed', NULL),
(20, 2, 0, '1744626985818-Sufee+Latif.pdf', '{\"email\": \"pacu@mailinator.com\", \"fullName\": \"Ulric Gardner\", \"phoneNumber\": \"+1 (885) 444-3947\"}', NULL, '2025-04-14 10:36:38', '2025-04-14 10:36:38', 'processed', NULL),
(21, 2, 1, 'sanafaizcv.pdf', '{\"name\": \"Sana Faiz\", \"email\": \"sana.faiz.muet83@gmail.com\", \"phone\": 3401116573, \"github\": null, \"address\": \"GOR Colony, Hyderabad\", \"summary\": \"Passionate and detail-oriented content writer eager to leverage strong writing skills and marketing expertise to create compelling, audience-centric content that drives brand visibility and engagement in the dynamic world of digital marketing\", \"website\": null, \"linkedin\": null, \"phone_country_code\": 92}', NULL, '2025-04-15 09:57:50', '2025-04-15 09:57:50', 'processed', NULL),
(22, 2, 0, '1744711235081-resumee_1.pdf', '{\"email\": \"penoriqy@mailinator.com\", \"fullName\": \"Meghan Wolfe\", \"phoneNumber\": \"+1 (931) 738-6065\"}', NULL, '2025-04-15 10:01:04', '2025-04-15 10:01:04', 'processed', NULL),
(23, 2, 1, 'cv-farhan-1.pdf', '{\"name\": \"Farhan Qureshi\", \"email\": \"farhanshakirqureshi@gmail.com\", \"phone\": 9986921026, \"github\": null, \"address\": \"Jaipur\", \"summary\": \"Business Analyst - Software\", \"website\": null, \"linkedin\": null, \"phone_country_code\": 91}', NULL, '2025-04-15 15:23:06', '2025-04-15 15:23:06', 'processed', NULL),
(24, 2, 1, '1744730918938-Resume-2019.pdf', '{\"email\": \"domedata@gmail.com\", \"fullName\": \"Asmat ullah Tunio\", \"phoneNumber\": \"9346849687987\"}', NULL, '2025-04-15 15:28:58', '2025-07-02 06:38:30', 'draft', NULL),
(25, 2, 1, 'Resume-2019.pdf', '{\"name\": \"Ahmed Issa\", \"email\": \"ahmedz709@gmail.com\", \"phone\": 1208218208, \"github\": null, \"address\": \"Cairo, Egypt\", \"summary\": \"A motivated and energetic Business development manager with 18 years experience & positive attitude seeking Marketing position with a reputable organization in which I can add value that lead to company growth.\", \"website\": null, \"linkedin\": null, \"phone_country_code\": 20}', NULL, '2025-04-16 07:48:39', '2025-07-02 06:38:23', 'draft', NULL),
(35, 8, 0, 'Anam\'s Resume.pdf', '{\"name\":\"Anam Razaq\",\"address\":\"Layyah\",\"email\":\"anamrazaq236@gmail.com\",\"phone\":3097328603,\"phone_country_code\":null,\"github\":\"https://github.com/anam236razaq\",\"linkedin\":null,\"website\":null,\"summary\":\"One year of experience in creating responsive and visually engaging User Interfaces. Committed to clean code, collaboration, ensuring seamless user experiences.\"}', NULL, '2025-04-29 10:21:55', '2025-04-29 10:21:55', 'processed', NULL),
(52, 8, 0, 'Resume Anam Razaq.pdf', '{\"name\":\"Anam Razaq\",\"address\":\"Naseerabad ferozpur road, Lahore\",\"email\":\"anamrazaq236@gmail.com\",\"phone\":3097328603,\"phone_country_code\":92,\"github\":\"github.com/anam236razaq\",\"linkedin\":\"linkedin.com/in/anam-razaq-6baa3928b/\",\"website\":null,\"summary\":\"Six months of experience in creating responsive and visually engaging user interfaces. Committed to writing clean code, fostering collaboration, and ensuring seamless user experiences. Looking to utilize expertise and experience to inspire Innovation and make valuable contributions to varied projects.\"}', NULL, '2025-04-30 07:38:05', '2025-07-02 06:29:21', 'draft', NULL),
(53, 2, 0, '1746000892151-Resume Anam Razaq.pdf', '{\"fullName\":\"Anam Razaq\",\"email\":\"anamrazaq236@gmail.com\",\"phoneNumber\":\"3097328603\"}', NULL, '2025-04-30 08:15:07', '2025-04-30 08:15:07', 'processed', NULL),
(57, 2, 0, 'ali_resume-1751449504488.pdf', '{}', NULL, '2025-07-02 09:45:06', '2025-07-02 09:45:06', 'invalid', 'b4878dabea8a0b30374e9100fbfebc70ab20ae20598f859c35d4e0d51da9cd46'),
(58, 2, 0, 'zain_resume-1751449525415.pdf', '{}', NULL, '2025-07-02 09:45:28', '2025-07-02 09:45:28', 'invalid', '7691c644b0d221bbfaef457b61902f5170550dcc9495bd456d87a260f6620c65');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_achievements`
--

CREATE TABLE `cvs_achievements` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `achievement` varchar(255) DEFAULT NULL,
  `achievement_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_achievements`
--

INSERT INTO `cvs_achievements` (`id`, `cv_id`, `achievement`, `achievement_date`, `created_at`) VALUES
(1, 1, 'Best Elocution', NULL, '2025-04-13 06:03:02'),
(2, 1, 'Player of the tournament (Basketball)', NULL, '2025-04-13 06:03:02'),
(3, 1, 'Best Debater', NULL, '2025-04-13 06:03:02'),
(4, 1, 'Best Athlete', NULL, '2025-04-13 06:03:02'),
(5, 1, 'A1 Achiever Throwball Tournament', NULL, '2025-04-13 06:03:02'),
(6, 2, 'Best Graduating Student in Paediatrics', '2002-01-01', '2025-04-13 06:08:16'),
(7, 2, 'Best Graduating Student in Obstetrics and Gynaecology', '2002-01-01', '2025-04-13 06:08:16'),
(8, 2, 'International Federation of Gynaecology and Obstetrics (FIGO) Fellowship Award', '2015-01-01', '2025-04-13 06:08:16'),
(9, 5, 'Contributor in UOO modal system', NULL, '2025-04-13 09:01:31'),
(10, 5, 'Passing test on LinkedIn', NULL, '2025-04-13 09:01:31'),
(11, 5, 'Active Member of Code war Society', NULL, '2025-04-13 09:01:31'),
(12, 5, 'More than 4 projects on GitHub(private)', NULL, '2025-04-13 09:01:31'),
(13, 6, 'Contributor in UOO modal system', NULL, '2025-04-13 09:01:52'),
(14, 6, 'Passing test on LinkedIn', NULL, '2025-04-13 09:01:52'),
(15, 6, 'Active Member of Code war Society', NULL, '2025-04-13 09:01:52'),
(16, 6, 'More than 4 projects on GitHub(private)', NULL, '2025-04-13 09:01:52'),
(17, 7, 'Contributor in UOO modal system.', NULL, '2025-04-13 09:03:01'),
(18, 7, 'Passing test on LinkedIn.', NULL, '2025-04-13 09:03:01'),
(19, 7, 'Active Member of Code war Society.', NULL, '2025-04-13 09:03:01'),
(20, 7, 'More than 4 projects on GitHub(private).', NULL, '2025-04-13 09:03:01'),
(21, 8, 'Contributor in UOO modal system.', NULL, '2025-04-13 09:04:50'),
(22, 8, 'Passing test on LinkedIn.', NULL, '2025-04-13 09:04:50'),
(23, 8, 'Active Member of Code war Society.', NULL, '2025-04-13 09:04:50'),
(24, 8, 'More than 4 projects on GitHub(private).', NULL, '2025-04-13 09:04:50'),
(25, 9, 'Contributor in UOO modal system.', NULL, '2025-04-13 09:17:50'),
(26, 9, 'Passing test on LinkedIn.', NULL, '2025-04-13 09:17:50'),
(27, 9, 'Active Member of Code war Society.', NULL, '2025-04-13 09:17:50'),
(28, 9, 'More than 4 projects on GitHub(private).', NULL, '2025-04-13 09:17:50'),
(29, 10, 'Contributor in UOO modal system.', NULL, '2025-04-13 09:19:07'),
(30, 10, 'Passing test on LinkedIn.', NULL, '2025-04-13 09:19:07'),
(31, 10, 'Active Member of Code war Society.', NULL, '2025-04-13 09:19:07'),
(32, 10, 'More than 4 projects on GitHub(private).', NULL, '2025-04-13 09:19:07'),
(33, 13, 'Taskmania', NULL, '2025-04-13 10:09:22'),
(34, 13, 'laymat', NULL, '2025-04-13 10:09:22'),
(35, 18, 'Contributor in UOO modal system.', NULL, '2025-04-13 12:20:06'),
(36, 18, 'Passing test on LinkedIn.', NULL, '2025-04-13 12:20:06'),
(37, 18, 'Active Member of Code war Society.', NULL, '2025-04-13 12:20:06'),
(38, 18, 'More than 4 projects on GitHub(private).', NULL, '2025-04-13 12:20:06'),
(39, 21, 'Best Elocution', NULL, '2025-04-15 09:57:50'),
(40, 21, 'Player of the tournament (Basketball)', NULL, '2025-04-15 09:57:50'),
(41, 21, 'Best Debater', NULL, '2025-04-15 09:57:50'),
(42, 21, 'Best Athlete', NULL, '2025-04-15 09:57:50'),
(43, 21, 'A1 Achiever Throwball Tournament', NULL, '2025-04-15 09:57:50'),
(44, 22, 'Best Graduating Student in Paediatrics', '2002-01-01', '2025-04-15 10:01:04'),
(45, 22, 'Best Graduating Student in Obstetrics and Gynaecology', '2002-01-01', '2025-04-15 10:01:04'),
(46, 22, 'International Federation of Gynaecology and Obstetrics (FIGO) Fellowship Award', '2015-01-01', '2025-04-15 10:01:04'),
(47, 23, 'Received Certificate Of Excellence at TCS ILP Training Held in Trivandrum, Kerala for Outstanding Performance', NULL, '2025-04-15 15:23:06'),
(48, 23, 'Got the highest marks in school in subject CHEMISTRY in class 12th C.B.S.E Senior School Certificate Examination', NULL, '2025-04-15 15:23:06'),
(49, 23, 'Listed for SCHOLARSHIP in college, based on RPET exam’s rank (Rajasthan Pre Entrance Engineering Examination)', NULL, '2025-04-15 15:23:06'),
(50, 23, 'Won 1 Gold Medal, 3 Silver Medals and 1 Bronze Medal for 100 meters race and Hurdle Race at school.', NULL, '2025-04-15 15:23:06'),
(83, 52, 'Position Holder – University Of Sargodha', '2023-01-01', '2025-04-30 07:38:06'),
(84, 52, 'Position Holder – ICS Dg Khan Board', '2019-01-01', '2025-04-30 07:38:06'),
(85, 52, 'Certificate of Merit – GC for Women Layyah', '2019-01-01', '2025-04-30 07:38:06'),
(86, 52, 'English Essay Writing Competition Award', '2017-01-01', '2025-04-30 07:38:06'),
(87, 53, 'Position Holder – University Of Sargodha.', '2023-01-01', '2025-04-30 08:15:07'),
(88, 53, 'Position Holder – ICS Dg Khan Board.', '2019-01-01', '2025-04-30 08:15:07'),
(89, 53, 'Certificate of Merit – GC for Women Layyah.', '2019-01-01', '2025-04-30 08:15:07'),
(90, 53, 'English Essay Writing Competition Award.', '2017-01-01', '2025-04-30 08:15:07'),
(91, 54, 'Position Holder – University Of Sargodha.', '2023-01-01', '2025-07-02 08:50:46'),
(92, 54, 'Position Holder – ICS Dg Khan Board.', '2019-01-01', '2025-07-02 08:50:46'),
(93, 54, 'Certificate of Merit – GC for Women Layyah.', '2019-01-01', '2025-07-02 08:50:46'),
(94, 54, 'English Essay Writing Competition Award.', '2017-01-01', '2025-07-02 08:50:46'),
(95, 55, 'Position Holder – University Of Sargodha.', '2023-01-01', '2025-07-02 09:30:56'),
(96, 55, 'Position Holder – ICS Dg Khan Board.', '2019-01-01', '2025-07-02 09:30:56'),
(97, 55, 'Certificate of Merit – GC for Women Layyah.', '2019-01-01', '2025-07-02 09:30:56'),
(98, 55, 'English Essay Writing Competition Award.', '2017-01-01', '2025-07-02 09:30:56'),
(99, 56, 'Position Holder – University Of Sargodha.', '2023-01-01', '2025-07-02 09:44:41'),
(100, 56, 'Position Holder – ICS Dg Khan Board.', '2019-01-01', '2025-07-02 09:44:41'),
(101, 56, 'Certificate of Merit – GC for Women Layyah.', '2019-01-01', '2025-07-02 09:44:41'),
(102, 56, 'English Essay Writing Competition Award.', '2017-01-01', '2025-07-02 09:44:41'),
(119, 63, 'Position Holder – University Of Sargodha.', '2023-01-01', '2025-07-02 10:51:27'),
(120, 63, 'Position Holder – ICS Dg Khan Board.', '2019-01-01', '2025-07-02 10:51:27'),
(121, 63, 'Certificate of Merit – GC for Women Layyah.', '2019-01-01', '2025-07-02 10:51:27'),
(122, 63, 'English Essay Writing Competition Award.', '2017-01-01', '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_certifications`
--

CREATE TABLE `cvs_certifications` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `certification_name` varchar(255) DEFAULT NULL,
  `issuing_organization` varchar(255) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_certifications`
--

INSERT INTO `cvs_certifications` (`id`, `cv_id`, `certification_name`, `issuing_organization`, `issue_date`, `expiration_date`, `created_at`) VALUES
(1, 2, 'Fellow, West African College of Surgeon (FWACS)', 'West African College of Surgery', NULL, NULL, '2025-04-13 06:08:16'),
(2, 5, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:01:31'),
(3, 6, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:01:52'),
(4, 7, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:03:01'),
(5, 8, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:04:50'),
(6, 9, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:17:50'),
(7, 10, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 09:19:07'),
(8, 16, 'Web developer', NULL, NULL, NULL, '2025-04-13 10:17:04'),
(9, 18, 'Certification of Wordpress developer', 'UOO', NULL, NULL, '2025-04-13 12:20:06'),
(10, 22, 'Fellow, West African College of Surgeons (FWACS)', 'West African College of Surgeons', NULL, NULL, '2025-04-15 10:01:04'),
(11, 23, 'Oracle Certified Professional, Java SE 6 Programmer Certification', NULL, '0000-00-00', NULL, '2025-04-15 15:23:06');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_education`
--

CREATE TABLE `cvs_education` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `start_year` year(4) DEFAULT NULL,
  `end_year` year(4) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_education`
--

INSERT INTO `cvs_education` (`id`, `cv_id`, `institution`, `start_year`, `end_year`, `qualification`, `major`, `gpa`, `created_at`) VALUES
(1, 1, 'Mehran University of Engineering and Technology', 2017, 2019, 'Intermediate', 'Software Engineering', NULL, '2025-04-13 06:03:02'),
(2, 1, 'Superior College of Science', 2019, NULL, 'Bachelor of Science', NULL, NULL, '2025-04-13 06:03:02'),
(3, 2, 'Ladoke Akintola University of Technology', 1998, 2003, 'Bachelor of Medicine and Bachelor of Surgery (M.B.,B.S.)', NULL, NULL, '2025-04-13 06:08:16'),
(4, 2, 'Wesley College of Science, Elekuro', 1992, 1994, NULL, NULL, NULL, '2025-04-13 06:08:16'),
(5, 2, 'Omolewa Nursery and Primary School', NULL, 1988, NULL, NULL, NULL, '2025-04-13 06:08:16'),
(6, 5, 'UNIVERSITY OF OKARA', 2016, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:01:31'),
(7, 5, 'PUNJAB GROUP OF COLLEGES (MULTAN)', 2013, 2015, 'INTERMEDIATE', NULL, NULL, '2025-04-13 09:01:31'),
(8, 5, 'G/H SCHOOL KOTLI NIJABAT', 2011, 2013, 'MATRIC', NULL, NULL, '2025-04-13 09:01:31'),
(9, 6, 'University of Okara', 2016, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:01:52'),
(10, 6, 'Punjab Group of Colleges (Multan)', 2013, 2015, 'Intermediate', NULL, NULL, '2025-04-13 09:01:52'),
(11, 6, 'G/H School Kotli Nijabat', 2011, 2013, 'Matric', NULL, NULL, '2025-04-13 09:01:52'),
(12, 7, 'UNIVERSITY OF OKARA', NULL, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:03:01'),
(13, 7, 'PUNJAB GROUP OF COLLEGES (MULTAN)', 2015, NULL, NULL, NULL, NULL, '2025-04-13 09:03:01'),
(14, 7, 'G/H SCHOOL KOTLI NIJABAT', 2013, NULL, NULL, NULL, NULL, '2025-04-13 09:03:01'),
(15, 8, 'UNIVERSITY OF OKARA', NULL, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:04:50'),
(16, 8, 'PUNJAB GROUP OF COLLEGES (MULTAN)', NULL, 2015, 'INTERMEDIATE', NULL, NULL, '2025-04-13 09:04:50'),
(17, 8, 'G/H SCHOOL KOTLI NIJABAT', NULL, 2013, 'MATRIC', NULL, NULL, '2025-04-13 09:04:50'),
(18, 9, 'University of Okara', 2016, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:17:50'),
(19, 9, 'Punjab Group of Colleges (Multan)', 2013, 2015, 'Intermediate', NULL, NULL, '2025-04-13 09:17:50'),
(20, 9, 'G/H School Kotli Nijabat', 2011, 2013, 'Matric', NULL, NULL, '2025-04-13 09:17:50'),
(21, 10, 'UNIVERSITY OF OKARA', NULL, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 09:19:07'),
(22, 10, 'PUNJAB GROUP OF COLLEGES (MULTAN)', 2015, NULL, 'INTERMEDIATE', NULL, NULL, '2025-04-13 09:19:07'),
(23, 10, 'G/H SCHOOL KOTLI NIJABAT', 2013, NULL, 'MATRIC', NULL, NULL, '2025-04-13 09:19:07'),
(24, 11, 'University of Gujrat Lahore Sub Campus', 2017, 2021, NULL, 'Software Engineering', NULL, '2025-04-13 09:34:46'),
(25, 12, 'University of Gujrat Lahore Sub Campus', 2017, 2021, 'Software Engineering', NULL, NULL, '2025-04-13 09:38:56'),
(26, 13, 'comsats university islamabad sahiwal campus', 2017, 2021, 'Bachelor of science in software Engineering', NULL, NULL, '2025-04-13 10:09:22'),
(27, 15, 'Government College University', 2015, 2019, 'BS', 'Computer Science', '2.80', '2025-04-13 10:15:58'),
(28, 16, 'Lahore Garrison University', NULL, NULL, 'BSCS', 'web design and Development', NULL, '2025-04-13 10:17:04'),
(29, 16, 'House Of Proffessionals', 2019, 2019, NULL, NULL, '9.99', '2025-04-13 10:17:04'),
(30, 17, 'Punjab College SGD', 2017, 2019, NULL, NULL, NULL, '2025-04-13 12:13:21'),
(31, 17, 'Govt High School No. 1', 2015, 2017, 'Matric', 'Science', NULL, '2025-04-13 12:13:21'),
(32, 17, 'Virtual University.', 2022, NULL, NULL, 'Computer Science', NULL, '2025-04-13 12:13:21'),
(33, 18, 'UNIVERSITY OF OKARA', NULL, 2020, 'BSIT', 'Advance Web Development', '3.30', '2025-04-13 12:20:06'),
(34, 18, 'PUNJAB GROUP OF COLLEGES (MULTAN)', NULL, 2015, 'Intermediate', NULL, NULL, '2025-04-13 12:20:06'),
(35, 18, 'G/H SCHOOL KOTLI NIJABAT', NULL, 2013, 'Matric', NULL, NULL, '2025-04-13 12:20:06'),
(36, 19, 'Government College University, Faisalabad', 2015, 2019, 'BS', 'Computer Science', '2.80', '2025-04-14 10:33:51'),
(37, 19, 'Govt. High School No#1,PirMahal.', NULL, NULL, 'Matric', 'Physics, Chemistry, Mathematics and Biology', '4.00', '2025-04-14 10:33:51'),
(38, 19, 'Govt. Fareed Buksh Gousia Degree Science College 333GB', NULL, NULL, 'FSC (Pre-Eng.)', 'Physics, Math, Chemistry and English', NULL, '2025-04-14 10:33:51'),
(39, 20, 'University of SINDH Jamshoro', 2010, 2014, 'BS Software Engineering', NULL, NULL, '2025-04-14 10:36:38'),
(40, 21, 'Mehran University of Engineering and Technology', 2017, 2019, 'Bachelor of Science', 'Software Engineering', NULL, '2025-04-15 09:57:50'),
(41, 22, 'Ladoke Akintola University of Technology', 2003, 2003, 'M.B.,B.S.', NULL, NULL, '2025-04-15 10:01:04'),
(42, 22, 'Wesley College of Science', 1994, 1994, NULL, NULL, NULL, '2025-04-15 10:01:04'),
(43, 22, 'Omolewa Nursery and Primary School', 1988, 1988, NULL, NULL, NULL, '2025-04-15 10:01:04'),
(44, 23, 'Christ University', NULL, 2016, 'MBA', NULL, '7.10', '2025-04-15 15:23:06'),
(45, 23, 'Government Engineering College Bikaner, Rajasthan', 2011, NULL, 'B.Tech', 'Computer Engineering', '9.99', '2025-04-15 15:23:06'),
(46, 23, 'Seedling Public School', NULL, 2007, '12th', NULL, '9.99', '2025-04-15 15:23:06'),
(47, 23, 'Seedling Public School', NULL, 2005, '10th', NULL, '9.99', '2025-04-15 15:23:06'),
(48, 24, 'Eton University', 2013, NULL, 'Certified Diploma', 'Mini MBA', NULL, '2025-04-15 15:28:58'),
(49, 24, 'Alexandria University', 1997, 2002, 'Bachelor of Business Administration', 'Faculty of Commerce', NULL, '2025-04-15 15:28:58'),
(50, 24, 'Arab academy for Business & sciences', 2000, NULL, 'Course', 'MIS', NULL, '2025-04-15 15:28:58'),
(51, 24, 'American Centre –British council', 2000, NULL, 'Course', 'English', NULL, '2025-04-15 15:28:58'),
(52, 24, 'Famous English school of Lycée Liberty', 1996, 1997, 'High School', NULL, NULL, '2025-04-15 15:28:58'),
(53, 25, 'Eton University', 2013, NULL, 'Certified Diploma', 'Mini MBA', NULL, '2025-04-16 07:48:39'),
(54, 25, 'Alexandria University', 1997, 2002, 'Bachelor of Business Administration', 'Commerce', NULL, '2025-04-16 07:48:39'),
(55, 25, 'Arab Academy for Business & Sciences', 2000, NULL, 'Course', 'MIS', NULL, '2025-04-16 07:48:39'),
(56, 25, 'American Centre – British Council', 2000, NULL, 'Course', 'English', NULL, '2025-04-16 07:48:39'),
(83, 52, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-04-30 07:38:05'),
(84, 53, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-04-30 08:15:07'),
(85, 54, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-07-02 08:50:46'),
(86, 55, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-07-02 09:30:56'),
(87, 56, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-07-02 09:44:41'),
(92, 63, 'University Of Sargodha', 2019, 2023, 'Bachelor of Science', 'Software Engineering', '3.74', '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_experience`
--

CREATE TABLE `cvs_experience` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_experience`
--

INSERT INTO `cvs_experience` (`id`, `cv_id`, `position`, `company`, `duration`, `responsibilities`, `location`, `created_at`) VALUES
(1, 1, 'Tutor', 'Learning Tution Center', '2017 - Present', '[\"Establishing clear and open lines of communication with students and their parents to provide updates on progress, address concerns, and offer constructive feedback.\",\"Utilizing various teaching methods and strategies to accommodate diverse learning styles and abilities, ensuring all students have an equal opportunity to succeed.\",\"Regularly evaluating student performance through assessments, quizzes, and assignments to identify areas for improvement and track progress over time.\"]', NULL, '2025-04-13 06:03:02'),
(2, 1, 'Director Management', 'Ultimo (Event)', '2022 - 2023', '[]', NULL, '2025-04-13 06:03:02'),
(3, 1, 'Director Media', 'EasyBazaar (Startup)', NULL, '[]', NULL, '2025-04-13 06:03:02'),
(4, 1, 'Director Management', 'WEI (Society)', 'February 2020', '[]', NULL, '2025-04-13 06:03:02'),
(5, 1, 'Director Media', 'SES (Society)', 'November 2019', '[]', NULL, '2025-04-13 06:03:02'),
(6, 1, 'Mobile Application Developer', 'FM MUET 92.6', '2023', '[\"Advanced coding skills in flutter/dart.\",\"Gaining hands-on experience in debugging and troubleshooting.\",\"Refined UI/UX design abilities, creating intuitive interfaces for optimal user interaction.\"]', NULL, '2025-04-13 06:03:02'),
(7, 2, 'Hospital Consultant', 'University College Hospital', 'February 2014 – to date', '[]', 'Ibadan', '2025-04-13 06:08:16'),
(8, 2, 'Senior Registrar', 'University College Hospital', 'May 2011 – January 2014', '[]', 'Ibadan', '2025-04-13 06:08:16'),
(9, 2, 'Registrar', 'UCH.', 'February 2008 – April 2011', '[]', 'Ibadan', '2025-04-13 06:08:16'),
(10, 2, 'Medical Officer', 'UCH.', 'August 2006 – January 2008', '[]', 'Ibadan', '2025-04-13 06:08:16'),
(11, 2, 'Medical officer (National Youth Service Corps)', 'Oyo State Hospitals Management Board', 'February 2005 – January 2006', '[]', 'Ibadan', '2025-04-13 06:08:16'),
(12, 2, 'House officer', 'Baptist Medical Centre', 'January 2004 – January 2005', '[]', 'Ogbomosho, Oyo State', '2025-04-13 06:08:16'),
(13, 5, 'PHP Developer', 'SE2 | COEUS SOLUTIONS LTD', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel\",\"Used AWS for SQS, S3, RDS, cloudwatch, Redis and used jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:01:31'),
(14, 5, 'Senior PHP Developer', 'PRISMATIC TECHNOLOGIES', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for there ongoing projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:01:31'),
(15, 5, 'Core PHP, Laravel Developer', 'ULTRAGROW', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:01:31'),
(16, 5, 'Web Developer', 'NESTERSKY', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML, CSS, BOOTSTRAP, JS and PHP practices.\",\"Validated code with Visual studio code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML, CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 09:01:31'),
(17, 6, 'Software Engineer', 'SE2 | Coeus Solutions Ltd', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel.\",\"Used AWS for SQS, S3, RDS, cloudwatch, Redis and used jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:01:52'),
(18, 6, 'Senior PHP Developer', 'Prismatic Technologies', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for there on going projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:01:52'),
(19, 6, 'Core PHP, Laravel Developer', 'Ultragrow', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:01:52'),
(20, 6, 'Web Developer', 'Nestersky', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML , CSS , BOOTSTRAP , JS and PHP practices.\",\"Validated code with Visual studio code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML ,CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 09:01:52'),
(21, 7, 'Developer', 'SE2 | COEUS SOLUTIONS LTD', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of PHP to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel.\",\"Used AWS for SQS, S3, RDS, CloudWatch, Redis and used Jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and Bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:03:01'),
(22, 7, 'Senior PHP Developer', 'PRISMATIC TECHNOLOGIES', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for ongoing projects (CRM).\",\"Used programming capabilities in Laravel (PHP) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:03:01'),
(23, 7, 'Core PHP, Laravel Developer', 'ULTRAGROW', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with team members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:03:01'),
(24, 7, 'Web Developer', 'NESTERSKY', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML, CSS, Bootstrap, JS and PHP practices.\",\"Validated code with Visual Studio Code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML, CSS & Bootstrap.\"]', NULL, '2025-04-13 09:03:01'),
(25, 8, 'SE2', 'COEUS SOLUTIONS LTD', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel\",\"Used AWS for SQS, S3, RDS, cloudwatch, Redis and used jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:04:50'),
(26, 8, 'SENIOR PHP DEVELOPER', 'PRISMATIC TECHNOLOGIES', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for their ongoing projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:04:50'),
(27, 8, 'CORE PHP, LARAVEL DEVELOPER', 'ULTRAGROW', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:04:50'),
(28, 8, 'WEB DEVELOPER', 'NESTERSKY', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML, CSS, BOOTSTRAP, JS and PHP practices.\",\"Validated code with Visual studio code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML, CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 09:04:50'),
(29, 9, 'Software Engineer', 'SE2 | Coeus Solutions Ltd', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel.\",\"Used AWS for SQS, S3, RDS, cloudwatch, Redis and used jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and Bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:17:50'),
(30, 9, 'Senior PHP Developer', 'Prismatic Technologies', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for there ongoing projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:17:50'),
(31, 9, 'Core PHP, Laravel Developer', 'Ultragrow', 'SEP 2020 - JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:17:50'),
(32, 9, 'Web Developer', 'Nestersky', 'OCT 2019 - SEP 2020', '[\"Created site layout and user interface using HTML, CSS, BOOTSTRAP, JS and PHP practices.\",\"Validated code with Visual Studio Code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML, CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 09:17:50'),
(33, 10, 'SE2', 'COEUS SOLUTIONS LTD', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel\",\"Used AWS for SQS, S3, RDS, cloudwatch, Redis and used jenkins for deployment in number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 09:19:07'),
(34, 10, 'SENIOR PHP DEVELOPER', 'PRISMATIC TECHNOLOGIES', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for their ongoing projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:19:07'),
(35, 10, 'CORE PHP ,LARAVEL DEVELOPER', 'ULTRAGROW', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 09:19:07'),
(36, 10, 'WEB DEVELOPER', 'NESTERSKY', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML, CSS, BOOTSTRAP, JS and PHP practices.\",\"Validated code with Visual studio code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built beautiful website interfaces with HTML ,CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 09:19:07'),
(37, 11, 'Php-Laravel Developer', 'Azure Innovations (Pakistan) Pvt.Ltd.', 'January, 2022 - Present', '[\"Worked on XOX Online Store and Self Care.\",\"Fixed different types of bugs on User\'s view and Middleware.\",\"Added new features in websites.\",\"Worked on Pindal E-commerce CMS and fixed bugs and added new features.\"]', 'DHA Phase 4 , Near Banker\'s Society , Lahore', '2025-04-13 09:34:46'),
(38, 11, 'Php-Laravel Intern', 'Azure Innovations (Pakistan) Pvt.Ltd.', 'October, 2021 - December, 2021', '[\"Worked on Pindal E-commerce CMS and fixed bugs and added new features.\",\"Worked on different tasks.\"]', 'DHA Phase 4 , Near Banker\'s Society , Lahore', '2025-04-13 09:34:46'),
(39, 12, 'Php-Laravel Developer', 'Azure Innovations (Pakistan) Pvt.Ltd.', 'January, 2022 - Present', '[\"Worked on XOX Online Store and Self Care\",\"Fixed different types of bugs on User\'s view and Middleware\",\"Added new features in websites\",\"Worked on Pindal E-commerce CMS fixing bugs and adding new features\"]', 'DHA Phase 4 , Near Banker\'s Society , Lahore', '2025-04-13 09:38:56'),
(40, 12, 'Php-Laravel Intern', 'Azure Innovations (Pakistan) Pvt.Ltd.', 'October, 2021 - December, 2021', '[\"Worked on Pindal E-commerce CMS fixing bugs and adding new features\",\"Worked on different tasks\"]', 'DHA Phase 4 , Near Banker\'s Society , Lahore', '2025-04-13 09:38:56'),
(41, 13, 'Backend developer', 'Techleadz', '02/2021 - Present', '[\"I am working on different projects as backend developer.\",\"I have worked on different backend languages including php , codigniter , laravel , coldfusion.\",\"I did work on different projects including Taskmania , ipunch , laymat etc.\"]', 'lahore', '2025-04-13 10:09:22'),
(42, 13, 'php developer', 'lempdo', '06/2020 - 01/2021', '[]', 'Faisalabad', '2025-04-13 10:09:22'),
(43, 15, 'PHP Laravel Developer / Full stack', 'Karsaaz Limited', '2 months', '[\"Performing web backend infrastructure.\",\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules\",\"Integration of data storage solutions.\"]', 'Lahore, Pakistan', '2025-04-13 10:15:58'),
(44, 15, 'Software Engineer', 'Tanbits', '1.2 years', '[\"Expertise in Elixir, Phoenix, PHP including laravel, lumen etc.\",\"Core skills include JavaScript, React, HTML, CSS and Node.js.\",\"Expertise in DBMS including Node.js ORM.\",\"Confident communicator, strategic thinker, and innovative creator.\",\"Strong knowledge of Software engineering.\"]', 'Lahore, Pakistan', '2025-04-13 10:15:58'),
(45, 15, 'Junior Software Engineer', 'Adrobz Solutions', '11 months', '[\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules.\"]', 'Lahore, Pakistan', '2025-04-13 10:15:58'),
(46, 15, 'PHP Web Developer', 'Axio limited', '1.2 years', '[\"Performing web backend infrastructure.\",\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules.\"]', 'Faisalabad, Pakistan', '2025-04-13 10:15:58'),
(47, 16, 'Laravel Developer', 'StackUp Solutions', '09/2021 - Present', '[]', 'office no:19 2nd floor big city plaza liberty round about gulberg 3, lahore', '2025-04-13 10:17:04'),
(48, 16, 'Laravel Developer', 'Coding Pixel USA', '02/2021 - 09/2021', '[]', '25 M, Johar Town, Lahore, 54770', '2025-04-13 10:17:04'),
(49, 17, 'Junior Developer', 'ADP Computer Science', '2022 - present', '[\"Web developer responsible for end-to-end web app development using PHP and Laravel.\"]', NULL, '2025-04-13 12:13:21'),
(50, 17, 'Web Developer', 'NexVisTech', '2022-present', '[]', NULL, '2025-04-13 12:13:21'),
(51, 17, 'Web Developer', 'Canva Solutions', '2021-2022', '[\"Built Ecommerce app using Laravel and Bootstrap.\",\"Built Learning management system using Laravel.\"]', NULL, '2025-04-13 12:13:21'),
(52, 17, 'Web Developer', 'Crave Tech.', '2020', '[]', NULL, '2025-04-13 12:13:21'),
(53, 18, 'Developer', 'SE2 | COEUS SULUTIONS LTD', 'DEC 2021 - Present', '[\"Utilized Symfony & Laravel - web frameworks of php to provide and maintain web/mobile solutions.\",\"Worked on 0Auth2.0 implementation and developed REST APIs using PHP in frameworks Symfony and Laravel\",\"Used AWS for SQS, S3, RDS, CloudWatch, Redis and used Jenkins for deployment in a number of products/projects.\",\"Explored Docker and Vagrant as VM.\",\"Explored Kibana, Grafana and Bugsnag for logging and statistical analysis.\",\"Implemented messaging system between distributed applications using AWS SQS and systemd daemons.\",\"Direct communication with clients in stand-ups as well as boot camps for demos and presentation of application\'s flow.\"]', NULL, '2025-04-13 12:20:06'),
(54, 18, 'Senior PHP Developer', 'PRISMATIC TECHNOLOGIES', 'JUN 2021 - DEC 2021', '[\"Dedicated developer for their ongoing projects (CRM).\",\"Used programming capabilities in Laravel(php) and other libraries/frameworks as needed.\",\"Collected defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 12:20:06'),
(55, 18, 'Core PHP, Laravel Developer', 'ULTRAGROW', 'SEP 2020 – JUN 2021', '[\"Accepted and completed in-person orders for front-end and back-end development.\",\"Worked with my team-members to resolve technical problems.\",\"Hands-on experience using Apache web servers and AWS.\",\"Used programming capabilities in JavaScript, jQuery, Ajax, PHP and other libraries/frameworks as needed.\",\"Collected, defined and translated user requirements into project designs and implementation plans.\",\"Used various software, including VS Code to make code repairs and optimize corporate website.\",\"Tested websites and performed troubleshooting prior to deployment.\"]', NULL, '2025-04-13 12:20:06'),
(56, 18, 'Web Developer', 'NESTERSKY', 'OCT 2019 – SEP 2020', '[\"Created site layout and user interface using HTML, CSS, BOOTSTRAP, JS and PHP practices.\",\"Validated code with Visual Studio Code and corrected issues.\",\"Oversaw troubleshooting of technical issues to solve problems within reasonable time-frame.\",\"Built very beautiful website interfaces with HTML, CSS & BOOTSTRAP.\"]', NULL, '2025-04-13 12:20:06'),
(57, 19, 'PHP Laravel Developer / Full stack', 'Karsaaz Limited', '2 months', '[\"Performing web backend infrastructure.\",\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules\",\"Integration of data storage solutions.\",\"Strong knowledge of PHP web frameworks (such as Laravel).\",\"Understanding of MVC design patterns.\",\"Familiarity with SQL/MySQL databases and their declarative query languages.\",\"Knowledge of object oriented PHP programming.\",\"Understanding the fully synchronous behavior of PHP.\",\"Integration of multiple data sources and databases into one system.\",\"ERP Development in laravel.\"]', 'Lahore, Pakistan', '2025-04-14 10:33:51'),
(58, 19, 'Software Engineer', 'Tanbits', '1.2 years', '[\"Expertise in Elixir,Phoenix,PHP including Laravel, Lumen.\",\"Core skills include JavaScript, React, HTML, CSS and Node.js.\",\"DBMS including Node.js ORM for PostgreSQL, MySQL, MariaDB, SQLite and Microsoft SQL Server.\",\"Expertise in Strapi CMS (Node JS), React Native and MongoDB.\",\"Worked on different projects for industries including E-commerce, point of sale, Real Estate and company websites in CMS like WordPress, Shopify and Wix.\",\"Confident communicator, strategic thinker, and innovative creator to develop software customized to meet a company’s organizational needs.\"]', 'Lahore, Pakistan', '2025-04-14 10:33:51'),
(59, 19, 'Junior Software Engineer', 'Adrobz Solutions', '11 months', '[\"Lumen API build.\",\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules\",\"Integration of data storage solutions.\",\"Strong knowledge of PHP web frameworks (such as Laravel).\",\"Understanding of MVC design patterns.\",\"Familiarity with SQL/MySQL databases and their declarative query languages.\",\"Knowledge of object oriented PHP programming.\",\"Understanding the fully synchronous behavior of PHP.\",\"Integration of multiple data sources and databases into one system.\",\"ERP Development in laravel.\"]', 'Lahore, Pakistan', '2025-04-14 10:33:51'),
(60, 19, 'PHP Web Developer', 'Axio Limited', '1.2 years', '[\"Performing web backend infrastructure.\",\"Basic understanding of front-end technologies, such as JavaScript, HTML5 and CSS3.\",\"Assist team in resolution of hardware, software and system issues.\",\"Build efficient, testable, and reusable PHP modules\",\"Integration of data storage solutions.\",\"Strong knowledge of PHP web frameworks (such as Laravel).\",\"Understanding of MVC design patterns.\",\"Familiarity with SQL/MySQL databases and their declarative query languages.\",\"Knowledge of object oriented PHP programming.\",\"Understanding the fully synchronous behavior of PHP.\",\"Integration of multiple data sources and databases into one system.\",\"ERP Development in laravel.\"]', 'Faisalabad, Pakistan', '2025-04-14 10:33:51'),
(61, 20, 'PHP Laravel Website Developer', 'Fiverr, Freelance, Upwork', 'Jun-2020 - Continue', '[\"Working as client requires\",\"Helped Developed new business logic\"]', NULL, '2025-04-14 10:36:38'),
(62, 20, 'TEAM LEAD - PHP', 'Savi Tech Pvt. Ltd, Karachi', 'Nov 2019 - June 2020 (8 Month)', '[\"Using Laravel, Core PHP, MYSQL & JQUERY, JSON\",\"Develop CRM Medical Dashboard.\",\"Helped develop new business logic\"]', 'Karachi', '2025-04-14 10:36:38'),
(63, 20, 'Software Engineer - PHP', 'Digitonics Labs Pvt. Ltd, Karachi', 'Nov 2018 - Nov 2019 (1 Year)', '[\"Using Codeigniter MVC & HMVC Pattern, Core PHP, MYSQL & JQUERY, JSON.\",\"Develop LiveChat Dashboard Using LiveChatInc API.\",\"Develop CallAnswer24 Dashboard Using Twilio API.\",\"Designed database ERD\",\"Helped develop new business logic\"]', 'Karachi', '2025-04-14 10:36:38'),
(64, 20, 'Software Engineer - PHP', 'KBM, London', 'Jan 2017 - Dec 2018 (2 Years)', '[\"Using Codeigniter MVC & HMVC Pattern, Core PHP, MYSQL & JQUERY, JSON.\",\"Develop LMS - Learning Management System\",\"Develop JobPortal\"]', 'London', '2025-04-14 10:36:38'),
(65, 20, 'PHP Developer', 'BRILLIANT I.T SOLUTION, Karachi', 'Feb 2016 - Feb 2017 (1 Year)', '[\"Develop management portal Noorani Cargo Services\",\"Develop management portal Sabz Traders\",\"Develop management portal Rescue Security\"]', 'Karachi', '2025-04-14 10:36:38'),
(66, 20, 'PHP Developer', 'INCISIVE SOFT, Karachi', 'Sep 2015 - Feb 2016', '[\"Develop Human Resource Management System (HRM)\",\"Develop Finance Management System (FMS)\",\"Develop Learning Management System (LMS)\",\"Develop School College Management System (SCM)\",\"Develop Broker Management System (BMS)\",\"Develop Industrial Link International (ILI)\"]', 'Karachi', '2025-04-14 10:36:38'),
(67, 20, 'PHP Developer', 'HIST, Jamshoro', 'Feb 2015 - Aug 2015', '[\"Using Codeigniter MVC & HMVC Pattern, Core PHP, MYSQL & JQUERY, JSON, HTML, Bootstrap.\",\"Develop ONLINE DOCTOR APPOINTMENT SYSTEM\",\"Develop STUDENT RECORD MANAGEMENT SYSTEM\",\"Develop Social Network Site (Be Friend)\"]', 'Jamshoro', '2025-04-14 10:36:38'),
(68, 21, 'Tutor', 'Learning Tution Center', '2017 - Present', '[]', NULL, '2025-04-15 09:57:50'),
(69, 21, 'Director Management', 'Ultimo (Event)', '2022 - 2023', '[]', NULL, '2025-04-15 09:57:50'),
(70, 21, 'Director Media', 'EasyBazaar (Startup)', NULL, '[]', NULL, '2025-04-15 09:57:50'),
(71, 21, 'Director Management', 'WEI (Society)', 'February 2020', '[]', NULL, '2025-04-15 09:57:50'),
(72, 21, 'Director Media', 'SES (Society)', 'November 2019', '[]', NULL, '2025-04-15 09:57:50'),
(73, 21, 'Mobile Application Developer', NULL, '2023', '[]', NULL, '2025-04-15 09:57:50'),
(74, 22, 'Hospital Consultant', 'University College Hospital', 'February 2014 – to date', '[]', 'Ibadan', '2025-04-15 10:01:04'),
(75, 22, 'Senior Registrar', 'University College Hospital', 'May 2011 – January 2014', '[]', 'Ibadan', '2025-04-15 10:01:04'),
(76, 22, 'Registrar', 'University College Hospital', 'February 2008 – April 2011', '[]', 'Ibadan', '2025-04-15 10:01:04'),
(77, 22, 'Medical Officer', 'University College Hospital', 'August 2006 – January 2008', '[]', 'Ibadan', '2025-04-15 10:01:04'),
(78, 22, 'Medical Officer (National Youth Service Corps)', 'Oyo State Hospitals Management Board', 'February 2005 – January 2006', '[]', 'Ibadan', '2025-04-15 10:01:04'),
(79, 22, 'House Officer', 'Baptist Medical Centre', 'January 2004 – January 2005', '[]', 'Ogbomosho, Oyo State', '2025-04-15 10:01:04'),
(80, 23, 'Business Analyst – Chatbots', 'SITSL', 'September 2017 - till date', '[\"Involved in managing projects to ensure timely delivery.\",\"Understanding client’s requirements.\",\"Working with project team members (developers, designers, quality analysts) to arrive at the solution.\",\"Prioritizing of work.\",\"Working closely with developers to facilitate the timely delivery while ensuring that the desired business requirements of the client are met.\",\"Involved in all phases of Software Development for multiple chatbot projects involving domains like ecommerce, BFSI.\"]', NULL, '2025-04-15 15:23:06'),
(81, 23, 'Client Management', 'CFL', 'June 2016 to September 2017', '[\"Offering solutions for existing clients and also pursuing new clientele opportunities.\",\"Develop client – business relationships.\",\"Informing potential clients about company’s products and services.\"]', NULL, '2025-04-15 15:23:06'),
(82, 23, 'Systems Engineer /Associate', 'TCS – Tata Consultancy Services', 'December 2011 to April 2014', '[\"Worked for a leading BFSI Client.\",\"Soap – testing web services.\",\"Testing Customer Alerts for mobile/email – in testing environment.\",\"Doing Account – Email Mapping in test db.\",\"Making sure that requirement changes are delivered within the timeline.\",\"Sending status reports to pm’s.\",\"Being on call with multiple teams to understand the issue.\",\"Discussing technical issues with project pm’s and taking a quick action accordingly.\"]', NULL, '2025-04-15 15:23:06'),
(83, 24, 'Business Development Manager', 'Mesila Real Estate \"Al ESAYI\"', '2018 - Present', '[\"Responsible for the Project management, Business development & Property marketing delivery through creating & designing effective strategies.\",\"Prepares cooperate proposals, business plans, visibility studies for upcoming projects focusing on financial gain and customer satisfaction.\",\"Work with leadership team to develop strategy leads to Sales through effective plans, keep eyes on sales activities, measure sales & provide feedback and after-sales support.\",\"Conduct research to identify new markets and customer needs, arrange business meetings with prospective client, Build long-term relationships with new and existing clients.\",\"Develop new reports and dashboards that highlight on critical data, cooperate revenue.\",\"Prepare sales contracts & corporate alliance under law, established rules.\",\"Determine new opportunities by analyzing business needs develop as plots, Commercial & residential buildings through market analysis & accurate reports to company stakeholders.\"]', 'Cairo, Egypt', '2025-04-15 15:28:58'),
(84, 24, 'Licensed Real Estate Broker', 'DAMAC Properties-Azizi Development', NULL, '[]', 'Dubai, United Arab Emirates', '2025-04-15 15:28:58'),
(85, 24, 'Sales Leasing Manager', 'ANRG', '2017 - 2018', '[\"Sales & Leasing for others with good connections dealing with Brokers, prospected tenants, Investors & Landlords.\",\"Follow all leasing activities including Legal & administration.\",\"Monitoring the sales team & evaluate their monthly KPI through sales & customer satisfaction.\",\"Set Marketing plans offline & online to build around developing new business growth.\",\"Managing properties process through government authorities, and physical capital assets required and used to build, repair, and maintain end item delivery.\",\"Interface with existing strategic customers to solidify mutual expectations of performance & growth.\",\"Handling a portfolio of 1000 residential units includes 45 villas, 200 commercial units includes Shopping malls, warehouses & offices with total assets more than 600M AED.\"]', 'Dubai, United Arab Emirates', '2025-04-15 15:28:58'),
(86, 24, 'Property Development Manager', 'Torus investment', '2014 - 2017', '[\"Dealing with Brokers, Banks, Investors, Landlords, consultants, contractors & architectures.\",\"Locates potential business deals by contacting potential customers; discovering and exploring opportunities, proactively initiate and engage sales calls to new prospects.\",\"Negotiate lease & sales contracts with contractors in a timely and reliable manner, Oversee the properties by Inspecting and arranging maintenance to meet standards.\",\"Collect receivable accounts and handle operating expenses.\",\"Develop and manage annual budgets by forecasting requirements and analyzing variances, data.\",\"Interface with existing strategic customers to solidify mutual expectations of performance & growth.\",\"Handling a portfolio of 500 residential units includes 5 villas, 50 commercial units includes Shops, labor camps, warehouses & offices with total assets more than 100M AED.\",\"Work closely with general manager, finance manager conducting visibility forecast for potential new and current properties.\"]', 'Dubai, United Arab Emirates', '2025-04-15 15:28:58'),
(87, 24, 'Sales Account Manager', 'XAD Technologies LLC', '2011 - 2014', '[\"Giving presentations, demonstrations, conducting evaluations, preparing proposals, responding to RFPs, follow up Tenders, etc.\",\"Identifies trendsetter ideas by researching industry and related events, publications, and announcements; tracking individual contributors and their accomplishments.\",\"Locates or proposes potential business deals by contacting potential partners; discovering and exploring opportunities.\",\"Screens potential business deals by analyzing market strategies, deal requirements, potential, and financials; evaluating options; resolving internal priorities; recommending equity investments.\",\"Develops negotiating strategies and positions by studying integration of new venture with company strategies and operations; examining risks and potentials; estimating partners\' needs and goals through C level managers.\",\"Enhances organization reputation by accepting ownership for accomplishing new and different requests; exploring opportunities to add value to job accomplishments.\"]', 'Dubai, United Arab Emirates', '2025-04-15 15:28:58'),
(88, 24, 'Business Development Executive', 'Cosmetradeco', '2005 - 2011', '[\"Direct and coordinate activities of businesses, Promotions pricing, sales, and distribution of products.\",\"Review financial statements, sales and activity reports, and other performance data to measure productivity and goal achievement and to determine areas needing cost reduction and program improvement.\",\"Direct and coordinate organization\'s financial and budget activities to fund operations, maximize investments, and increase efficiency.\",\"Determine goods and services to be sold, and set prices and credit terms, based on forecasts of customer demand.\",\"Plan and direct activities such as sales promotions, coordinating with other department.\",\"Direct non-merchandising departments of businesses, such as advertising and purchasing.\"]', 'Alexandria, Egypt', '2025-04-15 15:28:58'),
(89, 24, 'Sales & Marketing Specialist', 'United Company of Pharmacies (UCP)', '2002 - 2005', '[]', 'Alexandria, Egypt', '2025-04-15 15:28:58'),
(90, 25, 'Business Development Manager', 'Mesila Real Estate “Al ESAYI”', '2018 - Present', '[\"Responsible for project management, business development & property marketing delivery through creating & designing effective strategies.\",\"Prepares cooperate proposals, business plans, visibility studies for upcoming projects focusing on financial gain and customer satisfaction.\",\"Work with leadership team to develop strategy leads to sales through effective plans.\",\"Conduct research to identify new markets and customer needs.\",\"Build long-term relationships with new and existing clients.\"]', 'Cairo, EGYPT', '2025-04-16 07:48:39'),
(91, 25, 'Licensed Real Estate Broker', 'DAMAC Properties-Azizi Development', NULL, '[]', 'Dubai, United Arab Emirates', '2025-04-16 07:48:39'),
(92, 25, 'Sales Leasing Manager', 'ANRG', '2017 - 2018', '[\"Sales & Leasing for others with good connections dealing with brokers, prospective tenants, investors & landlords.\",\"Follow all leasing activities including legal & administration.\",\"Monitoring the sales team & evaluate their monthly KPI through sales & customer satisfaction.\"]', 'Dubai, United Arab Emirates', '2025-04-16 07:48:39'),
(93, 25, 'Property Development Manager', 'Torus investment', '2014 - 2017', '[\"Dealing with brokers, banks, investors, landlords, consultants, contractors & architects.\",\"Locates potential business deals by contacting potential customers.\",\"Negotiate lease & sales contracts with contractors.\"]', 'Dubai, United Arab Emirates', '2025-04-16 07:48:39'),
(94, 25, 'Sales Account Manager', 'XAD Technologies LLC', '2011 - 2014', '[\"Giving presentations, demonstrations, conducting evaluations, preparing proposals, responding to RFPs.\",\"Identifies trendsetter ideas by researching industry events and publications.\"]', 'Dubai, United Arab Emirates', '2025-04-16 07:48:39'),
(95, 25, 'Business Development Executive', 'Cosmetradeco', '2005 - 2011', '[\"Direct and coordinate activities of businesses, promotions pricing, sales, and distribution of products.\"]', 'Alexandria, Egypt', '2025-04-16 07:48:39'),
(96, 25, 'Sales & Marketing Specialist', 'United Company of Pharmacies (UCP)', '2002 - 2005', '[]', 'Alexandria, Egypt', '2025-04-16 07:48:39'),
(107, 35, 'Frontend React Developer Intern', 'Eziline Software House', 'Jul-Dec 2023', '[\"Cooperate with designers to create clean interfaces.\",\"Develop project concepts and maintain optimal workflow.\",\"Actively engaging with senior developers to manage large design projects and carrying out quality assurance tests.\"]', 'Remote', '2025-04-29 10:21:55'),
(134, 52, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Developing User Interfaces: Building responsive UI Components using React.\",\"Working with APIs: Fetching data from RESTful APIs and integrating it into the frontend.\",\"Debugging and Troubleshooting: Identifying and fixing frontend bugs.\",\"Collaborating with teams: Working with design and backend teams to integrate frontend features.\",\"Implementing state management: Managing application state using React hooks or Redux.\",\"Testing and Quality assurance: Writing unit tests for React Components.\",\"Code Review and Refactoring: Participating in code reviews and improving existing code.\",\"Responsive Design: Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-04-30 07:38:05'),
(135, 53, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Building responsive UI Components using React.\",\"Fetching data from RESTful APIs and integrating it into the frontend.\",\"Identifying and fixing frontend bugs.\",\"Working with design and backend teams to integrate frontend features.\",\"Managing application state using React hooks or Redux.\",\"Writing unit tests for React Components.\",\"Participating in code reviews and improving existing code.\",\"Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-04-30 08:15:07'),
(136, 54, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Developing User Interfaces: Building responsive UI Components using React.\",\"Working with APIs: Fetching data from RESTful APIs and integrating it into the frontend.\",\"Debugging and Troubleshooting: Identifying and fixing frontend bugs.\",\"Collaborating with teams: Working with design and backend teams to integrate frontend features.\",\"Implementing state management: Managing application state using React hooks or Redux.\",\"Testing and Quality assurance: Writing unit tests for React Components.\",\"Code Review and Refactoring: Participating in code reviews and improving existing code.\",\"Responsive Design: Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-07-02 08:50:46'),
(137, 54, 'Frontend React Developer', 'Keydevs Technologies', 'Sep 2024 – Current', '[\"Creating Responsive Interfaces: Designing adaptable UI components using React for optimal display across devices.\",\"API Integration: Retrieving and incorporating data from RESTful APIs into the frontend seamlessly.\",\"Diagnosing and Resolving Issues: Detecting and addressing bugs within the frontend codebase.\",\"Team Collaboration: Partnering with design and backend teams to implement and enhance frontend features.\",\"State Management Implementation: Utilizing React hooks or Redux to efficiently handle application state.\",\"Testing and Assurance: Crafting unit tests to validate the functionality of React components.\",\"Code Review and Optimization: Engaging in code review sessions and refining existing code for performance improvements.\"]', 'Onsite', '2025-07-02 08:50:46'),
(138, 55, 'Frontend React Developer Intern', 'Eziline Software House Rawalpindi', 'July 2023 – Dec 2023', '[\"Building responsive UI Components using React.\",\"Fetching data from RESTful APIs and integrating it into the frontend.\",\"Identifying and fixing frontend bugs.\",\"Working with design and backend teams to integrate frontend features.\",\"Managing application state using React hooks or Redux.\",\"Writing unit tests for React Components.\",\"Participating in code reviews and improving existing code.\",\"Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-07-02 09:30:56'),
(139, 55, 'Frontend React Developer', 'Keydevs Technologies Lahore', 'Sep 2024 – Current', '[\"Designing adaptable UI components using React for optimal display across devices.\",\"Retrieving and incorporating data from RESTful APIs into the frontend seamlessly.\",\"Detecting and addressing bugs within the frontend codebase.\",\"Partnering with design and backend teams to implement and enhance frontend features.\",\"Utilizing React hooks or Redux to efficiently handle application state.\",\"Crafting unit tests to validate the functionality of React components.\",\"Engaging in code review sessions and refining existing code for performance improvements.\"]', 'Onsite', '2025-07-02 09:30:56'),
(140, 56, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Developing User Interfaces: Building responsive UI Components using React.\",\"Working with APIs: Fetching data from RESTful APIs and integrating it into the frontend.\",\"Debugging and Troubleshooting: Identifying and fixing frontend bugs.\",\"Collaborating with teams: Working with design and backend teams to integrate frontend features.\",\"Implementing state management: Managing application state using React hooks or Redux.\",\"Testing and Quality assurance: Writing unit tests for React Components.\",\"Code Review and Refactoring: Participating in code reviews and improving existing code.\",\"Responsive Design: Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-07-02 09:44:41'),
(141, 56, 'Frontend React Developer', 'Keydevs Technologies', 'Sep 2024 – Current', '[\"Creating Responsive Interfaces: Designing adaptable UI components using React for optimal display across devices.\",\"API Integration: Retrieving and incorporating data from RESTful APIs into the frontend seamlessly.\",\"Diagnosing and Resolving Issues : Detecting and addressing bugs within the frontend codebase.\",\"Team Collaboration: Partnering with design and backend teams to implement and enhance frontend features.\",\"State Management Implementation: Utilizing React hooks or Redux to efficiently handle application state.\",\"Testing and Assurance: Crafting unit tests to validate the functionality of React components.\",\"Code Review and Optimization: Engaging in code review sessions and refining existing code for performance improvements.\"]', 'Onsite', '2025-07-02 09:44:41'),
(142, 59, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Building responsive UI Components using React.\",\"Fetching data from RESTful APIs and integrating it into the frontend.\",\"Identifying and fixing frontend bugs.\",\"Working with design and backend teams to integrate frontend features.\",\"Managing application state using React hooks or Redux.\",\"Writing unit tests for React Components.\",\"Participating in code reviews and improving existing code.\",\"Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-07-02 10:28:18'),
(150, 63, 'Frontend React Developer Intern', 'Eziline Software House', 'July 2023 – Dec 2023', '[\"Building responsive UI Components using React.\",\"Fetching data from RESTful APIs and integrating it into the frontend.\",\"Identifying and fixing frontend bugs.\",\"Working with design and backend teams to integrate frontend features.\",\"Managing application state using React hooks or Redux.\",\"Writing unit tests for React Components.\",\"Participating in code reviews and improving existing code.\",\"Ensuring mobile-friendly and cross-browser compatibility.\"]', 'Remote', '2025-07-02 10:51:27'),
(151, 63, 'Frontend React Developer', 'Keydevs Technologies', 'Sep 2024 – Current', '[\"Designing adaptable UI components using React for optimal display across devices.\",\"Retrieving and incorporating data from RESTful APIs into the frontend seamlessly.\",\"Detecting and addressing bugs within the frontend codebase.\",\"Partnering with design and backend teams to implement and enhance frontend features.\",\"Utilizing React hooks or Redux to efficiently handle application state.\",\"Crafting unit tests to validate the functionality of React components.\",\"Engaging in code review sessions and refining existing code for performance improvements.\"]', 'Lahore', '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_extra`
--

CREATE TABLE `cvs_extra` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `programming_languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`programming_languages`)),
  `foreign_languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`foreign_languages`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_extra`
--

INSERT INTO `cvs_extra` (`id`, `cv_id`, `programming_languages`, `foreign_languages`, `created_at`) VALUES
(1, 1, '{\"tools\": [], \"languages\": [\"Java\", \"C++\", \"Flutter\"], \"methodologies\": []}', '[{\"level\": null, \"language\": \"English\"}, {\"level\": null, \"language\": \"Urdu\"}, {\"level\": null, \"language\": \"Sindhi\"}]', '2025-04-13 06:03:02'),
(2, 2, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-13 06:08:16'),
(3, 5, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-13 09:01:31'),
(4, 6, '{\"tools\": [\"Visual Studio Code\", \"Git\"], \"languages\": [\"PHP\", \"JavaScript\"], \"methodologies\": []}', '[]', '2025-04-13 09:01:52'),
(5, 7, '{\"tools\": [\"VS Code\", \"Docker\", \"Vagrant\"], \"languages\": [\"PHP\", \"JavaScript\"], \"methodologies\": []}', '[]', '2025-04-13 09:03:01'),
(6, 8, '{\"tools\": [\"Git\", \"VS Code\", \"Docker\", \"Jenkins\"], \"languages\": [\"PHP\", \"JavaScript\", \"HTML\", \"CSS\"], \"methodologies\": [\"Agile\", \"Scrum\"]}', '[]', '2025-04-13 09:04:50'),
(7, 9, '{\"tools\": [\"Git/Svn\", \"Docker\", \"Vagrant\"], \"languages\": [\"PHP\", \"HTML\", \"CSS\", \"JavaScript\", \"jQuery\", \"Ajax\"], \"methodologies\": [\"Agile\", \"Scrum\"]}', '[]', '2025-04-13 09:17:50'),
(8, 10, '{\"tools\": [\"AWS\", \"Docker\", \"Vagrant\"], \"languages\": [\"PHP\", \"HTML\", \"CSS\", \"JavaScript\"], \"methodologies\": []}', '[]', '2025-04-13 09:19:07'),
(9, 11, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[{\"level\": \"null\", \"language\": \"English\"}, {\"level\": \"null\", \"language\": \"Urdu\"}]', '2025-04-13 09:34:46'),
(10, 12, '{\"tools\": [], \"languages\": [\"PHP\", \"Laravel\", \"HTML\", \"CSS\", \"SCSS\", \"Bootstrap\", \"JQuery\", \"MySQL\", \"MongoDB\", \"React.js\"], \"methodologies\": []}', '[{\"level\": \"Proficient\", \"language\": \"English\"}, {\"level\": \"Proficient\", \"language\": \"Urdu\"}]', '2025-04-13 09:38:56'),
(11, 13, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[{\"level\": \"Full Professional Proficiency\", \"language\": \"English\"}, {\"level\": \"Full Professional Proficiency\", \"language\": \"urdu\"}, {\"level\": \"Full Professional Proficiency\", \"language\": \"Punjabi\"}]', '2025-04-13 10:09:22'),
(12, 14, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-13 10:13:21'),
(13, 15, '{\"tools\": [\"Laravel\", \"Lumen\", \"MySQL\", \"PostgreSQL\", \"React\", \"Node.js\"], \"languages\": [\"PHP\", \"JavaScript\", \"Elixir\"], \"methodologies\": []}', '[{\"level\": \"Native\", \"language\": \"English\"}, {\"level\": \"Beginner\", \"language\": \"Urdu\"}]', '2025-04-13 10:15:58'),
(14, 16, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[{\"level\": \"Native or Bilingual Proficiency\", \"language\": \"Punjabi\"}, {\"level\": \"Full Professional Proficiency\", \"language\": \"Urdu\"}, {\"level\": \"Professional Working Proficiency\", \"language\": \"English\"}]', '2025-04-13 10:17:04'),
(15, 17, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-13 12:13:21'),
(16, 18, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-13 12:20:06'),
(17, 19, '{\"tools\": [\"Laravel\", \"Lumen\", \"Phoenix\"], \"languages\": [\"PHP\", \"JavaScript\", \"Elixir\"], \"methodologies\": [\"MVC\"]}', '[{\"level\": \"Native\", \"language\": \"English\"}, {\"level\": \"Beginner\", \"language\": \"Urdu\"}]', '2025-04-14 10:33:51'),
(18, 20, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-14 10:36:38'),
(19, 21, '{\"tools\": [], \"languages\": [\"Java\", \"C++\", \"Flutter\"], \"methodologies\": []}', '[{\"level\": null, \"language\": \"English\"}, {\"level\": null, \"language\": \"Urdu\"}, {\"level\": null, \"language\": \"Sindhi\"}]', '2025-04-15 09:57:50'),
(20, 22, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-15 10:01:04'),
(21, 23, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[{\"level\": null, \"language\": \"English\"}, {\"level\": null, \"language\": \"Hindi\"}]', '2025-04-15 15:23:06'),
(22, 24, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-15 15:28:58'),
(23, 25, '{\"tools\": [], \"languages\": [], \"methodologies\": []}', '[]', '2025-04-16 07:48:39'),
(33, 35, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"CSS Modules\",\"Tailwind\",\"React\",\"Redux\",\"WordPress\",\"PHP\",\"Git\",\"SQL\"],\"tools\":[],\"methodologies\":[]}', '[{\"language\":\"Urdu\",\"level\":null},{\"language\":\"English\",\"level\":null}]', '2025-04-29 10:21:55'),
(50, 52, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-04-30 07:38:06'),
(51, 53, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-04-30 08:15:07'),
(52, 54, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-07-02 08:50:46'),
(53, 55, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-07-02 09:30:56'),
(54, 56, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-07-02 09:44:41'),
(55, 57, '{}', '[]', '2025-07-02 09:45:06'),
(56, 58, '{}', '[]', '2025-07-02 09:45:28'),
(62, 63, '{\"languages\":[\"JavaScript\",\"HTML\",\"CSS\",\"SQL\"],\"tools\":[\"Visual Studio\",\"Postman\",\"GIT\",\"Mongo DB Compass\",\"MySQL\"],\"methodologies\":[]}', '[{\"language\":\"English\",\"level\":\"Professional\"},{\"language\":\"Urdu\",\"level\":\"Native\"},{\"language\":\"Punjabi\",\"level\":\"Native\"}]', '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_internal_notes`
--

CREATE TABLE `cvs_internal_notes` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `note` text NOT NULL,
  `parent_note_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_internal_notes`
--

INSERT INTO `cvs_internal_notes` (`id`, `cv_id`, `user_id`, `note`, `parent_note_id`, `created_at`) VALUES
(1, 22, 2, 'hello', NULL, '2025-04-15 10:04:24'),
(2, 22, 2, 'it\'s okay', NULL, '2025-04-15 10:04:45'),
(3, 23, 2, 'nice cv', NULL, '2025-04-15 15:23:48'),
(5, 53, 2, 'jjhjkhjk', NULL, '2025-04-30 11:23:38'),
(6, 52, 8, '<p>hello</p>', NULL, '2025-05-01 06:45:50'),
(7, 52, 8, '<p><strong>hi</strong></p>', NULL, '2025-05-01 06:52:12'),
(8, 52, 8, '<p><strong>hy</strong></p>', NULL, '2025-05-01 06:56:18'),
(9, 52, 8, '<p>hiiiii</p>', NULL, '2025-05-01 06:56:29'),
(10, 52, 8, '<p>hiiiiii</p>', NULL, '2025-05-01 07:01:09');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_projects`
--

CREATE TABLE `cvs_projects` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`technologies`)),
  `url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_projects`
--

INSERT INTO `cvs_projects` (`id`, `cv_id`, `name`, `year`, `description`, `technologies`, `url`, `created_at`) VALUES
(1, 1, 'Tomato Leave Disease Detection App', 2022, 'Utilizes deep machine learning in its development. The frontend is constructed with Flutter/Dart technology.', '[\"Flutter\", \"Dart\"]', NULL, '2025-04-13 06:03:02'),
(2, 1, 'Online Blog Website', 2022, 'It is developed by using PHP and MySQL. It is a responsive web application.', '[\"PHP\", \"MySQL\"]', NULL, '2025-04-13 06:03:02'),
(3, 5, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:31'),
(4, 5, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:31'),
(5, 5, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:31'),
(6, 5, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:31'),
(7, 5, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:31'),
(8, 5, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:01:31'),
(9, 5, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:31'),
(10, 5, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:31'),
(11, 5, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:31'),
(12, 6, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:52'),
(13, 6, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:52'),
(14, 6, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:01:52'),
(15, 6, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:52'),
(16, 6, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:52'),
(17, 6, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:01:52'),
(18, 6, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:52'),
(19, 6, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:52'),
(20, 6, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:01:52'),
(21, 7, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:03:01'),
(22, 7, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:03:01'),
(23, 7, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:03:01'),
(24, 7, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:03:01'),
(25, 7, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:03:01'),
(26, 7, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:03:01'),
(27, 7, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:03:01'),
(28, 7, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:03:01'),
(29, 7, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:03:01'),
(30, 8, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:04:50'),
(31, 8, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:04:50'),
(32, 8, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:04:50'),
(33, 8, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:04:50'),
(34, 8, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:04:50'),
(35, 8, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:04:50'),
(36, 8, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:04:50'),
(37, 8, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:04:50'),
(38, 8, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:04:50'),
(39, 9, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:17:50'),
(40, 9, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:17:50'),
(41, 9, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:17:50'),
(42, 9, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:17:50'),
(43, 9, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:17:50'),
(44, 9, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:17:50'),
(45, 9, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:17:50'),
(46, 9, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:17:50'),
(47, 9, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:17:50'),
(48, 10, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:19:07'),
(49, 10, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:19:07'),
(50, 10, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 09:19:07'),
(51, 10, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:19:07'),
(52, 10, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:19:07'),
(53, 10, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 09:19:07'),
(54, 10, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:19:07'),
(55, 10, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:19:07'),
(56, 10, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 09:19:07'),
(57, 11, 'XOX Online Store', NULL, 'Maintained this project, fixed the bugs and added new features.', '[]', 'https://xox.com.my/onlinestore/user/index/prepaid-user/0', '2025-04-13 09:34:46'),
(58, 11, 'XOX Self Care', NULL, 'Maintained this project, fixed the bugs.', '[]', 'https://xox.com.my/selfcare/login', '2025-04-13 09:34:46'),
(59, 11, 'Pindal CMS', NULL, 'Maintained this project, fixed the bugs and added new features.', '[]', 'http://ec2-13-232-34-188.ap-south-1.compute.amazonaws.com/login', '2025-04-13 09:34:46'),
(60, 11, 'Black Admin', NULL, 'Created some pages in React.js and tried to learn react.js also fixed some errors.', '[]', 'http://18.139.84.232', '2025-04-13 09:34:46'),
(61, 12, 'XOX Online Store', NULL, 'Maintained this project, fixed bugs and added new features', '[]', 'https://xox.com.my/onlinestore/user/index/prepaid-user/0', '2025-04-13 09:38:56'),
(62, 12, 'XOX Self Care', NULL, 'Maintained this project, fixed the bugs', '[]', 'https://xox.com.my/selfcare/login', '2025-04-13 09:38:56'),
(63, 12, 'Pindal CMS', NULL, 'Maintained this project, fixed bugs and added new features', '[]', 'http://ec2-13-232-34-188.ap-south-1.compute.amazonaws.com/login', '2025-04-13 09:38:56'),
(64, 12, 'Black Admin', NULL, 'Created some pages in React.js and tried to learn react.js also fixed some errors', '[]', 'http://18.139.84.232', '2025-04-13 09:38:56'),
(65, 13, 'Hospital Managment', 2021, 'I did work on hospital managment project. Basically this project is managment of Hospital system includeing doctor appointment , patient details , patient number , patient time for checkup etc.', '[]', NULL, '2025-04-13 10:09:22'),
(66, 13, 'Pharmacy Managment', NULL, NULL, '[]', NULL, '2025-04-13 10:09:22'),
(67, 15, 'Karsaaz App', 2022, 'Book the most reliable and affordable professionals for home maintenance & repair.', '[\"Php\", \"laravel\", \"mysql\"]', 'https://karsaaz.app/', '2025-04-13 10:15:58'),
(68, 15, 'AlVelAl', 2021, 'Custom implementation of the Landscape Network.', '[\"Elixir\", \"Phoenix\", \"Phoenix LiveView\", \"PostgreSQL\"]', 'https://staging-alvelal.herokuapp.com/', '2025-04-13 10:15:58'),
(69, 15, 'Urbanave', 2021, 'Web scraping solution for accessing structured web data.', '[\"Elixir\", \"PostgreSQL\"]', 'https://search.theurbanavenue.com/', '2025-04-13 10:15:58'),
(70, 15, 'FnF accountant', 2021, 'Mobile app for managing company records.', '[\"laravel\", \"lumen\", \"mysql\", \"S3 Bucket\"]', 'https://accountantadmin.adrobz.com/', '2025-04-13 10:15:58'),
(71, 15, 'E Commerce Project', NULL, 'E-commerce web application.', '[\"PHP\", \"Mysql\"]', NULL, '2025-04-13 10:15:58'),
(72, 15, 'Gibbay', NULL, 'Website to buy and sell things.', '[\"Laravel\"]', 'https://www.gibbay.com/', '2025-04-13 10:15:58'),
(73, 15, 'Carfirst Auctions', NULL, 'Project related to auctions of cars.', '[\"Laravel\"]', 'http://167.99.179.244/carfirst-auctions/login', '2025-04-13 10:15:58'),
(74, 16, 'legal practice', NULL, NULL, '[]', NULL, '2025-04-13 10:17:04'),
(75, 16, 'lawyer portal', NULL, NULL, '[]', NULL, '2025-04-13 10:17:04'),
(76, 16, 'Aux App', NULL, NULL, '[]', 'https://aux.app/', '2025-04-13 10:17:04'),
(77, 16, 'Collegize App', NULL, NULL, '[]', 'https://www.collegize.org/collegizetheapp', '2025-04-13 10:17:04'),
(78, 16, 'Dutchpot App', NULL, NULL, '[]', 'https://dutchpotrestaurants.com/', '2025-04-13 10:17:04'),
(79, 16, 'Miracle Leaf', NULL, NULL, '[]', 'https://miracleleaffl.com/', '2025-04-13 10:17:04'),
(80, 18, 'Smart widget', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 12:20:06'),
(81, 18, 'Feedback engagement', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 12:20:06'),
(82, 18, 'Connect', NULL, NULL, '[\"Symfony\"]', NULL, '2025-04-13 12:20:06'),
(83, 18, 'E-learning System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 12:20:06'),
(84, 18, 'E-commerce Websites', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 12:20:06'),
(85, 18, 'Society Management System', NULL, NULL, '[\"Core PHP\"]', NULL, '2025-04-13 12:20:06'),
(86, 18, 'Point of Sale System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 12:20:06'),
(87, 18, 'Event Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 12:20:06'),
(88, 18, 'Gym Management System', NULL, NULL, '[\"Laravel\"]', NULL, '2025-04-13 12:20:06'),
(89, 19, 'Karsaaz App', NULL, 'Karsaaz App is to book the most Reliable and Affordable Professionals for home maintenance & repair. It includes Electricians, Plumbers, Carpenters, and more in Lahore, Karachi, Islamabad and Pindi.', '[\"Php\", \"Laravel\", \"MySQL\"]', 'https://karsaaz.app/', '2025-04-14 10:33:51'),
(90, 19, 'AlVelAl', NULL, 'Custom implementation of the Landscape Network where person and organizational add their data and we show their data on sigpac and map.', '[\"Elixir\", \"Phoenix\", \"PostgreSQL\"]', 'https://staging-alvelal.herokuapp.com/', '2025-04-14 10:33:51'),
(91, 19, 'Urbanave', NULL, 'Web scraping solution providing access to structured web data in an automated fashion.', '[\"Elixir\", \"PostgreSQL\"]', 'https://search.theurbanavenue.com/', '2025-04-14 10:33:51'),
(92, 19, 'FnF accountant', NULL, 'A mobile app for managing company records, images, taxes, and earnings.', '[\"Laravel\", \"Lumen\", \"MySQL\", \"S3 Bucket\"]', 'https://accountantadmin.adrobz.com/', '2025-04-14 10:33:51'),
(93, 19, 'E Commerce Project', NULL, 'E-commerce project developed from scratch, with user login and product display functionalities.', '[\"PHP\", \"MySQL\"]', NULL, '2025-04-14 10:33:51'),
(94, 19, 'Gibbay', NULL, 'Website to buy and sell things.', '[\"Laravel\"]', 'https://www.gibbay.com/', '2025-04-14 10:33:51'),
(95, 19, 'Carfirst Auctions', NULL, 'Project related to auctions of cars.', '[\"Laravel\"]', 'http://167.99.179.244/carfirst-auctions/login', '2025-04-14 10:33:51'),
(96, 21, 'Tomato Leave Disease Detection App', 2022, 'Utilizes deep machine learning in its development. The frontend is constructed with Flutter/Dart technology.', '[\"Flutter\", \"Dart\"]', NULL, '2025-04-15 09:57:50'),
(97, 21, 'Online Blog Website', 2022, 'It is developed by using php and mysql. It is a responsive web application.', '[\"PHP\", \"MySQL\"]', NULL, '2025-04-15 09:57:50'),
(98, 23, 'E-commerce Chatbot', NULL, 'Developing chatbot where users can browse products, see product information and buy them', '[]', NULL, '2025-04-15 15:23:06'),
(99, 23, 'Chatbot for Investment company', NULL, 'Developing chatbot where existing customers can download their statements.', '[]', NULL, '2025-04-15 15:23:06'),
(100, 23, 'Chatbot for Vehicle Financing', NULL, 'Developing chatbot where user’s can see FAQ’s, existing customers can download their statements, schedule, view loan details.', '[]', NULL, '2025-04-15 15:23:06'),
(101, 23, 'Chatbot for Financial Services', NULL, 'Developing chatbot where existing customers can get their statements, view loan details, check loan status etc.', '[]', NULL, '2025-04-15 15:23:06'),
(102, 23, 'Chatbot for Vehicle Insurance', NULL, 'Developing chatbot where existing customers can view/download their policy.', '[]', NULL, '2025-04-15 15:23:06'),
(123, 35, 'CyberCrime Attacks Ontology', NULL, 'An ontology that represents the comprehensive knowledge about different attacks like their best defences, prevention and detection techniques and vulnerabilities. Purpose is to offer accessible information to individuals who are new to the field, students, and domain experts.', '[]', NULL, '2025-04-29 10:21:55'),
(124, 35, 'Ezitech Courses Site', NULL, 'An online learning platform offering a diverse range of courses, empowering learners with practical skills in different fields.', '[]', NULL, '2025-04-29 10:21:55'),
(171, 52, 'Capstone Project CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[]', NULL, '2025-04-30 07:38:05'),
(172, 52, 'Ezitech Courses Site', NULL, 'Built an online learning platform offering a diverse range of courses, empowering learners with practical skills in different fields.', '[\"Visual Studio\",\"React\"]', NULL, '2025-04-30 07:38:05'),
(173, 52, 'EzilineShop Site', NULL, 'Created an Ecommerce platform for selling Eziline Products.', '[\"Visual Studio\",\"React\"]', NULL, '2025-04-30 07:38:05'),
(174, 52, 'PizzaPal', NULL, 'Developed a site for customizing and ordering pizzas with seamless delivery.', '[\"Visual Studio\",\"React\"]', NULL, '2025-04-30 07:38:05'),
(175, 53, 'CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[]', NULL, '2025-04-30 08:15:07'),
(176, 53, 'Ezitech Courses Site', NULL, 'Built an online learning platform offering a diverse range of courses, empowering learners with practical skills in different fields.', '[]', NULL, '2025-04-30 08:15:07'),
(177, 53, 'EzilineShop Site', NULL, 'Created an Ecommerce platform for selling Eziline Products.', '[]', NULL, '2025-04-30 08:15:07'),
(178, 53, 'PizzaPal', NULL, 'Developed a site for customizing and ordering pizzas with seamless delivery.', '[]', NULL, '2025-04-30 08:15:07'),
(179, 54, 'Lawyyar AI Website', NULL, 'Developed a platform for lawyers to manage cases, schedule hearing dates, and upload files for data extraction. Integrated AI to act as a virtual judge, analyzing inputs from both parties and providing responses.', '[\"React\"]', NULL, '2025-07-02 08:50:46'),
(180, 54, 'AuraInterview Site', NULL, 'Built a platform where users upload their CVs and receive interview invitations. Admins create question sets, and users record and submit video responses through a unique interview link.', '[\"React\"]', NULL, '2025-07-02 08:50:46'),
(181, 54, 'Capstone Project CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[\"Protege\"]', NULL, '2025-07-02 08:50:46'),
(182, 54, 'FurnsShop Site', NULL, 'Developed an ecommerce platform, allowing users to browse and purchase furniture items effortlessly. Integrated features like product categories, detailed item views, and a user-friendly interface.', '[\"React\"]', NULL, '2025-07-02 08:50:46'),
(183, 55, 'Lawyyar AI Website', NULL, 'Developed a platform for lawyers to manage cases, schedule hearing dates, and upload files for data extraction. Integrated AI to act as a virtual judge, analyzing inputs from both parties and providing responses.', '[\"React\"]', NULL, '2025-07-02 09:30:56'),
(184, 55, 'AuraInterview Site', NULL, 'Built a platform where users upload their CVs and receive interview invitations. Admins create question sets, and users record and submit video responses through a unique interview link.', '[\"React\"]', NULL, '2025-07-02 09:30:56'),
(185, 55, 'Capstone Project CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[]', NULL, '2025-07-02 09:30:56'),
(186, 55, 'FurnsShop Site', NULL, 'Developed an ecommerce platform, allowing users to browse and purchase furniture items effortlessly. Integrated features like product categories, detailed item views, and a user-friendly interface.', '[\"React\"]', NULL, '2025-07-02 09:30:56'),
(187, 56, 'Lawyyar AI Website', NULL, 'Developed a platform for lawyers to manage cases, schedule hearing dates, and upload files for data extraction. Integrated AI to act as a virtual judge, analyzing inputs from both parties and providing responses.', '[\"React\"]', NULL, '2025-07-02 09:44:41'),
(188, 56, 'AuraInterview Site', NULL, 'Built a platform where users upload their CVs and receive interview invitations. Admins create question sets, and users record and submit video responses through a unique interview link.', '[\"React\"]', NULL, '2025-07-02 09:44:41'),
(189, 56, 'Capstone Project CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[\"Protege\"]', NULL, '2025-07-02 09:44:41'),
(190, 56, 'FurnsShop Site', NULL, 'Developed an ecommerce platform, allowing users to browse and purchase furniture items effortlessly. Integrated features like product categories, detailed item views, and a user-friendly interface.', '[\"React\"]', NULL, '2025-07-02 09:44:41'),
(207, 63, 'Lawyyar AI Website', NULL, 'Developed a platform for lawyers to manage cases, schedule hearing dates, and upload files for data extraction. Integrated AI to act as a virtual judge, analyzing inputs from both parties and providing responses.', '[\"React\"]', NULL, '2025-07-02 10:51:27'),
(208, 63, 'AuraInterview Site', NULL, 'Built a platform where users upload their CVs and receive interview invitations. Admins create question sets, and users record and submit video responses through a unique interview link.', '[\"React\"]', NULL, '2025-07-02 10:51:27'),
(209, 63, 'Capstone Project CyberCrime Attacks Ontology', NULL, 'Developed an ontology representing knowledge about different attacks like their best defences, prevention and detection techniques, and their vulnerabilities, aimed at providing accessible information for beginners, students and domain experts.', '[\"Protege\"]', NULL, '2025-07-02 10:51:27'),
(210, 63, 'FurnsShop Site', NULL, 'Developed an ecommerce platform, allowing users to browse and purchase furniture items effortlessly. Integrated features like product categories, detailed item views, and a user-friendly interface.', '[\"React\"]', NULL, '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_publications`
--

CREATE TABLE `cvs_publications` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `journal` varchar(255) DEFAULT NULL,
  `publication_date` date DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_publications`
--

INSERT INTO `cvs_publications` (`id`, `cv_id`, `title`, `journal`, `publication_date`, `url`, `created_at`) VALUES
(1, 1, 'LeafNet: Using Convolutional Neural Network for Plant Leaf Detection', 'VFAST Transactions on Software Engineering', '2023-06-01', 'https://doi.org/10.21015/vtse.v11i2.1514', '2025-04-13 06:03:02'),
(2, 2, 'Bilateral Double Ureters with Bladder Neck Diverticulum in a Nigerian Woman Masquerading as an Obstetric Fistula', 'Case Reports in Urology', NULL, NULL, '2025-04-13 06:08:16'),
(3, 2, 'Comparative Effectiveness Of 50g Glucose Challenge Test And Risk Factor Based Screening In Detection Of Gestational Diabetes Mellitus In Ibadan, Nigeria', 'Tropical Journal of Obstetrics and Gynaecology', NULL, NULL, '2025-04-13 06:08:16'),
(4, 2, 'Awareness and attitude towards HPV and its vaccines among market women in Bodija market, Ibadan', 'Nigerian Journal of Medicine', NULL, NULL, '2025-04-13 06:08:16'),
(5, 21, 'LeafNet: Using Convolutional Neural Network for Plant Leaf Detection', 'VFAST Transactions on Software Engineering', '2023-06-01', 'https://doi.org/10.21015/vtse.v11i2.1514', '2025-04-15 09:57:50'),
(6, 22, 'Bilateral Double Ureters with Bladder Neck Diverticulum in a Nigerian Woman Masquerading as an Obstetric Fistula', 'Case Reports in Urology', NULL, NULL, '2025-04-15 10:01:04'),
(7, 22, 'Comparative Effectiveness Of 50g Glucose Challenge Test And Risk Factor Based Screening In Detection Of Gestational Diabetes Mellitus In Ibadan, Nigeria', 'Tropical Journal of Obstetrics and Gynaecology', NULL, NULL, '2025-04-15 10:01:04'),
(8, 22, 'Awareness and attitude towards HPV and its vaccines among market women in Bodija market, Ibadan', 'Nigerian Journal of Medicine', NULL, NULL, '2025-04-15 10:01:04');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_references`
--

CREATE TABLE `cvs_references` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_references`
--

INSERT INTO `cvs_references` (`id`, `cv_id`, `name`, `position`, `contact_info`, `created_at`) VALUES
(1, 2, 'Prof. Akinyinka Omigbodun', 'Professor', 'omigbodun@yahoo.com', '2025-04-13 06:08:16'),
(2, 2, 'Prof. Oladosu Ojengbede', 'Professor', 'ladosu2002@yahoo.com', '2025-04-13 06:08:16'),
(3, 22, 'Prof. Akinyinka Omigbodun', 'Gynaecological Oncology Unit, University College Hospital/University of Ibadan', 'omigbodun@yahoo.com', '2025-04-15 10:01:04'),
(4, 22, 'Prof. Oladosu Ojengbede', 'Genitourinary Unit, University College Hospital/University of Ibadan', 'ladosu2002@yahoo.com', '2025-04-15 10:01:04');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_shortlist`
--

CREATE TABLE `cvs_shortlist` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `shortlisted` tinyint(1) DEFAULT 1,
  `organization_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cvs_shortlist`
--

INSERT INTO `cvs_shortlist` (`id`, `cv_id`, `shortlisted`, `organization_id`) VALUES
(1, 53, 1, 2),
(2, 25, 1, 2),
(3, 24, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `cvs_skills`
--

CREATE TABLE `cvs_skills` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `skill` varchar(255) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_skills`
--

INSERT INTO `cvs_skills` (`id`, `cv_id`, `skill`, `level`, `created_at`) VALUES
(1, 1, 'Java', NULL, '2025-04-13 06:03:02'),
(2, 1, 'C++', NULL, '2025-04-13 06:03:02'),
(3, 1, 'Flutter', NULL, '2025-04-13 06:03:02'),
(4, 1, 'HTML & CSS', NULL, '2025-04-13 06:03:02'),
(5, 1, 'Classroom management', NULL, '2025-04-13 06:03:02'),
(6, 1, 'Compassion', NULL, '2025-04-13 06:03:02'),
(7, 1, 'Collaboration', NULL, '2025-04-13 06:03:02'),
(8, 1, 'Patience', NULL, '2025-04-13 06:03:02'),
(9, 1, 'Microsoft Office', NULL, '2025-04-13 06:03:02'),
(10, 1, 'Communication', NULL, '2025-04-13 06:03:02'),
(11, 1, 'Web designing', NULL, '2025-04-13 06:03:02'),
(12, 1, 'Mobile app development', NULL, '2025-04-13 06:03:02'),
(13, 2, 'Gynaecological surgeries', 'Highly competent', '2025-04-13 06:08:16'),
(14, 2, 'Communication and collaborative skills', 'Excellent', '2025-04-13 06:08:16'),
(15, 2, 'Analytical skills', 'Meticulous attention to details', '2025-04-13 06:08:16'),
(16, 5, 'PHP (Core php, Laravel, Symfony, Magento, Wordpress)', NULL, '2025-04-13 09:01:31'),
(17, 5, 'HTML, CSS, Bootstrap 4, JavaScript, jQuery, Ajax', NULL, '2025-04-13 09:01:31'),
(18, 5, 'MYSQL, RDS', NULL, '2025-04-13 09:01:31'),
(19, 5, 'AWS: EC2, S3, SQS, RDS, CloudWatch, Redis', NULL, '2025-04-13 09:01:31'),
(20, 5, 'Logging tools: Kibana, Grafana, Bugsnag', NULL, '2025-04-13 09:01:31'),
(21, 5, 'Virtualization software: Docker, Vagrant', NULL, '2025-04-13 09:01:31'),
(22, 5, 'Git/SVN & GitHub', NULL, '2025-04-13 09:01:31'),
(23, 5, 'Exceptional time management', NULL, '2025-04-13 09:01:31'),
(24, 5, 'Problem Solving', NULL, '2025-04-13 09:01:31'),
(25, 5, 'Troubleshooting', NULL, '2025-04-13 09:01:31'),
(26, 5, 'Testing and debugging', NULL, '2025-04-13 09:01:31'),
(27, 6, 'PHP', 'Proficient', '2025-04-13 09:01:52'),
(28, 6, 'Html', NULL, '2025-04-13 09:01:52'),
(29, 6, 'CSS', NULL, '2025-04-13 09:01:52'),
(30, 6, 'Bootstrap', NULL, '2025-04-13 09:01:52'),
(31, 6, 'JavaScript', NULL, '2025-04-13 09:01:52'),
(32, 6, 'jQuery', NULL, '2025-04-13 09:01:52'),
(33, 6, 'Ajax', NULL, '2025-04-13 09:01:52'),
(34, 6, 'MYSQL', NULL, '2025-04-13 09:01:52'),
(35, 6, 'AWS', NULL, '2025-04-13 09:01:52'),
(36, 6, 'Docker', NULL, '2025-04-13 09:01:52'),
(37, 6, 'Git', NULL, '2025-04-13 09:01:52'),
(38, 6, 'Exceptional time management', NULL, '2025-04-13 09:01:52'),
(39, 6, 'Problem Solving', NULL, '2025-04-13 09:01:52'),
(40, 6, 'Troubleshooting', NULL, '2025-04-13 09:01:52'),
(41, 6, 'Testing', NULL, '2025-04-13 09:01:52'),
(42, 6, 'Debugging', NULL, '2025-04-13 09:01:52'),
(43, 7, 'PHP (Core PHP, Laravel, Symfony, Magento, WordPress)', NULL, '2025-04-13 09:03:01'),
(44, 7, 'HTML, CSS, Bootstrap 4, JavaScript, jQuery, Ajax', NULL, '2025-04-13 09:03:01'),
(45, 7, 'MySQL, RDS', NULL, '2025-04-13 09:03:01'),
(46, 7, 'AWS: EC2, S3, SQS, RDS, CloudWatch, Redis', NULL, '2025-04-13 09:03:01'),
(47, 7, 'Logging tools: Kibana, Grafana, Bugsnag', NULL, '2025-04-13 09:03:01'),
(48, 7, 'Virtualization software: Docker, Vagrant', NULL, '2025-04-13 09:03:01'),
(49, 7, 'Git/SVN & GitHub', NULL, '2025-04-13 09:03:01'),
(50, 7, 'Exceptional time management', NULL, '2025-04-13 09:03:01'),
(51, 7, 'Problem Solving', NULL, '2025-04-13 09:03:01'),
(52, 7, 'Troubleshooting', NULL, '2025-04-13 09:03:01'),
(53, 7, 'Testing and debugging', NULL, '2025-04-13 09:03:01'),
(54, 8, 'PHP (Core PHP, Laravel, Symfony, Magento, WordPress)', NULL, '2025-04-13 09:04:50'),
(55, 8, 'HTML, CSS, Bootstrap 4, JavaScript, jQuery, Ajax', NULL, '2025-04-13 09:04:50'),
(56, 8, 'MySQL, RDS', NULL, '2025-04-13 09:04:50'),
(57, 8, 'AWS: EC2, S3, SQS, RDS, CloudWatch, Redis', NULL, '2025-04-13 09:04:50'),
(58, 8, 'Logging tools: Kibana, Grafana, Bugsnag', NULL, '2025-04-13 09:04:50'),
(59, 8, 'Virtualization software: Docker, Vagrant', NULL, '2025-04-13 09:04:50'),
(60, 8, 'Git/SVN & GitHub', NULL, '2025-04-13 09:04:50'),
(61, 8, 'Exceptional time management', NULL, '2025-04-13 09:04:50'),
(62, 8, 'Problem Solving', NULL, '2025-04-13 09:04:50'),
(63, 8, 'Troubleshooting', NULL, '2025-04-13 09:04:50'),
(64, 8, 'Testing and debugging', NULL, '2025-04-13 09:04:50'),
(65, 9, 'PHP', 'Proficient', '2025-04-13 09:17:50'),
(66, 9, 'Html', 'Proficient', '2025-04-13 09:17:50'),
(67, 9, 'CSS', 'Proficient', '2025-04-13 09:17:50'),
(68, 9, 'Bootstrap 4', 'Proficient', '2025-04-13 09:17:50'),
(69, 9, 'JavaScript', 'Proficient', '2025-04-13 09:17:50'),
(70, 9, 'jQuery', 'Proficient', '2025-04-13 09:17:50'),
(71, 9, 'Ajax', 'Proficient', '2025-04-13 09:17:50'),
(72, 9, 'MYSQL', 'Proficient', '2025-04-13 09:17:50'),
(73, 9, 'AWS', 'Proficient', '2025-04-13 09:17:50'),
(74, 9, 'Docker', 'Proficient', '2025-04-13 09:17:50'),
(75, 9, 'Git/Svn & GitHub', 'Proficient', '2025-04-13 09:17:50'),
(76, 10, 'PHP (Core PHP, Laravel, Symfony, Magento, WordPress)', NULL, '2025-04-13 09:19:07'),
(77, 10, 'HTML, CSS, Bootstrap 4, JavaScript, jQuery, Ajax', NULL, '2025-04-13 09:19:07'),
(78, 10, 'MySQL, RDS', NULL, '2025-04-13 09:19:07'),
(79, 10, 'AWS: EC2, S3, SQS, RDS, CloudWatch, Redis', NULL, '2025-04-13 09:19:07'),
(80, 10, 'Logging tools: Kibana, Grafana, Bugsnag', NULL, '2025-04-13 09:19:07'),
(81, 10, 'Virtualization software: Docker, Vagrant', NULL, '2025-04-13 09:19:07'),
(82, 10, 'Git/SVN & GitHub', NULL, '2025-04-13 09:19:07'),
(83, 10, 'Exceptional time management', NULL, '2025-04-13 09:19:07'),
(84, 10, 'Problem Solving', NULL, '2025-04-13 09:19:07'),
(85, 10, 'Troubleshooting', NULL, '2025-04-13 09:19:07'),
(86, 10, 'Testing and debugging', NULL, '2025-04-13 09:19:07'),
(87, 11, 'PHP', 'Expert', '2025-04-13 09:34:46'),
(88, 11, 'PHP Laravel Framework', 'Expert', '2025-04-13 09:34:46'),
(89, 11, 'HTML, CSS, SCSS, Bootstrap, JQuery', 'Expert', '2025-04-13 09:34:46'),
(90, 11, 'MySQL, MongoDB', 'Skillful', '2025-04-13 09:34:46'),
(91, 11, 'React.js', 'Beginner', '2025-04-13 09:34:46'),
(92, 11, 'Energetic, Dynamic, Presentation and Good communication skills.', 'Expert', '2025-04-13 09:34:46'),
(93, 12, 'PHP', 'Expert', '2025-04-13 09:38:56'),
(94, 12, 'PHP Laravel Framework', 'Expert', '2025-04-13 09:38:56'),
(95, 12, 'HTML, CSS, SCSS, Bootstrap, JQuery', 'Expert', '2025-04-13 09:38:56'),
(96, 12, 'MySQL, MongoDB', 'Skillful', '2025-04-13 09:38:56'),
(97, 12, 'React.js', 'Beginner', '2025-04-13 09:38:56'),
(98, 12, 'Energetic, Dynamic, Presentation and Good communication skills', 'Expert', '2025-04-13 09:38:56'),
(99, 13, 'php', NULL, '2025-04-13 10:09:22'),
(100, 13, 'laravel', NULL, '2025-04-13 10:09:22'),
(101, 13, 'codigniter', NULL, '2025-04-13 10:09:22'),
(102, 13, 'coldfusion', NULL, '2025-04-13 10:09:22'),
(103, 13, 'sql', NULL, '2025-04-13 10:09:22'),
(104, 13, 'mysql', NULL, '2025-04-13 10:09:22'),
(105, 13, 'React js', NULL, '2025-04-13 10:09:22'),
(106, 13, 'view js', NULL, '2025-04-13 10:09:22'),
(107, 13, 'html', NULL, '2025-04-13 10:09:22'),
(108, 13, 'css', NULL, '2025-04-13 10:09:22'),
(109, 13, 'bootstrap', NULL, '2025-04-13 10:09:22'),
(110, 13, 'javascript', NULL, '2025-04-13 10:09:22'),
(111, 13, 'jquery', NULL, '2025-04-13 10:09:22'),
(112, 13, 'ajax', NULL, '2025-04-13 10:09:22'),
(113, 13, 'json', NULL, '2025-04-13 10:09:22'),
(114, 15, 'AJAX', NULL, '2025-04-13 10:15:58'),
(115, 15, 'Bootstrap', NULL, '2025-04-13 10:15:58'),
(116, 15, 'Core PHP', NULL, '2025-04-13 10:15:58'),
(117, 15, 'CSS', NULL, '2025-04-13 10:15:58'),
(118, 15, 'HTML', NULL, '2025-04-13 10:15:58'),
(119, 15, 'JavaScript', NULL, '2025-04-13 10:15:58'),
(120, 15, 'PHP', NULL, '2025-04-13 10:15:58'),
(121, 15, 'Laravel', NULL, '2025-04-13 10:15:58'),
(122, 15, 'Elixir', NULL, '2025-04-13 10:15:58'),
(123, 15, 'PostgreSQL', NULL, '2025-04-13 10:15:58'),
(124, 16, 'html', NULL, '2025-04-13 10:17:04'),
(125, 16, 'Css', NULL, '2025-04-13 10:17:04'),
(126, 16, 'php', NULL, '2025-04-13 10:17:04'),
(127, 16, 'laravel', NULL, '2025-04-13 10:17:04'),
(128, 16, 'ajax', NULL, '2025-04-13 10:17:04'),
(129, 16, 'jquery', NULL, '2025-04-13 10:17:04'),
(130, 16, 'mysql', NULL, '2025-04-13 10:17:04'),
(131, 16, 'mongodb', NULL, '2025-04-13 10:17:04'),
(132, 16, 'Leadership', NULL, '2025-04-13 10:17:04'),
(133, 16, 'OOP', NULL, '2025-04-13 10:17:04'),
(134, 16, 'Computer skills', NULL, '2025-04-13 10:17:04'),
(135, 16, 'Management skills', NULL, '2025-04-13 10:17:04'),
(136, 16, 'Interpersonal skills', NULL, '2025-04-13 10:17:04'),
(137, 16, 'Problem-solving', NULL, '2025-04-13 10:17:04'),
(138, 16, 'Customer service', NULL, '2025-04-13 10:17:04'),
(139, 16, 'Active listener', NULL, '2025-04-13 10:17:04'),
(140, 17, 'HTML5', NULL, '2025-04-13 12:13:21'),
(141, 17, 'CSS3', NULL, '2025-04-13 12:13:21'),
(142, 17, 'JavaScript', NULL, '2025-04-13 12:13:21'),
(143, 17, 'Bootstrap', NULL, '2025-04-13 12:13:21'),
(144, 17, 'PHP', NULL, '2025-04-13 12:13:21'),
(145, 17, 'Laravel', NULL, '2025-04-13 12:13:21'),
(146, 17, 'jQuery', NULL, '2025-04-13 12:13:21'),
(147, 17, 'React JS', NULL, '2025-04-13 12:13:21'),
(148, 17, 'Vue JS', NULL, '2025-04-13 12:13:21'),
(149, 18, 'PHP(Core php , Laravel , Symfony, Magento , Wordpress)', NULL, '2025-04-13 12:20:06'),
(150, 18, 'Html, CSS, Bootstrap 4,javascript, jQuery, Ajax', NULL, '2025-04-13 12:20:06'),
(151, 18, 'MYSQL, RDS', NULL, '2025-04-13 12:20:06'),
(152, 18, 'AWS: EC2, S3, SQS, RDS, CloudWatch, Redis', NULL, '2025-04-13 12:20:06'),
(153, 18, 'Logging tools: Kibana, Grafana, Bugsnag', NULL, '2025-04-13 12:20:06'),
(154, 18, 'Virtualization software: Docker, Vagrant', NULL, '2025-04-13 12:20:06'),
(155, 18, 'Git /Svn & GitHub', NULL, '2025-04-13 12:20:06'),
(156, 18, 'Exceptional time management', NULL, '2025-04-13 12:20:06'),
(157, 18, 'Problem Solving', NULL, '2025-04-13 12:20:06'),
(158, 18, 'Troubleshooting', NULL, '2025-04-13 12:20:06'),
(159, 18, 'Testing and debugging', NULL, '2025-04-13 12:20:06'),
(160, 19, 'AJAX', NULL, '2025-04-14 10:33:51'),
(161, 19, 'Bootstrap', NULL, '2025-04-14 10:33:51'),
(162, 19, 'CodeIgniter', NULL, '2025-04-14 10:33:51'),
(163, 19, 'Core PHP', NULL, '2025-04-14 10:33:51'),
(164, 19, 'CSS', NULL, '2025-04-14 10:33:51'),
(165, 19, 'DataBase(MySQL)', NULL, '2025-04-14 10:33:51'),
(166, 19, 'Elixir', NULL, '2025-04-14 10:33:51'),
(167, 19, 'HTML', NULL, '2025-04-14 10:33:51'),
(168, 19, 'jQuery', NULL, '2025-04-14 10:33:51'),
(169, 19, 'Laravel', NULL, '2025-04-14 10:33:51'),
(170, 19, 'Lumen API', NULL, '2025-04-14 10:33:51'),
(171, 19, 'MongoDB', NULL, '2025-04-14 10:33:51'),
(172, 19, 'Node JS', NULL, '2025-04-14 10:33:51'),
(173, 19, 'PostgreSQL', NULL, '2025-04-14 10:33:51'),
(174, 20, 'Laravel', NULL, '2025-04-14 10:36:38'),
(175, 20, 'Codeigniter MVC & HMVC', NULL, '2025-04-14 10:36:38'),
(176, 20, 'PHP Core', NULL, '2025-04-14 10:36:38'),
(177, 20, 'JQuery', NULL, '2025-04-14 10:36:38'),
(178, 20, 'AJAX', NULL, '2025-04-14 10:36:38'),
(179, 20, 'JSON', NULL, '2025-04-14 10:36:38'),
(180, 20, 'API’s Integrations', NULL, '2025-04-14 10:36:38'),
(181, 20, 'API’S Development', NULL, '2025-04-14 10:36:38'),
(182, 20, 'MySQL', NULL, '2025-04-14 10:36:38'),
(183, 20, 'Sleeknote', NULL, '2025-04-14 10:36:38'),
(184, 20, 'Zapier', NULL, '2025-04-14 10:36:38'),
(185, 21, 'Java', NULL, '2025-04-15 09:57:50'),
(186, 21, 'C++', NULL, '2025-04-15 09:57:50'),
(187, 21, 'Flutter', NULL, '2025-04-15 09:57:50'),
(188, 21, 'HTML & CSS', NULL, '2025-04-15 09:57:50'),
(189, 21, 'Classroom management', NULL, '2025-04-15 09:57:50'),
(190, 21, 'Compassion', NULL, '2025-04-15 09:57:50'),
(191, 21, 'Collaboration', NULL, '2025-04-15 09:57:50'),
(192, 21, 'Patience', NULL, '2025-04-15 09:57:50'),
(193, 21, 'Microsoft Office', NULL, '2025-04-15 09:57:50'),
(194, 21, 'Communication', NULL, '2025-04-15 09:57:50'),
(195, 21, 'Web designing', NULL, '2025-04-15 09:57:50'),
(196, 21, 'Mobile app development', NULL, '2025-04-15 09:57:50'),
(197, 22, 'Obstetrics and Gynaecology', 'Expert', '2025-04-15 10:01:04'),
(198, 22, 'Urogynaecological and Vaginal Surgeries', 'Expert', '2025-04-15 10:01:04'),
(199, 23, 'NLP', NULL, '2025-04-15 15:23:06'),
(200, 23, 'Conversational AI', NULL, '2025-04-15 15:23:06'),
(201, 23, 'Chatbot Flow Builder', NULL, '2025-04-15 15:23:06'),
(202, 23, 'Chatbot Flow Design – Whatsapp, Website', NULL, '2025-04-15 15:23:06'),
(203, 24, 'Sales & Marketing Programs', NULL, '2025-04-15 15:28:58'),
(204, 24, 'Digital Marketing', NULL, '2025-04-15 15:28:58'),
(205, 24, 'Strategic plans', NULL, '2025-04-15 15:28:58'),
(206, 24, 'Market Research', NULL, '2025-04-15 15:28:58'),
(207, 24, 'CRM', NULL, '2025-04-15 15:28:58'),
(208, 24, 'Business development', NULL, '2025-04-15 15:28:58'),
(209, 24, 'Customer loyalty management', NULL, '2025-04-15 15:28:58'),
(210, 25, 'Sales & Marketing Programs', NULL, '2025-04-16 07:48:39'),
(211, 25, 'Digital Marketing', NULL, '2025-04-16 07:48:39'),
(212, 25, 'Strategic Planning', NULL, '2025-04-16 07:48:39'),
(213, 25, 'Market Research', NULL, '2025-04-16 07:48:39'),
(214, 25, 'CRM Management', NULL, '2025-04-16 07:48:39'),
(215, 26, 'JavaScript', NULL, '2025-04-28 11:37:10'),
(216, 26, 'HTML', NULL, '2025-04-28 11:37:10'),
(217, 26, 'CSS', NULL, '2025-04-28 11:37:10'),
(218, 26, 'CSS Modules', NULL, '2025-04-28 11:37:10'),
(219, 26, 'Tailwind', NULL, '2025-04-28 11:37:10'),
(220, 26, 'React', NULL, '2025-04-28 11:37:10'),
(221, 26, 'Redux', NULL, '2025-04-28 11:37:10'),
(222, 26, 'WordPress', NULL, '2025-04-28 11:37:10'),
(223, 26, 'Ontology Development', NULL, '2025-04-28 11:37:10'),
(224, 26, 'Shopify Store Designing', NULL, '2025-04-28 11:37:10'),
(225, 26, 'React Js Developer', NULL, '2025-04-28 11:37:10'),
(226, 26, 'Git', NULL, '2025-04-28 11:37:10'),
(227, 26, 'SQL', NULL, '2025-04-28 11:37:10'),
(228, 27, 'JavaScript', NULL, '2025-04-29 07:36:02'),
(229, 27, 'HTML', NULL, '2025-04-29 07:36:02'),
(230, 27, 'CSS', NULL, '2025-04-29 07:36:02'),
(231, 27, 'CSS Modules', NULL, '2025-04-29 07:36:02'),
(232, 27, 'Tailwind', NULL, '2025-04-29 07:36:02'),
(233, 27, 'React', NULL, '2025-04-29 07:36:02'),
(234, 27, 'Redux', NULL, '2025-04-29 07:36:02'),
(235, 27, 'WordPress', NULL, '2025-04-29 07:36:02'),
(236, 27, 'Ontology Development', NULL, '2025-04-29 07:36:02'),
(237, 27, 'Shopify Store Designing', NULL, '2025-04-29 07:36:02'),
(238, 27, 'React Js Developer', NULL, '2025-04-29 07:36:02'),
(239, 27, 'Git', NULL, '2025-04-29 07:36:02'),
(240, 27, 'SQL', NULL, '2025-04-29 07:36:02'),
(241, 28, 'JavaScript', NULL, '2025-04-29 08:36:57'),
(242, 28, 'HTML', NULL, '2025-04-29 08:36:57'),
(243, 28, 'CSS', NULL, '2025-04-29 08:36:57'),
(244, 28, 'CSS Modules', NULL, '2025-04-29 08:36:57'),
(245, 28, 'Tailwind', NULL, '2025-04-29 08:36:57'),
(246, 28, 'React', NULL, '2025-04-29 08:36:57'),
(247, 28, 'Redux', NULL, '2025-04-29 08:36:57'),
(248, 28, 'WordPress', NULL, '2025-04-29 08:36:57'),
(249, 28, 'Ontology Development', NULL, '2025-04-29 08:36:57'),
(250, 28, 'Shopify Store Designing', NULL, '2025-04-29 08:36:57'),
(339, 35, 'JavaScript', NULL, '2025-04-29 10:21:55'),
(340, 35, 'HTML', NULL, '2025-04-29 10:21:55'),
(341, 35, 'CSS', NULL, '2025-04-29 10:21:55'),
(342, 35, 'CSS Modules', NULL, '2025-04-29 10:21:55'),
(343, 35, 'Tailwind', NULL, '2025-04-29 10:21:55'),
(344, 35, 'React', NULL, '2025-04-29 10:21:55'),
(345, 35, 'Redux', NULL, '2025-04-29 10:21:55'),
(346, 35, 'WordPress', NULL, '2025-04-29 10:21:55'),
(347, 35, 'Ontology Development', NULL, '2025-04-29 10:21:55'),
(348, 35, 'Shopify Store Designing', NULL, '2025-04-29 10:21:55'),
(349, 35, 'PHP', NULL, '2025-04-29 10:21:55'),
(350, 35, 'Git', NULL, '2025-04-29 10:21:55'),
(351, 35, 'SQL', NULL, '2025-04-29 10:21:55'),
(624, 52, 'JavaScript', NULL, '2025-04-30 07:38:05'),
(625, 52, 'HTML', NULL, '2025-04-30 07:38:06'),
(626, 52, 'CSS', NULL, '2025-04-30 07:38:06'),
(627, 52, 'SQL', NULL, '2025-04-30 07:38:06'),
(628, 52, 'React JS', NULL, '2025-04-30 07:38:06'),
(629, 52, 'Tailwind CSS', NULL, '2025-04-30 07:38:06'),
(630, 52, 'Bootstrap', NULL, '2025-04-30 07:38:06'),
(631, 52, 'Visual Studio', NULL, '2025-04-30 07:38:06'),
(632, 52, 'Postman', NULL, '2025-04-30 07:38:06'),
(633, 52, 'GIT', NULL, '2025-04-30 07:38:06'),
(634, 52, 'Mongo DB Compass', NULL, '2025-04-30 07:38:06'),
(635, 52, 'MySQL', NULL, '2025-04-30 07:38:06'),
(636, 52, 'RESTful APIs', NULL, '2025-04-30 07:38:06'),
(637, 52, 'Node JS', NULL, '2025-04-30 07:38:06'),
(638, 52, 'Express', NULL, '2025-04-30 07:38:06'),
(639, 52, 'Mongo DB', NULL, '2025-04-30 07:38:06'),
(640, 52, 'CSS Modules', NULL, '2025-04-30 07:38:06'),
(641, 52, 'Redux', NULL, '2025-04-30 07:38:06'),
(642, 52, 'Ontology Development', NULL, '2025-04-30 07:38:06'),
(643, 53, 'JavaScript', NULL, '2025-04-30 08:15:07'),
(644, 53, 'HTML', NULL, '2025-04-30 08:15:07'),
(645, 53, 'CSS', NULL, '2025-04-30 08:15:07'),
(646, 53, 'SQL', NULL, '2025-04-30 08:15:07'),
(647, 53, 'React JS', NULL, '2025-04-30 08:15:07'),
(648, 53, 'Tailwind CSS', NULL, '2025-04-30 08:15:07'),
(649, 53, 'Bootstrap', NULL, '2025-04-30 08:15:07'),
(650, 53, 'Visual Studio', NULL, '2025-04-30 08:15:07'),
(651, 53, 'Postman', NULL, '2025-04-30 08:15:07'),
(652, 53, 'GIT', NULL, '2025-04-30 08:15:07'),
(653, 53, 'Mongo DB Compass', NULL, '2025-04-30 08:15:07'),
(654, 53, 'MySQL', NULL, '2025-04-30 08:15:07'),
(655, 53, 'RESTful APIs', NULL, '2025-04-30 08:15:07'),
(656, 53, 'Node JS', NULL, '2025-04-30 08:15:07'),
(657, 53, 'Express', NULL, '2025-04-30 08:15:07'),
(658, 53, 'Mongo DB', NULL, '2025-04-30 08:15:07'),
(659, 53, 'CSS Modules', NULL, '2025-04-30 08:15:07'),
(660, 53, 'Redux', NULL, '2025-04-30 08:15:07'),
(661, 53, 'Ontology Development', NULL, '2025-04-30 08:15:07'),
(662, 53, 'MVC', NULL, '2025-04-30 08:15:07'),
(663, 54, 'JavaScript', NULL, '2025-07-02 08:50:46'),
(664, 54, 'HTML', NULL, '2025-07-02 08:50:46'),
(665, 54, 'CSS', NULL, '2025-07-02 08:50:46'),
(666, 54, 'SQL', NULL, '2025-07-02 08:50:46'),
(667, 54, 'React JS', NULL, '2025-07-02 08:50:46'),
(668, 54, 'Tailwind CSS', NULL, '2025-07-02 08:50:46'),
(669, 54, 'Bootstrap', NULL, '2025-07-02 08:50:46'),
(670, 55, 'JavaScript', NULL, '2025-07-02 09:30:56'),
(671, 55, 'HTML', NULL, '2025-07-02 09:30:56'),
(672, 55, 'CSS', NULL, '2025-07-02 09:30:56'),
(673, 55, 'SQL', NULL, '2025-07-02 09:30:56'),
(674, 55, 'React JS', NULL, '2025-07-02 09:30:56'),
(675, 55, 'Tailwind CSS', NULL, '2025-07-02 09:30:56'),
(676, 55, 'Bootstrap', NULL, '2025-07-02 09:30:56'),
(677, 55, 'RESTful APIs', NULL, '2025-07-02 09:30:56'),
(678, 55, 'Node JS', NULL, '2025-07-02 09:30:56'),
(679, 55, 'Express', NULL, '2025-07-02 09:30:56'),
(680, 55, 'Mongo DB', NULL, '2025-07-02 09:30:56'),
(681, 55, 'MVC', NULL, '2025-07-02 09:30:56'),
(682, 56, 'JavaScript', NULL, '2025-07-02 09:44:41'),
(683, 56, 'HTML', NULL, '2025-07-02 09:44:41'),
(684, 56, 'CSS', NULL, '2025-07-02 09:44:41'),
(685, 56, 'SQL', NULL, '2025-07-02 09:44:41'),
(686, 56, 'React JS', NULL, '2025-07-02 09:44:41'),
(687, 56, 'Tailwind CSS', NULL, '2025-07-02 09:44:41'),
(688, 56, 'Bootstrap', NULL, '2025-07-02 09:44:41'),
(772, 63, 'JavaScript', NULL, '2025-07-02 10:51:27'),
(773, 63, 'HTML', NULL, '2025-07-02 10:51:27'),
(774, 63, 'CSS', NULL, '2025-07-02 10:51:27'),
(775, 63, 'SQL', NULL, '2025-07-02 10:51:27'),
(776, 63, 'React JS', NULL, '2025-07-02 10:51:27'),
(777, 63, 'Tailwind CSS', NULL, '2025-07-02 10:51:27'),
(778, 63, 'Bootstrap', NULL, '2025-07-02 10:51:27'),
(779, 63, 'Visual Studio', NULL, '2025-07-02 10:51:27'),
(780, 63, 'Postman', NULL, '2025-07-02 10:51:27'),
(781, 63, 'GIT', NULL, '2025-07-02 10:51:27'),
(782, 63, 'Mongo DB Compass', NULL, '2025-07-02 10:51:27'),
(783, 63, 'MySQL', NULL, '2025-07-02 10:51:27'),
(784, 63, 'RESTful APIs', NULL, '2025-07-02 10:51:27'),
(785, 63, 'Node JS', NULL, '2025-07-02 10:51:27'),
(786, 63, 'Express', NULL, '2025-07-02 10:51:27'),
(787, 63, 'Mongo DB', NULL, '2025-07-02 10:51:27'),
(788, 63, 'CSS Modules', NULL, '2025-07-02 10:51:27'),
(789, 63, 'Redux', NULL, '2025-07-02 10:51:27'),
(790, 63, 'Ontology Development', NULL, '2025-07-02 10:51:27'),
(791, 63, 'MVC', NULL, '2025-07-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `cvs_volunteer`
--

CREATE TABLE `cvs_volunteer` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cvs_volunteer`
--

INSERT INTO `cvs_volunteer` (`id`, `cv_id`, `activity`, `location`, `date`, `description`, `organization`, `created_at`) VALUES
(1, 1, 'National Volleyball Player', NULL, '2022 - 2023', NULL, NULL, '2025-04-13 06:03:02'),
(2, 21, 'National Volleyball Player', NULL, '2022 - 2023', NULL, NULL, '2025-04-15 09:57:50');

-- --------------------------------------------------------

--
-- Table structure for table `file_responses`
--

CREATE TABLE `file_responses` (
  `id` int(11) NOT NULL,
  `response_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `file_responses`
--

INSERT INTO `file_responses` (`id`, `response_id`, `file_path`, `file_name`, `file_size`, `mime_type`, `created_at`) VALUES
(1, 30, 'http://localhost:3001/uploads/responseFile-1751448974879-133790455.png', 'image1.png', 4377, 'image/png', '2025-07-02 09:36:14'),
(2, 33, 'http://localhost:3001/uploads/responseFile-1751452309320-317540651.png', 'image1.png', 4377, 'image/png', '2025-07-02 10:31:49'),
(3, 41, 'http://localhost:3001/uploads/responseFile-1751453546423-789258136.png', 'image1.png', 4377, 'image/png', '2025-07-02 10:52:26');

-- --------------------------------------------------------

--
-- Table structure for table `interviews`
--

CREATE TABLE `interviews` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('draft','active','archived','completed') DEFAULT 'draft',
  `expiry_date` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `interviews`
--

INSERT INTO `interviews` (`id`, `organization_id`, `job_id`, `user_id`, `title`, `token`, `description`, `status`, `expiry_date`, `created_at`, `updated_at`, `company_id`) VALUES
(1, 2, 0, 0, 'Sunt ea quia qui exe', '123456', 'Ex nisi minus molest', 'draft', '2025-08-21 06:26:33', '2025-04-13 07:31:58', '2025-04-28 12:47:12', NULL),
(2, 2, 1, 0, 'test asf', '234567', 'asf asdf', 'active', '2025-05-07 07:21:28', '2025-04-13 07:31:58', '2025-04-13 12:14:11', NULL),
(3, 2, 1, 2, 'Et fugiat eiusmod qu', '', 'Dolorem sunt ad aliq', 'archived', '2025-04-14 19:00:00', '2025-04-13 07:32:01', '2025-04-16 09:46:34', NULL),
(4, 2, 1, 2, 'Voluptates ut autem ', '', 'Debitis fugit iste ', 'archived', '2025-04-23 19:00:00', '2025-04-13 08:55:20', '2025-04-16 09:46:34', NULL),
(5, 2, 1, 2, 'Voluptates ut autem ', '', 'Debitis fugit iste ', 'draft', '2025-04-23 19:00:00', '2025-04-13 09:00:31', '2025-04-13 09:00:31', NULL),
(6, 2, 1, 2, 'Esse elit aut labor', '', 'Quis vitae illum et', 'draft', '2025-04-24 19:00:00', '2025-04-15 09:59:18', '2025-04-15 09:59:18', NULL),
(7, 2, 1, 2, 'Esse elit aut labor', '', 'Quis vitae illum et', 'draft', '2025-04-24 19:00:00', '2025-04-15 09:59:45', '2025-04-15 09:59:45', NULL),
(8, 2, 1, 2, 'Esse elit aut labor', '', 'Quis vitae illum et', 'draft', '2025-04-24 19:00:00', '2025-04-15 09:59:55', '2025-04-15 09:59:55', NULL),
(9, 2, 1, 2, 'asdf', '', 'asdfasfd', 'draft', '2025-04-30 19:00:00', '2025-04-15 15:33:45', '2025-04-15 15:33:45', NULL),
(10, 2, 1, 2, 'hello', '', 'hello', 'archived', '2025-04-24 19:00:00', '2025-04-16 07:40:57', '2025-04-16 09:46:43', NULL),
(11, 2, 1, 2, 'hello', '', 'hello', 'archived', '2025-04-24 19:00:00', '2025-04-16 07:41:02', '2025-04-16 09:46:43', NULL),
(12, 2, 1, 2, 'hello', '', 'hello', 'archived', '2025-04-24 19:00:00', '2025-04-16 07:41:41', '2025-04-16 09:46:43', NULL),
(13, 2, 1, 2, 'hello', '', 'hello', 'archived', '2025-04-24 19:00:00', '2025-04-16 07:42:59', '2025-04-16 07:54:14', NULL),
(14, 2, 0, 2, 'gdgfdfgd', '', 'ffcsdsfdsdf', 'draft', NULL, '2025-05-15 10:06:45', '2025-05-15 10:06:45', NULL),
(15, 2, 0, 2, 'gdgfdfgd', '', 'ffcsdsfdsdf', 'draft', NULL, '2025-05-15 10:06:54', '2025-05-15 10:06:54', NULL),
(16, 2, 0, 2, 'gdgfdfgd', '', 'ffcsdsfdsdf', 'draft', NULL, '2025-05-15 10:07:01', '2025-05-15 10:07:01', NULL),
(17, 2, 0, 2, 'gdgfdfgd', '', 'ffcsdsfdsdf', 'draft', NULL, '2025-05-15 10:08:40', '2025-05-15 10:08:40', NULL),
(18, 2, 0, 2, 'gdgfdfgd', '', 'ffcsdsfdsdf', 'draft', '2025-05-13 10:10:00', '2025-05-15 10:10:11', '2025-05-15 10:10:11', NULL),
(20, 2, 0, 2, 'sjksjdlksjdk', '', 'sdskljdksldjkslj', 'draft', '2025-05-23 05:19:00', '2025-05-16 05:21:52', '2025-05-16 05:21:52', NULL),
(21, 2, 0, 2, 'sjksjdlksjdk', '', 'sdskljdksldjkslj', 'draft', '2025-05-23 05:19:00', '2025-05-16 05:26:38', '2025-05-16 05:26:38', NULL),
(22, 2, 0, 2, 'sjksjdlksjdk', '', 'sdskljdksldjkslj', 'draft', '2025-05-23 05:19:00', '2025-05-16 05:43:35', '2025-05-16 05:43:35', NULL),
(23, 2, 0, 2, 'sjksjdlksjdk', '', 'sdskljdksldjkslj', 'draft', '2025-05-23 05:19:00', '2025-05-16 05:48:43', '2025-05-16 05:48:43', NULL),
(24, 2, 0, 2, 'sdhfjkdhfjkdfh', '', 'sdkjfhjkhfjkd', 'draft', '2025-05-22 06:35:00', '2025-05-16 06:35:33', '2025-05-16 06:35:33', NULL),
(25, 2, 0, 2, 'wjlkfjlkfjk', '', 'fjkljfkljfkldfj', 'draft', '2025-05-21 10:50:00', '2025-05-16 07:46:43', '2025-05-16 07:46:43', NULL),
(26, 2, 0, 2, 'dhfkjdhfjkd', '', 'sdjfkldjfkdl', 'draft', '2025-05-20 07:53:00', '2025-05-16 07:53:06', '2025-05-16 07:53:06', NULL),
(43, 2, 2, 2, 'Database Management System (DBMS)', '40dfd43f-d415-4038-b777-6085d3ed5dd2', 'about managing, editing data in database', 'draft', '2025-07-16 10:00:00', '2025-07-02 10:00:53', '2025-07-02 10:10:09', 2),
(45, 2, 3, 2, 'Operating system', 'e34b1f0f-3297-44cd-a2ae-42670b73ca27', 'about system', 'draft', '2025-07-24 10:22:00', '2025-07-02 10:23:02', '2025-07-02 10:23:02', 3);

-- --------------------------------------------------------

--
-- Table structure for table `interview_assignments`
--

CREATE TABLE `interview_assignments` (
  `id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `interview_assignments`
--

INSERT INTO `interview_assignments` (`id`, `interview_id`, `user_id`, `created_at`) VALUES
(1, 2, 2, '2025-04-13 07:21:28'),
(2, 3, 2, '2025-04-13 07:32:01'),
(3, 4, 2, '2025-04-13 08:55:20'),
(4, 5, 2, '2025-04-13 09:00:31'),
(5, 1, 2, '2025-04-13 09:00:48'),
(6, 6, 2, '2025-04-15 09:59:18'),
(7, 7, 2, '2025-04-15 09:59:45'),
(8, 8, 2, '2025-04-15 09:59:55'),
(9, 9, 2, '2025-04-15 15:33:45'),
(10, 10, 2, '2025-04-16 07:40:57'),
(11, 11, 2, '2025-04-16 07:41:02'),
(12, 12, 2, '2025-04-16 07:41:41'),
(13, 13, 2, '2025-04-16 07:42:59'),
(14, 18, 2, '2025-05-15 10:10:11'),
(15, 20, 2, '2025-05-16 05:21:52'),
(16, 21, 2, '2025-05-16 05:26:38'),
(17, 22, 2, '2025-05-16 05:43:35'),
(18, 23, 2, '2025-05-16 05:48:43'),
(19, 24, 2, '2025-05-16 06:35:33'),
(20, 25, 2, '2025-05-16 07:46:43'),
(21, 26, 2, '2025-05-16 07:53:06'),
(22, 27, 2, '2025-05-16 08:06:47'),
(23, 28, 2, '2025-05-16 08:10:02'),
(24, 29, 2, '2025-05-16 09:19:50'),
(25, 30, 2, '2025-05-16 09:27:49'),
(26, 31, 2, '2025-05-16 10:34:19'),
(27, 32, 2, '2025-05-16 10:36:13'),
(28, 33, 2, '2025-05-16 10:42:54'),
(29, 34, 2, '2025-05-16 10:47:07'),
(30, 35, 2, '2025-05-16 10:49:56'),
(31, 36, 2, '2025-05-16 11:01:04'),
(32, 37, 2, '2025-05-16 11:08:54'),
(33, 38, 2, '2025-05-16 11:16:59'),
(34, 39, 2, '2025-05-16 11:21:20'),
(35, 40, 2, '2025-05-16 12:05:24'),
(36, 41, 2, '2025-07-02 09:25:43'),
(37, 42, 2, '2025-07-02 09:28:27'),
(38, 43, 2, '2025-07-02 10:00:53'),
(39, 44, 2, '2025-07-02 10:14:02'),
(40, 45, 2, '2025-07-02 10:23:02');

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `cvs_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('sent','unsent') NOT NULL DEFAULT 'unsent',
  `token` varchar(255) DEFAULT NULL,
  `reminder_sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `intro_video` varchar(255) DEFAULT NULL,
  `outro_video` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `invitations`
--

INSERT INTO `invitations` (`id`, `organization_id`, `interview_id`, `cvs_id`, `email`, `first_name`, `last_name`, `message`, `status`, `token`, `reminder_sent_at`, `created_at`, `expires_at`, `updated_at`, `intro_video`, `outro_video`) VALUES
(1, 0, 1, 0, '', NULL, NULL, NULL, 'sent', 'v1l72ui25oaoab25uiez', NULL, '2025-04-13 06:53:53', NULL, '2025-04-13 06:53:53', NULL, NULL),
(2, 0, 1, 3, 'vomynez@mailinator.com', 'Adria', 'Cobb', NULL, 'sent', NULL, NULL, '2025-04-13 07:02:01', NULL, '2025-04-13 07:02:01', NULL, NULL),
(3, 0, 1, 4, 'vomynez@mailinator.com', 'Adria', 'Cobb', NULL, 'sent', NULL, NULL, '2025-04-13 07:02:09', NULL, '2025-04-13 07:02:09', NULL, NULL),
(4, 2, 5, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'rhmb81um1drv499nnzbz', NULL, '2025-04-13 09:00:31', NULL, '2025-04-13 09:00:31', NULL, NULL),
(5, 0, 1, 5, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:01:31', NULL, '2025-04-13 09:01:31', NULL, NULL),
(6, 0, 1, 6, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:01:52', NULL, '2025-04-13 09:01:52', NULL, NULL),
(7, 0, 1, 7, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:03:01', NULL, '2025-04-13 09:03:01', NULL, NULL),
(8, 0, 1, 8, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:04:50', NULL, '2025-04-13 09:04:50', NULL, NULL),
(9, 0, 1, 9, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:17:50', NULL, '2025-04-13 09:17:50', NULL, NULL),
(10, 0, 1, 10, 'bydotudax@mailinator.com', 'Neve', 'Baird', NULL, 'sent', NULL, NULL, '2025-04-13 09:19:07', NULL, '2025-04-13 09:19:07', NULL, NULL),
(11, 0, 1, 11, 'moxivu@mailinator.com', 'Kermit', 'Puckett', NULL, 'sent', NULL, NULL, '2025-04-13 09:34:46', NULL, '2025-04-13 09:34:46', NULL, NULL),
(12, 0, 1, 12, 'moxivu@mailinator.com', 'Kermit', 'Puckett', NULL, 'sent', NULL, NULL, '2025-04-13 09:38:56', NULL, '2025-04-13 09:38:56', NULL, NULL),
(13, 2, 1, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, 'sent', NULL, NULL, '2025-04-13 10:09:22', NULL, '2025-04-13 10:09:22', NULL, NULL),
(14, 2, 1, 14, 'xidagorec@mailinator.com', 'Blaine', 'Delacruz', NULL, 'sent', NULL, NULL, '2025-04-13 10:13:21', NULL, '2025-04-13 10:13:21', NULL, NULL),
(15, 2, 1, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, 'sent', NULL, NULL, '2025-04-13 10:15:58', NULL, '2025-04-13 10:15:58', NULL, NULL),
(16, 2, 1, 16, 'fugutylada@mailinator.com', 'Aquila', 'Shepard', NULL, 'sent', NULL, NULL, '2025-04-13 10:17:04', NULL, '2025-04-13 10:17:04', NULL, NULL),
(17, 2, 2, 17, 'funinaku@mailinator.com', 'Clayton', 'Lamb', NULL, 'sent', NULL, NULL, '2025-04-13 12:13:21', NULL, '2025-04-13 12:13:21', NULL, NULL),
(18, 2, 2, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, 'sent', NULL, NULL, '2025-04-13 12:20:06', NULL, '2025-04-13 12:20:06', NULL, NULL),
(19, 2, 1, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, 'sent', NULL, NULL, '2025-04-14 10:33:51', NULL, '2025-04-14 10:33:51', NULL, NULL),
(20, 2, 1, 20, 'pacu@mailinator.com', 'Ulric', 'Gardner', NULL, 'sent', NULL, NULL, '2025-04-14 10:36:38', NULL, '2025-04-14 10:36:38', NULL, NULL),
(21, 2, 6, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'hxclx5zhoi5wo862lv9vh', NULL, '2025-04-15 09:59:18', NULL, '2025-04-15 09:59:18', NULL, NULL),
(22, 2, 7, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', '2lmyq8daliftnx8spaayt9', NULL, '2025-04-15 09:59:45', NULL, '2025-04-15 09:59:45', NULL, NULL),
(23, 2, 8, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'gix4cpewtkr6c2ralcwlp4', NULL, '2025-04-15 09:59:55', NULL, '2025-04-15 09:59:55', NULL, NULL),
(24, 2, 1, 22, 'penoriqy@mailinator.com', 'Meghan', 'Wolfe', NULL, 'sent', NULL, NULL, '2025-04-15 10:01:04', NULL, '2025-04-15 10:01:04', NULL, NULL),
(25, 2, 2, 24, 'domedata@gmail.com', 'Asmat', 'ullah', NULL, 'sent', NULL, NULL, '2025-04-15 15:28:58', NULL, '2025-04-15 15:28:58', NULL, NULL),
(26, 2, 9, 0, 'bellodoyin@yahoo.com', NULL, NULL, NULL, 'sent', 'amhwieflxtip9edyxtnzs', NULL, '2025-04-15 15:33:45', NULL, '2025-04-15 15:33:45', NULL, NULL),
(27, 2, 9, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'bigo5mq6djahprak774sfk', NULL, '2025-04-15 15:33:45', NULL, '2025-04-15 15:33:45', NULL, NULL),
(28, 2, 9, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'frv6xs8p8nwepq6zwbmixr', NULL, '2025-04-15 15:33:45', NULL, '2025-04-15 15:33:45', NULL, NULL),
(29, 2, 9, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', '3m93gozrkymlistuodz4u', NULL, '2025-04-15 15:33:45', NULL, '2025-04-15 15:33:45', NULL, NULL),
(30, 2, 9, 0, 'farhanshakirqureshi@gmail.com', NULL, NULL, NULL, 'sent', 'hz433qezu1j68gxh0r42q6', NULL, '2025-04-15 15:33:45', NULL, '2025-04-15 15:33:45', NULL, NULL),
(31, 2, 10, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'h7j810b2vm1u5t4tx3zph', NULL, '2025-04-16 07:40:57', NULL, '2025-04-16 07:40:57', NULL, NULL),
(32, 2, 10, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', '4l950w9zirqkkrpjy1tic8', NULL, '2025-04-16 07:40:57', NULL, '2025-04-16 07:40:57', NULL, NULL),
(33, 2, 10, 0, 'farhanshakirqureshi@gmail.com', NULL, NULL, NULL, 'sent', 'ldkmjg2zvphdyh0cz2y6hv', NULL, '2025-04-16 07:40:57', NULL, '2025-04-16 07:40:57', NULL, NULL),
(34, 2, 11, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', '244jo06jvyhyo7f24oee4s', NULL, '2025-04-16 07:41:02', NULL, '2025-04-16 07:41:02', NULL, NULL),
(35, 2, 11, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'htlly8h0v2uqu31lglasa', NULL, '2025-04-16 07:41:02', NULL, '2025-04-16 07:41:02', NULL, NULL),
(36, 2, 11, 0, 'farhanshakirqureshi@gmail.com', NULL, NULL, NULL, 'sent', '5o46cdadyewaf15d7sko3', NULL, '2025-04-16 07:41:02', NULL, '2025-04-16 07:41:02', NULL, NULL),
(37, 2, 12, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', '6agia69fa5tlvi544kj2l', NULL, '2025-04-16 07:41:41', NULL, '2025-04-16 07:41:41', NULL, NULL),
(38, 2, 12, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', '7lw9nv8k33eqa1z3d9mewa', NULL, '2025-04-16 07:41:41', NULL, '2025-04-16 07:41:41', NULL, NULL),
(39, 2, 12, 0, 'farhanshakirqureshi@gmail.com', NULL, NULL, NULL, 'sent', '31qex58t88o8lq9nkwozyb', NULL, '2025-04-16 07:41:41', NULL, '2025-04-16 07:41:41', NULL, NULL),
(40, 2, 13, 0, 'sana.faiz.muet83@gmail.com', NULL, NULL, NULL, 'sent', 'xktw4wzqqxadikozb6umk4', NULL, '2025-04-16 07:42:59', NULL, '2025-04-16 07:42:59', NULL, NULL),
(41, 2, 13, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'imcg9sitxnfndx86fucwh', NULL, '2025-04-16 07:42:59', NULL, '2025-04-16 07:42:59', NULL, NULL),
(42, 2, 13, 0, 'farhanshakirqureshi@gmail.com', NULL, NULL, NULL, 'sent', 'tgrkliarosbbc9eoir6bt', NULL, '2025-04-16 07:42:59', NULL, '2025-04-16 07:42:59', NULL, NULL),
(43, 2, 1, 26, 'anamrazaq236@gmail.com', 'anam', 'razaq', NULL, 'sent', NULL, NULL, '2025-04-28 11:37:10', NULL, '2025-04-28 11:37:10', NULL, NULL),
(44, 2, 1, 53, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, 'sent', NULL, NULL, '2025-04-30 08:15:07', NULL, '2025-04-30 08:15:07', NULL, NULL),
(45, 2, 34, 0, 'vilysopyru@mailinator.com', NULL, NULL, NULL, 'sent', '5ofrwdkt74y4aj2wbky3r1', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(46, 2, 34, 0, 'zydozarad@mailinator.com', NULL, NULL, NULL, 'sent', '6ig8x8s1u2aaf8as4bav37', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(47, 2, 34, 0, 'funinaku@mailinator.com', NULL, NULL, NULL, 'sent', 'jbh8sbkxs6diwsmzppkpjk', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(48, 2, 34, 0, 'tomyj@mailinator.com', NULL, NULL, NULL, 'sent', '09g3f549f9mfb5sno947ri', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(49, 2, 34, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'g0fx923drskvnlne9nhhd', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(50, 2, 34, 0, 'anamrazaq236@gmail.com', NULL, NULL, NULL, 'sent', 'hltescjyp8og8dpiy9yn2e', NULL, '2025-05-16 10:47:07', NULL, '2025-05-16 10:47:07', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(51, 2, 36, 0, 'vilysopyru@mailinator.com', NULL, NULL, NULL, 'sent', '5m0cflndelp8odzog9wd0f', NULL, '2025-05-16 11:01:04', NULL, '2025-05-16 11:01:04', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(52, 2, 36, 0, 'zydozarad@mailinator.com', NULL, NULL, NULL, 'sent', 'jobzpcz8nnjsyuesvtih', NULL, '2025-05-16 11:01:05', NULL, '2025-05-16 11:01:05', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(53, 2, 36, 0, 'funinaku@mailinator.com', NULL, NULL, NULL, 'sent', 'ey14qosjha1zmhvlujqbp', NULL, '2025-05-16 11:01:05', NULL, '2025-05-16 11:01:05', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(54, 2, 36, 0, 'tomyj@mailinator.com', NULL, NULL, NULL, 'sent', 'ec4984rhorrqf2fkc8q2rj', NULL, '2025-05-16 11:01:05', NULL, '2025-05-16 11:01:05', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(55, 2, 36, 0, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'avov9dwu6ld8ax73q7u54i', NULL, '2025-05-16 11:01:05', NULL, '2025-05-16 11:01:05', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(56, 2, 36, 0, 'anamrazaq236@gmail.com', NULL, NULL, NULL, 'sent', 'od12jtp9elo9k5cf2javm', NULL, '2025-05-16 11:01:05', NULL, '2025-05-16 11:01:05', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(57, 2, 37, 13, 'vilysopyru@mailinator.com', NULL, NULL, NULL, 'sent', 'ozc8fqftid923n84yeyasz', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(58, 2, 37, 15, 'zydozarad@mailinator.com', NULL, NULL, NULL, 'sent', 'f1n7ay49sdumgog7gdkdp', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(59, 2, 37, 17, 'funinaku@mailinator.com', NULL, NULL, NULL, 'sent', '4exruxdkn1iyap316pxwfr', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(60, 2, 37, 18, 'tomyj@mailinator.com', NULL, NULL, NULL, 'sent', 'hzxsmiwstrj2ei6daqcpkh', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(61, 2, 37, 19, 'xofajosuku@mailinator.com', NULL, NULL, NULL, 'sent', 'kgnl6thm7xhbwd7x75ihz', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(62, 2, 37, 53, 'anamrazaq236@gmail.com', NULL, NULL, NULL, 'sent', 'vkacrtzl49zbteb9eks3i', NULL, '2025-05-16 11:08:54', NULL, '2025-05-16 11:08:54', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(63, 2, 38, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, 'sent', '0uzjvljxrbeox29k7z9st', NULL, '2025-05-16 11:16:59', NULL, '2025-05-16 11:16:59', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(64, 2, 38, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, 'sent', 'gj7g6l6sphrvl4z26pwse', NULL, '2025-05-16 11:16:59', NULL, '2025-05-16 11:16:59', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(65, 2, 38, 17, 'funinaku@mailinator.com', 'Clayton', 'Lamb', NULL, 'sent', 'm32472lkgomgfx9yj53s', NULL, '2025-05-16 11:16:59', NULL, '2025-05-16 11:16:59', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(66, 2, 38, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, 'sent', 'elasq3rsciu4nmf6su8296', NULL, '2025-05-16 11:17:00', NULL, '2025-05-16 11:17:00', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(67, 2, 38, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, 'sent', 'pt5ski0yqg1xg2fkzgytc', NULL, '2025-05-16 11:17:00', NULL, '2025-05-16 11:17:00', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(68, 2, 38, 53, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, 'sent', 'mn4mpuh63kn5wmybng6c06', NULL, '2025-05-16 11:17:00', NULL, '2025-05-16 11:17:00', '/uploads/video_temp/video-1747391598935-107199602.mp4', '/uploads/video_temp/video-1747391646867-544935153.mp4'),
(69, 2, 39, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, 'sent', 'dblmsu9rfs8yj2v9iu9gjq', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(70, 2, 39, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, 'sent', 'zprib08vnc2xvwlkpghm1', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(71, 2, 39, 16, 'fugutylada@mailinator.com', 'Aquila', 'Shepard', NULL, 'sent', 'yy1e4hg7yc9jm83sgj5x3', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(72, 2, 39, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, 'sent', 'a91honx2yvcrwlr9ggoq8c', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(73, 2, 39, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, 'sent', '0ddngsc55adq33dlrokoiy6', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(74, 2, 39, 20, 'pacu@mailinator.com', 'Ulric', 'Gardner', NULL, 'sent', '3l1xg9xx5w7b3oc9oug9wi', NULL, '2025-05-16 11:21:20', NULL, '2025-05-16 11:21:20', '/uploads/video_temp/video-1747394428709-166368083.mp4', '/uploads/video_temp/video-1747394454802-695702636.mp4'),
(75, 2, 40, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, 'sent', 'nn20t0m6dk9wi99i2v7xq', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(76, 2, 40, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, 'sent', '7rnrr9ahnhhvxi6dm84ro', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(77, 2, 40, 16, 'fugutylada@mailinator.com', 'Aquila', 'Shepard', NULL, 'sent', 'z4lnqn0veai8s19zirq32o', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(78, 2, 40, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, 'sent', 'u4qh035geumto7jh7xd4ij', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(79, 2, 40, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, 'sent', '8fv4m1lhkfdlrv1op1soca', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(80, 2, 40, 20, 'pacu@mailinator.com', 'Ulric', 'Gardner', NULL, 'sent', '0quoktutun2iiw65n8glvq', NULL, '2025-05-16 12:05:24', NULL, '2025-05-16 12:05:24', '/uploads/video_temp/video-1747396871952-101864122.mp4', '/uploads/video_temp/video-1747396878979-227229578.mp4'),
(88, 2, 43, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, '', 'b8cf284f-80f4-452a-b9ea-75cfb8d1caa0', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(89, 2, 43, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, '', '041bb791-a5e5-4d81-96c4-88dc9807d045', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(90, 2, 43, 17, 'funinaku@mailinator.com', 'Clayton', 'Lamb', NULL, '', '3d0b864d-9bc0-4f54-ab95-c0bd3984d4d6', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(91, 2, 43, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, '', '9ce73d69-3af4-46da-8f74-7a61282068d3', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(92, 2, 43, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, '', '8d467070-e6ae-4fe1-90a0-ad7a7e5f9954', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(93, 2, 43, 53, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, '', '24984bb6-e7c2-40b9-8ad4-32815b38d22f', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(94, 2, 43, 56, 'anamrazaq236@gmail.com', '', '', NULL, '', 'fc29465b-d505-4b1e-ab34-9a74a06ed2a3', NULL, '2025-07-02 10:00:53', NULL, '2025-07-02 10:00:53', '/uploads/video_temp/video-1751450385569-900869695.mp4', '/uploads/video_temp/video-1751450439133-538650774.mp4'),
(95, 2, 43, 0, 'develoeprs_hub@gmail.com', 'Anam', 'Razaq', NULL, '', '7e37093e-3c37-45b1-a990-9519c5300277', NULL, '2025-07-02 10:05:23', NULL, '2025-07-02 10:05:23', NULL, NULL),
(96, 2, 44, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, '', '17f4cb6f-f38a-4741-975d-2fdc9976a0cd', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(97, 2, 44, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, '', '9b67277e-5c3b-4835-83a2-dc8e103f24ac', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(98, 2, 44, 17, 'funinaku@mailinator.com', 'Clayton', 'Lamb', NULL, '', '41e3d6e2-cc3d-4823-bac1-1badc383828d', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(99, 2, 44, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, '', 'ac4ae048-5315-448a-bb6e-534d00140513', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(100, 2, 44, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, '', 'a34b4165-6088-484a-85b2-a4691ea80230', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(101, 2, 44, 53, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, '', '16f3091b-ee6e-4c15-8e84-60b2cb7bbc29', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(102, 2, 44, 56, 'anamrazaq236@gmail.com', '', '', NULL, '', '5d892acf-4c51-4010-a064-c5c0fa96ee52', NULL, '2025-07-02 10:14:02', NULL, '2025-07-02 10:14:02', '/uploads/video_temp/video-1751451177767-478569286.mp4', '/uploads/video_temp/video-1751451226712-73283316.mp4'),
(103, 2, 45, 13, 'vilysopyru@mailinator.com', 'Kylie', 'Wall', NULL, 'unsent', '242d0ea7-6b4d-4a58-8b57-62e8a76e6a41', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(104, 2, 45, 15, 'zydozarad@mailinator.com', 'Kennedy', 'Lowery', NULL, 'unsent', 'c4d29ed5-1786-442f-b737-db8befad1a08', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(105, 2, 45, 17, 'funinaku@mailinator.com', 'Clayton', 'Lamb', NULL, 'unsent', 'fd3f7883-21a9-487c-ae67-95c476eee597', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(106, 2, 45, 18, 'tomyj@mailinator.com', 'Maxwell', 'Sheppard', NULL, 'unsent', '08a9dfd5-cdb8-477b-96ae-bb566d257a0d', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(107, 2, 45, 19, 'xofajosuku@mailinator.com', 'Reece', 'Valentine', NULL, 'unsent', '224bef50-fd4e-4298-8741-1a42b16054cd', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(108, 2, 45, 53, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, 'unsent', '11575d99-288b-44e6-9a5d-833886f2a277', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(109, 2, 45, 56, 'anamrazaq236@gmail.com', '', '', NULL, 'unsent', 'a53b7418-74c5-4608-93d9-f5445acae16b', NULL, '2025-07-02 10:23:02', NULL, '2025-07-02 10:23:02', '/uploads/video_temp/video-1751451718352-173618348.mp4', '/uploads/video_temp/video-1751451725502-562166654.mp4'),
(114, 2, 45, 63, 'anamrazaq236@gmail.com', 'Anam', 'Razaq', NULL, 'unsent', NULL, NULL, '2025-07-02 10:51:27', NULL, '2025-07-02 10:51:27', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `salary_range` varchar(255) DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `organization_id`, `title`, `description`, `location`, `salary_range`, `application_deadline`, `created_at`, `updated_at`) VALUES
(1, 2, 'Numquam porro perspi', 'Modi rem lorem inven', 'Est facilis est ess', '123456', '2025-04-30', '2025-04-13 04:08:31', '2025-04-13 04:08:31'),
(2, 2, 'frontend developer', 'dskfdkfl;dsfklds', 'lahore', '50000', '2025-05-15', '2025-05-02 05:56:09', '2025-05-02 05:56:09'),
(3, 2, 'Backend Developer', 'jsgdjsgdjgsdhsdjsgdjag', 'Pakistan', '60000', '2025-05-27', '2025-05-16 12:05:24', '2025-05-16 12:05:24');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `interview_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `subject`, `message`, `is_read`, `created_at`, `interview_id`) VALUES
(2, 2, 'New Interview Assignment', 'Dear ali shan, you have been assigned to the interview: \"Database Management System (DBMS)\".', 1, '2025-07-02 15:00:53', 43),
(4, 2, 'New Interview Assignment', 'Dear ali shan, you have been assigned to the interview: \"Operating system\".', 0, '2025-07-02 15:23:02', 45);

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `company_name`, `logo`, `address`, `city`, `state`, `country`, `phone_number`, `email`, `title`, `created_at`, `updated_at`) VALUES
(1, 'keydevs', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-13 03:56:31', '2025-05-14 11:14:03'),
(2, 'keydevs', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-13 03:58:18', '2025-05-14 11:14:03'),
(3, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:01:16', '2025-05-14 11:14:03'),
(4, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:18:00', '2025-05-14 11:14:03'),
(5, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:20:57', '2025-05-14 11:14:03'),
(6, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:34:58', '2025-05-14 11:14:03'),
(7, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:37:01', '2025-05-14 11:14:03'),
(8, 'Keydevs Technologies', 'https://keydevs.net/assets/front/img/6010132d43332.png', 'Johar Town', 'Lahore', 'Punjab', 'Pakistan', '+92-300-1234567', 'contact@keydevs.net', 'Leading Web & App Development Company', '2025-04-29 06:37:40', '2025-05-14 11:14:03'),
(9, 'DevelopersHub', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-02 07:09:26', '2025-07-02 07:09:26');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `type` enum('video','text','file','audio','multiple_choice') DEFAULT 'video',
  `time_limit` int(11) DEFAULT NULL,
  `retake` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `interview_id`, `text`, `type`, `time_limit`, `retake`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Delectus expedita e', 'text', 97, NULL, NULL, '2025-04-13 06:26:33', '2025-04-13 10:16:37'),
(2, 1, 'Harum consequatur E', 'text', 92, NULL, NULL, '2025-04-13 06:26:33', '2025-04-13 06:26:33'),
(3, 1, 'Esse quam voluptate', 'video', 47, NULL, NULL, '2025-04-13 06:26:33', '2025-04-13 06:26:33'),
(4, 1, 'Magnam autem quasi e', 'video', 90, NULL, NULL, '2025-04-13 06:26:33', '2025-04-13 06:26:33'),
(5, 3, 'fasdfasdf', 'video', 60, NULL, NULL, '2025-04-13 07:32:01', '2025-04-13 07:32:01'),
(6, 3, 'fdadf', 'text', 60, NULL, NULL, '2025-04-13 07:32:01', '2025-04-13 07:32:01'),
(7, 4, 'asdfasdf', 'video', 60, NULL, NULL, '2025-04-13 08:55:20', '2025-04-13 08:55:20'),
(8, 4, 'asdfasdf', 'file', 60, NULL, NULL, '2025-04-13 08:55:20', '2025-04-13 08:55:20'),
(9, 4, 'adfdsasdf', 'text', 60, NULL, NULL, '2025-04-13 08:55:20', '2025-04-13 08:55:20'),
(10, 5, 'asdfasdf', 'video', 60, NULL, NULL, '2025-04-13 09:00:31', '2025-04-13 09:00:31'),
(11, 5, 'asdfasdf', 'file', 60, NULL, NULL, '2025-04-13 09:00:31', '2025-04-13 09:00:31'),
(12, 5, 'adfdsasdf', 'text', 60, NULL, NULL, '2025-04-13 09:00:31', '2025-04-13 09:00:31'),
(13, 2, 'hello', 'video', 60, NULL, NULL, '2025-04-13 12:12:40', '2025-04-13 12:12:40'),
(14, 2, 'how are you?', 'video', 90, NULL, NULL, '2025-04-13 12:12:47', '2025-04-13 12:12:47'),
(15, 2, 'amzing', 'text', 60, NULL, NULL, '2025-04-13 12:12:52', '2025-04-13 12:12:52'),
(16, 6, 'what is javascript', 'video', 60, NULL, NULL, '2025-04-15 09:59:18', '2025-04-15 09:59:18'),
(17, 7, 'what is javascript', 'video', 60, NULL, NULL, '2025-04-15 09:59:45', '2025-04-15 09:59:45'),
(18, 7, 'what are the best SEO tools', 'text', 60, NULL, NULL, '2025-04-15 09:59:45', '2025-04-15 09:59:45'),
(19, 7, 'what are 5 title', 'file', 60, NULL, NULL, '2025-04-15 09:59:45', '2025-04-15 09:59:45'),
(20, 8, 'what is javascript', 'video', 60, NULL, NULL, '2025-04-15 09:59:55', '2025-04-15 09:59:55'),
(21, 8, 'what are the best SEO tools', 'text', 60, NULL, NULL, '2025-04-15 09:59:55', '2025-04-15 09:59:55'),
(22, 8, 'what are 5 title', 'file', 60, NULL, NULL, '2025-04-15 09:59:55', '2025-04-15 09:59:55'),
(23, 9, 'Please upload you latest design work', 'file', 60, NULL, NULL, '2025-04-15 15:33:45', '2025-04-15 15:33:45'),
(24, 9, 'What are the top by design styles', 'video', 60, NULL, NULL, '2025-04-15 15:33:45', '2025-04-15 15:33:45'),
(25, 9, 'Explain color theory', 'text', 60, NULL, NULL, '2025-04-15 15:33:45', '2025-04-15 15:33:45'),
(26, 10, 'asfasdf', 'video', 60, NULL, NULL, '2025-04-16 07:40:57', '2025-04-16 07:40:57'),
(27, 11, 'asfasdf', 'video', 60, NULL, NULL, '2025-04-16 07:41:02', '2025-04-16 07:41:02'),
(28, 11, 'asfasdf', 'text', 60, NULL, NULL, '2025-04-16 07:41:02', '2025-04-16 07:41:02'),
(29, 12, 'asfasdf', 'video', 60, NULL, NULL, '2025-04-16 07:41:41', '2025-04-16 07:41:41'),
(30, 12, 'asfasdf', 'text', 60, NULL, NULL, '2025-04-16 07:41:41', '2025-04-16 07:41:41'),
(31, 13, 'asfasdf', 'video', 60, NULL, NULL, '2025-04-16 07:42:59', '2025-04-16 07:42:59'),
(32, 13, 'asfasdf', 'text', 60, NULL, NULL, '2025-04-16 07:42:59', '2025-04-16 07:42:59'),
(33, 14, '', 'video', 2, NULL, NULL, '2025-05-15 10:06:45', '2025-05-15 10:06:45'),
(34, 15, 'sdhgdhjgdhjgdhjdghsgd', '', 2, NULL, NULL, '2025-05-15 10:06:54', '2025-05-15 10:06:54'),
(35, 15, '', 'video', 2, NULL, NULL, '2025-05-15 10:06:54', '2025-05-15 10:06:54'),
(36, 16, 'sdhgdhjgdhjgdhjdghsgd', '', 2, NULL, NULL, '2025-05-15 10:07:01', '2025-05-15 10:07:01'),
(37, 16, 'wdhjgdhjgdhjgfgfjdg', 'video', 2, NULL, NULL, '2025-05-15 10:07:01', '2025-05-15 10:07:01'),
(38, 16, '', 'video', 2, NULL, NULL, '2025-05-15 10:07:01', '2025-05-15 10:07:01'),
(39, 17, 'sdhgdhjgdhjgdhjdghsgd', '', 2, NULL, NULL, '2025-05-15 10:08:40', '2025-05-15 10:08:40'),
(40, 17, 'wdhjgdhjgdhjgfgfjdg', 'video', 2, NULL, NULL, '2025-05-15 10:08:40', '2025-05-15 10:08:40'),
(41, 17, 'gdhsgdhjdghjs', '', 2, NULL, NULL, '2025-05-15 10:08:40', '2025-05-15 10:08:40'),
(42, 17, '', 'video', 2, NULL, NULL, '2025-05-15 10:08:40', '2025-05-15 10:08:40'),
(43, 18, 'sdhgdhjgdhjgdhjdghsgd', '', 2, NULL, NULL, '2025-05-15 10:10:11', '2025-05-15 10:10:11'),
(44, 18, 'wdhjgdhjgdhjgfgfjdg', 'video', 2, NULL, NULL, '2025-05-15 10:10:11', '2025-05-15 10:10:11'),
(45, 18, 'gdhsgdhjdghjs', '', 2, NULL, NULL, '2025-05-15 10:10:11', '2025-05-15 10:10:11'),
(46, 18, '', 'video', 2, NULL, NULL, '2025-05-15 10:10:11', '2025-05-15 10:10:11'),
(47, 20, 'ksjdksjdklsjdksjdkls', 'video', 2, NULL, NULL, '2025-05-16 05:21:52', '2025-05-16 05:21:52'),
(48, 20, 'asdksdjksdhjksdks', '', 2, NULL, NULL, '2025-05-16 05:21:52', '2025-05-16 05:21:52'),
(49, 20, 'sjskhdjkshdsjkdhskj', '', 2, NULL, NULL, '2025-05-16 05:21:52', '2025-05-16 05:21:52'),
(50, 21, 'ksjdksjdklsjdksjdkls', 'video', 2, NULL, NULL, '2025-05-16 05:26:38', '2025-05-16 05:26:38'),
(51, 21, 'asdksdjksdhjksdks', '', 2, NULL, NULL, '2025-05-16 05:26:38', '2025-05-16 05:26:38'),
(52, 21, 'sjskhdjkshdsjkdhskj', '', 2, NULL, NULL, '2025-05-16 05:26:38', '2025-05-16 05:26:38'),
(53, 22, 'ksjdksjdklsjdksjdkls', 'video', 2, NULL, NULL, '2025-05-16 05:43:35', '2025-05-16 05:43:35'),
(54, 22, 'asdksdjksdhjksdks', '', 2, NULL, NULL, '2025-05-16 05:43:35', '2025-05-16 05:43:35'),
(55, 22, 'sjskhdjkshdsjkdhskj', '', 2, NULL, NULL, '2025-05-16 05:43:35', '2025-05-16 05:43:35'),
(56, 23, 'ksjdksjdklsjdksjdkls', 'video', 2, NULL, NULL, '2025-05-16 05:48:43', '2025-05-16 05:48:43'),
(57, 23, 'asdksdjksdhjksdks', '', 2, NULL, NULL, '2025-05-16 05:48:43', '2025-05-16 05:48:43'),
(58, 23, 'sjskhdjkshdsjkdhskj', '', 2, NULL, NULL, '2025-05-16 05:48:43', '2025-05-16 05:48:43'),
(59, 24, 'sjdshgdhjgsd', 'video', 2, NULL, NULL, '2025-05-16 06:35:33', '2025-05-16 06:35:33'),
(60, 24, 'dsdjsgdjhgsds', '', 2, NULL, NULL, '2025-05-16 06:35:33', '2025-05-16 06:35:33'),
(61, 25, 'efkjhkjdhgkjdhgkjd', 'video', 2, NULL, NULL, '2025-05-16 07:46:43', '2025-05-16 07:46:43'),
(62, 25, 'skdfkjdsfjdkfhkjd', '', 2, NULL, NULL, '2025-05-16 07:46:43', '2025-05-16 07:46:43'),
(63, 26, 'dkfklfjkflfklgjkl', 'video', 2, NULL, NULL, '2025-05-16 07:53:06', '2025-05-16 07:53:06'),
(64, 26, 'dkfklkljgklgj', '', 2, NULL, NULL, '2025-05-16 07:53:06', '2025-05-16 07:53:06'),
(65, 27, 'hkjhfkjashfjskhfsj', 'video', 2, NULL, NULL, '2025-05-16 08:06:47', '2025-05-16 08:06:47'),
(66, 27, 'dhsajkdhsjkadhskjdsjk', '', 2, NULL, NULL, '2025-05-16 08:06:47', '2025-05-16 08:06:47'),
(67, 28, 'hkjhfkjashfjskhfsj', 'video', 2, NULL, NULL, '2025-05-16 08:10:02', '2025-05-16 08:10:02'),
(68, 28, 'dhsajkdhsjkadhskjdsjk', '', 2, NULL, NULL, '2025-05-16 08:10:02', '2025-05-16 08:10:02'),
(69, 29, 'asdghjsgdjgsdjs', 'video', 2, NULL, NULL, '2025-05-16 09:19:50', '2025-05-16 09:19:50'),
(70, 29, 'sakhdjkshdkjshd', '', 2, NULL, NULL, '2025-05-16 09:19:50', '2025-05-16 09:19:50'),
(71, 29, 'sadhksjdhksjhd', '', 2, NULL, NULL, '2025-05-16 09:19:50', '2025-05-16 09:19:50'),
(72, 30, 'asdghjsgdjgsdjs', 'video', 2, NULL, NULL, '2025-05-16 09:27:49', '2025-05-16 09:27:49'),
(73, 30, 'sakhdjkshdkjshd', '', 2, NULL, NULL, '2025-05-16 09:27:49', '2025-05-16 09:27:49'),
(74, 30, 'sadhksjdhksjhd', '', 2, NULL, NULL, '2025-05-16 09:27:49', '2025-05-16 09:27:49'),
(75, 31, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 10:34:19', '2025-05-16 10:34:19'),
(76, 31, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 10:34:19', '2025-05-16 10:34:19'),
(77, 32, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 10:36:13', '2025-05-16 10:36:13'),
(78, 32, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 10:36:13', '2025-05-16 10:36:13'),
(79, 33, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 10:42:54', '2025-05-16 10:42:54'),
(80, 33, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 10:42:54', '2025-05-16 10:42:54'),
(81, 34, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 10:47:07', '2025-05-16 10:47:07'),
(82, 34, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 10:47:07', '2025-05-16 10:47:07'),
(83, 35, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 10:49:56', '2025-05-16 10:49:56'),
(84, 35, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 10:49:56', '2025-05-16 10:49:56'),
(85, 36, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 11:01:04', '2025-05-16 11:01:04'),
(86, 36, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 11:01:04', '2025-05-16 11:01:04'),
(87, 37, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 11:08:54', '2025-05-16 11:08:54'),
(88, 37, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 11:08:54', '2025-05-16 11:08:54'),
(89, 38, 'ajdkjsdklsjdsfhjgfj', 'video', 2, NULL, NULL, '2025-05-16 11:16:59', '2025-05-16 11:16:59'),
(90, 38, 'fjdjfkldjfkldjfkldjf', '', 2, NULL, NULL, '2025-05-16 11:16:59', '2025-05-16 11:16:59'),
(91, 39, 'khgkjfhgjkfgh', 'video', 2, NULL, NULL, '2025-05-16 11:21:20', '2025-05-16 11:21:20'),
(92, 39, 'ghjkfghfkjghkjf', '', 2, NULL, NULL, '2025-05-16 11:21:20', '2025-05-16 11:21:20'),
(93, 40, 'agdhgsdhsgdhs', 'video', 2, NULL, NULL, '2025-05-16 12:05:24', '2025-05-16 12:05:24'),
(94, 40, 'akdhjkshdkjshdkjsdh', '', 2, NULL, NULL, '2025-05-16 12:05:24', '2025-05-16 12:05:24'),
(101, 43, 'What is database??', 'video', 60, NULL, NULL, '2025-07-02 10:00:53', '2025-07-02 10:00:53'),
(102, 43, 'What is data and information', 'text', 60, NULL, NULL, '2025-07-02 10:00:53', '2025-07-02 10:00:53'),
(103, 43, 'how we can insert data in database', 'file', 60, NULL, NULL, '2025-07-02 10:00:53', '2025-07-02 10:00:53'),
(107, 45, 'what is operating system??', 'video', 60, NULL, NULL, '2025-07-02 10:23:02', '2025-07-02 10:23:02'),
(108, 45, 'what is context switch??', 'text', 60, NULL, NULL, '2025-07-02 10:23:02', '2025-07-02 10:23:02'),
(109, 45, 'what is memory management??', 'file', 60, NULL, NULL, '2025-07-02 10:23:02', '2025-07-02 10:23:02');

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `response_type` enum('video','text','file') NOT NULL,
  `status` enum('pending','submitted','reviewed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`id`, `interview_id`, `question_id`, `cv_id`, `response_type`, `status`, `created_at`) VALUES
(1, 1, 1, 0, 'text', 'submitted', '2025-04-13 12:06:40'),
(2, 1, 2, 0, 'text', 'submitted', '2025-04-13 12:06:46'),
(3, 1, 3, 0, 'video', 'submitted', '2025-04-13 12:06:59'),
(4, 1, 4, 0, 'video', 'submitted', '2025-04-13 12:07:12'),
(5, 2, 13, 17, 'video', 'submitted', '2025-04-13 12:14:42'),
(6, 2, 14, 17, 'video', 'submitted', '2025-04-13 12:14:53'),
(7, 2, 15, 17, 'text', 'submitted', '2025-04-13 12:16:04'),
(8, 2, 13, 18, 'video', 'submitted', '2025-04-13 12:26:26'),
(9, 2, 14, 18, 'video', 'submitted', '2025-04-13 12:26:32'),
(10, 2, 15, 18, 'text', 'submitted', '2025-04-13 12:26:37'),
(11, 1, 1, 19, 'text', 'submitted', '2025-04-14 10:34:21'),
(12, 1, 2, 19, 'text', 'submitted', '2025-04-14 10:34:27'),
(13, 1, 1, 20, 'text', 'submitted', '2025-04-14 10:36:50'),
(14, 1, 2, 20, 'text', 'submitted', '2025-04-14 10:36:57'),
(15, 1, 3, 20, 'video', 'submitted', '2025-04-14 10:37:18'),
(16, 1, 4, 20, 'video', 'submitted', '2025-04-14 10:37:32'),
(17, 1, 1, 22, 'text', 'submitted', '2025-04-15 10:01:38'),
(18, 1, 2, 22, 'text', 'submitted', '2025-04-15 10:01:44'),
(19, 1, 3, 22, 'video', 'submitted', '2025-04-15 10:02:02'),
(20, 1, 4, 22, 'video', 'submitted', '2025-04-15 10:02:11'),
(21, 2, 13, 24, 'video', 'submitted', '2025-04-15 15:30:02'),
(22, 2, 14, 24, 'video', 'submitted', '2025-04-15 15:30:23'),
(23, 2, 15, 24, 'text', 'submitted', '2025-04-15 15:30:29'),
(24, 1, 1, 26, 'text', 'submitted', '2025-04-28 11:40:10'),
(25, 1, 2, 26, 'text', 'submitted', '2025-04-28 11:40:21'),
(26, 1, 3, 26, 'video', 'submitted', '2025-04-28 11:41:03'),
(27, 1, 4, 26, 'video', 'submitted', '2025-04-28 11:41:17'),
(31, 45, 107, 59, 'video', 'submitted', '2025-07-02 10:31:21'),
(32, 45, 108, 59, 'text', 'submitted', '2025-07-02 10:31:34'),
(33, 45, 109, 59, 'file', 'submitted', '2025-07-02 10:31:49'),
(37, 45, 108, 62, 'text', 'submitted', '2025-07-02 10:48:02'),
(39, 45, 107, 63, 'video', 'submitted', '2025-07-02 10:52:03'),
(40, 45, 108, 63, 'text', 'submitted', '2025-07-02 10:52:12'),
(41, 45, 109, 63, 'file', 'submitted', '2025-07-02 10:52:26'),
(42, 45, 107, 0, 'video', 'submitted', '2025-07-02 11:22:27');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `permissions`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Full access to the system', '[\"create\", \"read\", \"update\", \"delete\"]', '2025-07-02 07:32:55', '2025-07-02 07:32:55'),
(2, 'manager', 'Can view user list and create interviews', '[\"view_users\", \"create_interviews\"]', '2025-07-02 07:32:55', '2025-07-02 07:35:44'),
(3, 'hr', 'Can conduct interviews and see results', '[\"conduct_interviews\", \"view_results\"]', '2025-07-02 07:32:55', '2025-07-02 07:35:44');

-- --------------------------------------------------------

--
-- Table structure for table `text_responses`
--

CREATE TABLE `text_responses` (
  `id` int(11) NOT NULL,
  `response_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `text_responses`
--

INSERT INTO `text_responses` (`id`, `response_id`, `text`, `created_at`) VALUES
(1, 1, 'hello', '2025-04-13 12:06:40'),
(2, 2, 'test', '2025-04-13 12:06:46'),
(3, 7, 'sdfsdf asdfasdfasdf', '2025-04-13 12:16:04'),
(4, 10, 'fsdfsdfasdf', '2025-04-13 12:26:37'),
(5, 11, 'this is amazing', '2025-04-14 10:34:21'),
(6, 12, 'how are you?', '2025-04-14 10:34:27'),
(7, 13, 'hellos', '2025-04-14 10:36:50'),
(8, 14, 'everthing ok', '2025-04-14 10:36:57'),
(9, 17, 'ok', '2025-04-15 10:01:38'),
(10, 18, 'yes it', '2025-04-15 10:01:44'),
(11, 23, 'e limit: 60 seconds', '2025-04-15 15:30:29'),
(12, 24, 'dsdfs sdfsdf', '2025-04-28 11:40:10'),
(13, 25, 'jhjhjhj', '2025-04-28 11:40:22'),
(15, 32, 'asdkshdk sjdkshdjkshdkjsh sjkdhs', '2025-07-02 10:31:34'),
(16, 37, 'shdjshdjshdjshdjshds', '2025-07-02 10:48:02'),
(17, 40, 'skhdjkshdj kshdjkshdjkshdkjsahdka', '2025-07-02 10:52:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `organization_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active',
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role_id`, `organization_id`, `created_at`, `updated_at`, `status`, `profile_image`) VALUES
(1, 'anam@gmail.com', '$2b$10$JCSX.XGYvJbYr3XBKlPJROhwEtDUS.dhbmGWQoq/TqCs6l14QYAOu', 'ali', 'shan', 1, 1, '2025-04-13 03:56:31', '2025-07-02 06:19:14', 'active', 'http://localhost:3001/uploads/profileImg_temp/default_profile.jpg\r\n'),
(2, 'admin@gmail.com', '$2b$10$TB59XrJJ7GuoJbgt1uGa5OdiENpR.aK4LlkSFQEaOD/cOvHll1EyC', 'ali', 'shan', 1, 2, '2025-04-13 03:58:19', '2025-07-02 07:37:47', 'active', 'http://localhost:3001/uploads/profileImg_temp/img-1751441804202-897528932.png'),
(8, 'anamrazaq222@gmail.com', '$2b$10$pKVeFMy4ojc/gp4Za22VSe/mD6XPWOc7Dw5VYG1ybHbyUeKmzev6u', 'Anam', 'Razaq', 1, 8, '2025-04-29 06:37:40', '2025-07-02 06:19:21', 'active', 'http://localhost:3001/uploads/profileImg_temp/default_profile.jpg\r\n'),
(9, 'anamrazaq201@gmail.com', '$2b$10$hQO0i0z/6Xe4RfyGyutIGe18tDZjL6FQnjhQISxnWMnYZGAS9qZbK', 'Anam', 'Razaq', 3, 2, '2025-05-16 12:05:24', '2025-07-02 07:48:12', 'active', 'http://localhost:3001/uploads/profileImg_temp/default_profile.jpg\r\n'),
(11, 'zainali123@gmail.com', '$2b$10$qfO8DxGjIKVvkXQ.KGOM9OQ.leXAm3MVl4Gqp/Etqh5W/C.66NTWa', 'Zain', 'Ali', 2, 2, '2025-07-02 07:44:26', '2025-07-02 08:01:22', 'inactive', 'http://localhost:3001/uploads/profileImg_temp/default_profile.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `video_responses`
--

CREATE TABLE `video_responses` (
  `id` int(11) NOT NULL,
  `response_id` int(11) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `video_responses`
--

INSERT INTO `video_responses` (`id`, `response_id`, `video_url`, `duration`, `created_at`) VALUES
(1, 3, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744546019235-27334876.webm', NULL, '2025-04-13 12:06:59'),
(2, 4, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744546032915-542453249.webm', NULL, '2025-04-13 12:07:12'),
(3, 5, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744546482901-251391254.webm', NULL, '2025-04-13 12:14:42'),
(4, 6, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744546493352-739981799.webm', NULL, '2025-04-13 12:14:53'),
(5, 8, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744547186519-275890676.webm', NULL, '2025-04-13 12:26:26'),
(6, 9, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744547192176-619658890.webm', NULL, '2025-04-13 12:26:32'),
(7, 15, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744627038157-262821925.webm', NULL, '2025-04-14 10:37:18'),
(8, 16, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744627052473-743920277.webm', NULL, '2025-04-14 10:37:32'),
(9, 19, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744711322745-800700495.webm', NULL, '2025-04-15 10:02:02'),
(10, 20, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744711331142-767989923.webm', NULL, '2025-04-15 10:02:11'),
(11, 21, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744731002852-816549054.webm', NULL, '2025-04-15 15:30:02'),
(12, 22, 'M:\\aiinterview\\project\\backend\\uploads\\responseFile-1744731023143-623390219.webm', NULL, '2025-04-15 15:30:23'),
(13, 26, 'C:\\Users\\CITY C\\Downloads\\project\\backend\\uploads\\responseFile-1745840463924-830874370.webm', NULL, '2025-04-28 11:41:03'),
(14, 27, 'C:\\Users\\CITY C\\Downloads\\project\\backend\\uploads\\responseFile-1745840477626-412220270.webm', NULL, '2025-04-28 11:41:17'),
(16, 31, 'http://localhost:3001/uploads/responseFile-1751452281660-367864315.webm', 0, '2025-07-02 10:31:21'),
(17, 39, 'http://localhost:3001/uploads/responseFile-1751453522941-2696374.webm', NULL, '2025-07-02 10:52:03'),
(18, 42, 'D:\\AuraIntervView\\Interview\\backend\\uploads\\responseFile-1751455347459-810508731.webm', NULL, '2025-07-02 11:22:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_company_organization` (`organization_id`);

--
-- Indexes for table `cvs`
--
ALTER TABLE `cvs`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `job_id` (`job_id`) USING BTREE,
  ADD KEY `organization_id` (`organization_id`) USING BTREE;

--
-- Indexes for table `cvs_achievements`
--
ALTER TABLE `cvs_achievements`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_certifications`
--
ALTER TABLE `cvs_certifications`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_education`
--
ALTER TABLE `cvs_education`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_experience`
--
ALTER TABLE `cvs_experience`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_extra`
--
ALTER TABLE `cvs_extra`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_internal_notes`
--
ALTER TABLE `cvs_internal_notes`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `parent_note_id` (`parent_note_id`) USING BTREE;

--
-- Indexes for table `cvs_projects`
--
ALTER TABLE `cvs_projects`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_publications`
--
ALTER TABLE `cvs_publications`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_references`
--
ALTER TABLE `cvs_references`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_shortlist`
--
ALTER TABLE `cvs_shortlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cv_org` (`cv_id`,`organization_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `cvs_skills`
--
ALTER TABLE `cvs_skills`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `cvs_volunteer`
--
ALTER TABLE `cvs_volunteer`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `cv_id` (`cv_id`) USING BTREE;

--
-- Indexes for table `file_responses`
--
ALTER TABLE `file_responses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `response_id` (`response_id`) USING BTREE;

--
-- Indexes for table `interviews`
--
ALTER TABLE `interviews`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `organization_id` (`organization_id`) USING BTREE,
  ADD KEY `fk_company` (`company_id`);

--
-- Indexes for table `interview_assignments`
--
ALTER TABLE `interview_assignments`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `interview_id` (`interview_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `interview_id` (`interview_id`) USING BTREE,
  ADD KEY `organization_id` (`organization_id`) USING BTREE;

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `organization_id` (`organization_id`) USING BTREE;

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `interview_id` (`interview_id`) USING BTREE;

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `invitation_id` (`interview_id`) USING BTREE,
  ADD KEY `question_id` (`question_id`) USING BTREE;

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `text_responses`
--
ALTER TABLE `text_responses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `response_id` (`response_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`) USING BTREE,
  ADD KEY `role_id` (`role_id`) USING BTREE,
  ADD KEY `organization_id` (`organization_id`) USING BTREE;

--
-- Indexes for table `video_responses`
--
ALTER TABLE `video_responses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `response_id` (`response_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cvs`
--
ALTER TABLE `cvs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `cvs_achievements`
--
ALTER TABLE `cvs_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `cvs_certifications`
--
ALTER TABLE `cvs_certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cvs_education`
--
ALTER TABLE `cvs_education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `cvs_experience`
--
ALTER TABLE `cvs_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `cvs_extra`
--
ALTER TABLE `cvs_extra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `cvs_internal_notes`
--
ALTER TABLE `cvs_internal_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cvs_projects`
--
ALTER TABLE `cvs_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT for table `cvs_publications`
--
ALTER TABLE `cvs_publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cvs_references`
--
ALTER TABLE `cvs_references`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cvs_shortlist`
--
ALTER TABLE `cvs_shortlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cvs_skills`
--
ALTER TABLE `cvs_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=792;

--
-- AUTO_INCREMENT for table `cvs_volunteer`
--
ALTER TABLE `cvs_volunteer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `file_responses`
--
ALTER TABLE `file_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `interviews`
--
ALTER TABLE `interviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `interview_assignments`
--
ALTER TABLE `interview_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `text_responses`
--
ALTER TABLE `text_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `video_responses`
--
ALTER TABLE `video_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `fk_company_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cvs_shortlist`
--
ALTER TABLE `cvs_shortlist`
  ADD CONSTRAINT `cvs_shortlist_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cvs_shortlist_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
