-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 13, 2024 lúc 01:52 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `doctorcare`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `adminlogs`
--

CREATE TABLE `adminlogs` (
  `id` int(11) NOT NULL,
  `patientId` int(11) DEFAULT NULL,
  `adminId` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `allcodes`
--

CREATE TABLE `allcodes` (
  `id` int(11) NOT NULL,
  `key` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `valueEn` varchar(255) DEFAULT NULL,
  `valueVi` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `allcodes`
--

INSERT INTO `allcodes` (`id`, `key`, `type`, `valueEn`, `valueVi`, `createdAt`, `updatedAt`) VALUES
(1, 'R1', 'ROLE', 'Admin', 'Quản trị viên', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(2, 'R2', 'ROLE', 'Doctor', 'Bác sĩ', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(3, 'R3', 'ROLE', 'Patient', 'Bệnh nhân', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(4, 'S1', 'STATUS', 'New', 'Lịch hẹn mới', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(5, 'S2', 'STATUS', 'Confirmed', 'Đã xác nhận', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(6, 'S3', 'STATUS', 'Done', 'Đã khám xong', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(7, 'S4', 'STATUS', 'Cancel', 'Đã hủy', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(8, 'T1', 'TIME', '8:00 AM - 8:15 AM', '8:00 - 8:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(9, 'T2', 'TIME', '8:20 AM - 8:35 AM', '8:20 - 8:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(10, 'T3', 'TIME', '8:40 AM - 8:55 AM', '8:40 - 8:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(11, 'T4', 'TIME', '9:00 AM - 9:15 AM', '9:00 - 9:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(12, 'T5', 'TIME', '9:20 AM - 9:35 AM', '9:20 - 9:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(13, 'T6', 'TIME', '9:40 AM - 9:55 AM', '9:40 - 9:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(14, 'T7', 'TIME', '10:00 AM - 10:15 AM', '10:00 - 10:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(15, 'T8', 'TIME', '10:20 AM - 10:35 AM', '10:20 - 10:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(16, 'T9', 'TIME', '10:40 AM - 10:55 AM', '10:40 - 10:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(17, 'T10', 'TIME', '1:00 PM - 1:15 PM', '13:00 - 13:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(18, 'T11', 'TIME', '1:20 PM - 1:35 PM', '13:20 - 13:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(19, 'T12', 'TIME', '1:40 PM - 1:55 PM', '13:40 - 13:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(20, 'T13', 'TIME', '2:00 PM - 2:15 PM', '14:00 - 14:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(21, 'T14', 'TIME', '2:20 PM - 2:35 PM', '14:20 - 14:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(22, 'T15', 'TIME', '2:40 PM - 2:55 PM', '14:40 - 14:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(23, 'T16', 'TIME', '3:00 PM - 3:15 PM', '15:00 - 15:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(24, 'T17', 'TIME', '3:20 PM - 3:35 PM', '15:20 - 15:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(25, 'T18', 'TIME', '3:40 PM - 3:55 PM', '15:40 - 15:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(26, 'T19', 'TIME', '4:00 PM - 4:15 PM', '16:00 - 16:15', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(27, 'T20', 'TIME', '4:20 PM - 4:35 PM', '16:20 - 16:35', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(28, 'T21', 'TIME', '4:40 PM - 4:55 PM', '16:40 - 16:55', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(29, 'P0', 'POSITION', 'None', 'Bác sĩ', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(30, 'P1', 'POSITION', 'Master', 'Thạc sĩ', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(31, 'P2', 'POSITION', 'Doctor', 'Tiến sĩ', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(32, 'P3', 'POSITION', 'Associate Professor', 'Phó giáo sư', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(33, 'P4', 'POSITION', 'Professor', 'Giáo sư', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(34, 'M', 'GENDER', 'Male', 'Nam', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(35, 'F', 'GENDER', 'Female', 'Nữ', '2024-04-16 23:04:01', '2024-04-16 23:04:01'),
(36, 'O', 'GENDER', 'Other', 'Khác', '2024-04-16 23:04:01', '2024-04-16 23:04:01');

-- -------------------------------------------------------
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Cấu trúc bảng cho bảng `comments`
--


CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) DEFAULT NULL,
  `timeBooking` varchar(255) DEFAULT NULL,
  `dateBooking` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `doctorId`, `timeBooking`, `dateBooking`, `name`, `phone`, `content`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 26, '10:20 - 10:35', '16/04/2024', 'Võ Hồng Tiên', '0934978913', 'Tôi cảm thấy nhẹ nhàng hơn sau khi được bác sĩ tư vấn và điều trị cho vấn đề đau bụng.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 4, '10:40 - 10:55', '16/04/2024', 'Nguyễn Thị Hương Giang', '0934456123', 'Khám sức khỏe định kỳ thật sự quan trọng. Cảm ơn bác sĩ đã phát hiện sớm vấn đề về huyết áp của tôi.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 4, '3:40 - 3:55', '16/04/2024', 'Nguyễn Thị Ngân Anh', '0945288715', 'Sự chăm sóc tận tình và am hiểu từ đội ngũ y tế đã giúp tôi vượt qua nỗi lo lắng về triệu chứng ho kéo dài.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 5, '9:00 - 9:15', '05/04/2024', 'Lê Đình', '0981234567', 'Tôi rất hài lòng với kết quả xét nghiệm và lời khuyên dinh dưỡng từ bác sĩ. Sức khỏe của tôi đang được cải thiện từng ngày.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 5, '9:20 - 9:35', '07/04/2024', 'Nguyễn Thị D', '0654321098', 'Tôi cảm thấy an tâm hơn sau khi được giải đáp mọi thắc mắc về vấn đề tiểu đường của mình.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 6, '1:00 - 1:15', '11/04/2024', 'Lê Nhật Minh', '0987654321', 'Mọi thứ đều rất suôn sẻ từ việc đặt lịch hẹn đến quá trình khám và điều trị. Tôi hoàn toàn tin tưởng vào chất lượng dịch vụ y tế ở đây.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 6, '2:20 - 2:35', '11/04/2024', 'Phan Trần Đức', '0567890123', 'Bác sĩ đã rất tỉ mỉ trong quá trình khám và giải thích rõ ràng về kết quả xét nghiệm. Tôi rất biết ơn điều đó.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 8, '9:40 - 9:55', '13/04/2024', 'Bùi Văn Hà', '0456789012', 'Sau khi điều trị, tôi thấy mình có nhiều năng lượng hơn và giảm được mệt mỏi do vấn đề tiêu hóa.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 8, '8:20 - 8:35', '13/04/2024', 'Trần Trí Nam', '0765432109', 'Tôi đã học được nhiều về cách chăm sóc sức khỏe cá nhân và phòng tránh bệnh tật từ cuộc hẹn khám sức khỏe này.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 13, '9:20 - 9:35', '17/04/2024', 'Vũ Thị Thu Thảo', '0765432109', 'Bác sĩ đã đặt ra kế hoạch điều trị chi tiết và dễ hiểu, giúp tôi tự tin hơn trong quá trình kháng chiến với bệnh tật.', 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');



-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_users`
--

CREATE TABLE `doctor_users` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `specializationId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_users`
--
INSERT INTO `doctor_users` (`id`, `doctorId`, `specializationId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 2, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 2, 3, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 3, 4, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 4, 5, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 5, 6, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 6, 7, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 7, 8, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 8, 6, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 9, 10, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 10, 5, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(11, 11, 9, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(12, 12, 3, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(13, 13, 2, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(14, 14, 16, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(15, 15, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 16, 16, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(17, 17, 2, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(18, 18, 3, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(19, 19, 4, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(20, 20, 10, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(21, 21, 11, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(22, 22, 12, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(23, 23, 13, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(24, 24, 14, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(25, 25, 15, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(26, 26, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(27, 27, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(28, 28, 2, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(29, 29, 14, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `extrainfos`
--

CREATE TABLE `extrainfos` (
  `id` int(11) NOT NULL,
  `patientId` int(11) DEFAULT NULL,
  `historyBreath` text DEFAULT NULL,
  `oldForms` text DEFAULT NULL,
  `sendForms` text DEFAULT NULL,
  `moreInfo` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `extrainfos`
--

INSERT INTO `extrainfos` (`id`, `patientId`, `historyBreath`, `oldForms`, `sendForms`, `moreInfo`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 2, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 3, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 4, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 5, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 6, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 7, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 8, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 9, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 10, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(11, 11, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(12, 12, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(13, 13, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(14, 14, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(15, 15, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 16, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(17, 17, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(18, 18, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(19, 19, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(20, 20, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(21, 21, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(22, 22, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(23, 23, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(24, 24, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(25, 25, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(26, 26, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(27, 27, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(28, 28, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(29, 29, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(30, 30, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(31, 31, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(32, 32, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(33, 33, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(34, 34, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(35, 35, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(36, 36, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(37, 37, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(38, 38, '', NULL, NULL, '', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dateBooking` varchar(255) DEFAULT NULL,
  `timeBooking` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isSentForms` tinyint(1) NOT NULL DEFAULT 0,
  `isTakeCare` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `patients`
--

INSERT INTO `patients` (`id`, `doctorId`, `userId`, `statusId`, `name`, `phone`, `dateBooking`, `timeBooking`, `email`, `gender`, `year`, `address`, `description`, `isSentForms`, `isTakeCare`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 26, 30, 1, 'Võ Hồng Tiên', '0934456123', '16/04/2024', '10:20 - 10:35', 'hongtien003@gmail.com', 'female', '2003', 'Quế Sơn, Quảng Nam', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 4, 31, 1, 'Nguyễn Thị Hương Giang', '0945288715', '16/04/2024', '10:40 - 10:55', 'huonggianghk2003@gmail.com', 'female', '2003', 'Hà Tĩnh', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 4, 32, 1, 'Nguyễn Thị Ngân Anh', '0897651432', '16/04/2024', '3:40 - 3:55', 'nguyenngananh44@gmail.com', 'female', '2003', 'Huế', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 4, 34, 2, 'Nguyễn Văn A', '0432109876', '16/04/2024', '1:40 - 1:55', 'nguyenvana.patient@gmail.com', 'male', '1987', 'Phú Thọ', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 5, 35, 1, 'Trần Thị B', '0789654321', '01/04/2024', '2:40 - 2:55', 'tranthib.patient@gmail.com', 'female', '1983', 'Khánh Hòa', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 5, 36, 2, 'Phạm Thị C', '0981234567', '03/04/2024', '10:00 - 10:15', 'phamthic.patient@gmail.com', 'female', '1974', 'Hưng Yên', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 5, 37, 1, 'Lê Đình', '0654321098', '05/04/2024', '9:00 - 9:15', 'ledinh.patient@gmail.com', 'male', '1998', 'Lạng Sơn', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 5, 38, 1, 'Nguyễn Thị D', '0345678912', '07/04/2024', '9:20 - 9:35', 'nguyenthid.patient@gmail.com', 'female', '1969', 'Nghệ An', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 6, 39, 1, 'Trần Văn Đức', '0876543210', '09/04/2024', '1:20 - 1:35', 'tranduc.patient@gmail.com', 'male', '1976', 'Quảng Bình', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 6, 40, 1, 'Đinh Thị P', '0987654321', '11/04/2024', '3:20 - 3:35', 'dinhthip.patient@gmail.com', 'female', '1985', 'Quảng Ngãi', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(11, 6, 41, 1, 'Lê Nhật Minh', '0567890123', '11/04/2024', '1:00 - 1:15', 'leminh.patient@gmail.com', 'male', '1994', 'Quảng Trị', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(12, 6, 42, 1, 'Phan Trần Đức', '0456789012', '11/04/2024', '2:20 - 2:35', 'phanduc.patient@gmail.com', 'male', '1991', 'Phú Thọ', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(13, 7, 43, 2, 'Vũ Văn Thanh', '0234567890', '11/04/2024', '1:40 - 1:55', 'vuthanh.patient@gmail.com', 'male', '1980', 'Nghệ An', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(14, 7, 44, 1, 'Đoàn Chí Hạ', '0876543210', '13/04/2024', '3:00 - 3:15', 'doanha.patient@gmail.com', 'male', '1972', 'Đồng Nai', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(15, 7, 45, 2, 'Nguyễn Chính Quân', '0456789012', '13/04/2024', '8:00 - 8:15', 'nguyenquan.patient@gmail.com', 'male', '1988', 'Quảng Ngãi', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 8, 46, 1, 'Bùi Văn Hà', '0765432109', '13/04/2024', '9:40 - 9:55', 'buivan.patient@gmail.com', 'male', '1999', 'Hưng Yên', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(17, 8, 47, 1, 'Trần Trí Nam', '0987654321', '13/04/2024', '8:20 - 8:35', 'trinam.patient@gmail.com', 'male', '1978', 'Quảng Ngãi', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(18, 9, 48, 1, 'Trần Hoàng Thủy', '0567890123', '01/04/2024', '8:40 - 8:55', 'hoangthuy.patient@gmail.com', 'female', '1996', 'Nghệ An', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(19, 9, 49, 1, 'Vũ Hoàng Việt', '0543210987', '03/04/2024', '4:20 - 4:35', 'phamviet.patient@gmail.com', 'male', '1966', 'Quảng Trị', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(20, 9, 50, 2, 'Lương Như Anh', '0432109876', '05/04/2024', '3:40 - 3:55', 'luonganh.patient@gmail.com', 'female', '1982', 'Hải Phòng', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(21, 13, 51, 1, 'Nguyễn Thị Hồng Thủy', '0981234567', '07/04/2024', '10:40 - 10:55', 'nguyenthuy.patient@gmail.com', 'female', '1965', 'Hải Phòng', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(22, 13, 52, 2, 'Nguyễn Hoàng Nam', '0765432109', '09/04/2024', '10:20 - 10:35', 'hoangnam.patient@gmail.com', 'male', '1970', 'Lạng Sơn', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(23, 13, 53, 1, 'Vũ Thị Thu Thảo', '0654321098', '17/04/2024', '9:20 - 9:35', 'vuthao.patient@gmail.com', 'female', '1989', 'Đồng Nai', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(24, 10, 54, 1, 'Trần Văn Hùng', '0876543210', '17/04/2024', '1:20 - 1:35', 'tranhung.patient@gmail.com', 'male', '1975', 'Kon Tum', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(25, 10, 55, 1, 'Nguyễn Xuân Thạnh', '0345678912', '17/04/2024', '9:40 - 9:55', 'xuanthanh.patient@gmail.com', 'male', '1992', 'Kon Tum', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(26, 10, 56, 1, 'Ngô Hoàng Tiến', '0234567890', '17/04/2024', '4:20 - 4:35', 'hoangtien.patient@gmail.com', 'male', '1990', 'Quảng Ngãi', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(27, 11, 57, 2, 'Huỳnh Thị Hoàng Anh', '0567890123', '17/04/2024', '8:00 - 8:15', 'hoanganh.patient@gmail.com', 'female', '1973', 'Nghệ An', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(28, 11, 58, 1, 'Nguyễn Hải Anh', '0456789012', '17/04/2024', '9:00 - 9:15', 'haianh.patient@gmail.com', 'male', '1997', 'Phú Thọ', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(29, 11, 59, 1, 'Phạm Ngô Nguyên Hoàng', '0987654321', '19/04/2024', '10:00 - 10:15', 'nguyenhoang.patient@gmail.com', 'male', '1981', 'Phú Thọ', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(30, 11, 60, 2, 'Trần Văn Dũng', '0543210987', '15/04/2024', '2:00 - 2:15', 'trandung.patient@gmail.com', 'male', '1995', 'Quảng Bình', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(31, 11, 61, 1, 'Trần Thị Phương Thảo', '0432109876', '15/04/2024', '4:00 - 4:15 ', 'phuongthao.patient@gmail.com', 'female', '1967', 'Hải Phòng', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(32, 11, 62, 2, 'Hoàng Phúc Minh', '0765432109', '15/04/2024', '8:40 - 8:55', 'phucminh.patient@gmail.com', 'male', '1971', 'Khánh Hòa', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(33, 12, 63, 1, 'Nguyễn Việt Anh', '0981234567', '15/04/2024', '4:40 - 4:55', 'vietanh.patient@gmail.com', 'male', '1968', 'Quảng Bình', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(34, 12, 64, 1, 'Võ Trung Nguyên', '0654321098', '15/04/2024', '2:20 - 2:35', 'trungnguyen@gmail.com', 'male', '1984', 'Lạng Sơn', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(35, 23, 65, 1, 'Vũ Thị Hoàng', '0234123890', '19/04/2024', '3:20 - 3:35', 'hoangthi@gmail.com', 'female', '1993', 'Nghệ An', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(36, 23, 66, 1, 'Cao Nguyên Minh', '0876543781', '19/04/2024', '3:00 - 3:15', 'nguyenminh@gmail.com', 'male', '1979', 'Hưng Yên', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(37, 27, 67, 1, 'Phạm Hoàng Mai', '0345456912', '19/04/2024', '2:40 - 2:55', 'hoangmai@gmail.com', 'male', '1986', 'Khánh Hòa', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(38, 27, 68, 1, 'Lê Thanh', '0345 456 912', '19/04/2024', '8:20 - 8:35', 'lethanh@gmail.com', 'male', '1977', 'Kon Tum', NULL, 1, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');


CREATE TABLE `places` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `contentMarkdown` text DEFAULT NULL,
  `contentHTML` text DEFAULT NULL,
  `forDoctorId` int(11) DEFAULT NULL,
  `forSpecializationId` int(11) DEFAULT NULL,
  `writerId` int(11) NOT NULL,
  `confirmByDoctor` tinyint(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `title`, `contentMarkdown`, `contentHTML`, `forDoctorId`, `forSpecializationId`, `writerId`, `confirmByDoctor`, `image`, `isActive`,  `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Da liễu', 'Các bệnh lý da liễu là tình trạng viêm nhiễm ngoài da hoặc bị kích ứng do những nguyên nhân khác nhau. Ở mỗi trường hợp mắc phải sẽ có những triệu chứng và mức độ không giống nhau. Hầu hết các bệnh lý ngoài da sẽ gây nên cảm giác ngứa ngáy ở nhiều mức độ, có bệnh lý gây ra thay đổi bất thường trên da ảnh hưởng đến thẩm mỹ nên người bệnh trở nên thiếu tự tin với những người xung quanh,... Ngoài ra, cũng có một số bệnh lý về da có thể gây nên những biến chứng nguy hiểm nếu không phát hiện để có biện pháp điều trị ngay từ đầu.', '<p>Các bệnh lý da liễu là tình trạng viêm nhiễm ngoài da hoặc bị kích ứng do những nguyên nhân khác nhau. Ở mỗi trường hợp mắc phải sẽ có những triệu chứng và mức độ không giống nhau. Hầu hết các bệnh lý ngoài da sẽ gây nên cảm giác ngứa ngáy ở nhiều mức độ, có bệnh lý gây ra thay đổi bất thường trên da ảnh hưởng đến thẩm mỹ nên người bệnh trở nên thiếu tự tin với những người xung quanh,... Ngoài ra, cũng có một số bệnh lý về da có thể gây nên những biến chứng nguy hiểm nếu không phát hiện để có biện pháp điều trị ngay từ đầu.</p>', 7, 8, 7, 7, NULL,1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 'Nội khoa', 'Nội khoa cung cấp các dịch vụ khám sức khỏe tổng quát cũng như chẩn đoán và điều trị các bệnh như: tim mạch, thần kinh, tiêu hóa, hô hấp…Bác sĩ khoa nội cũng là người thực hiện khám lâm sàng khi bạn có những triệu chứng khó chịu và không rõ nguyên nhân.Ngoài ra bác sĩ khoa nội tổng quát cũng sẽ kết hợp với các bác sĩ chuyên khoa để đưa ra phương án điều trị tốt nhất cho bạn.', '<p>Nội khoa cung cấp các dịch vụ khám sức khỏe tổng quát cũng như chẩn đoán và điều trị các bệnh như: tim mạch, thần kinh, tiêu hóa, hô hấp…Bác sĩ khoa nội cũng là người thực hiện khám lâm sàng khi bạn có những triệu chứng khó chịu và không rõ nguyên nhân.</p><p>Ngoài ra bác sĩ khoa nội tổng quát cũng sẽ kết hợp với các bác sĩ chuyên khoa để đưa ra phương án điều trị tốt nhất cho bạn.</p>', 14, 16, 14, 14, NULL, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 'Chấn thương chỉnh hình', 'Khi hệ cơ xương khớp bị chấn thương, biến dạng, sai lệch vị trí do nhiều nguyên nhân khác nhau như vận động sai tư thế, té ngã, tai nạn hay do bệnh lý nào đó (có thể là bệnh cột sống, thoái hóa khớp, viêm cột sống dính khớp, rối loạn bẩm sinh…), bạn sẽ cần tìm gặp bác sĩ để điều trị, chỉnh sửa lại cấu trúc xương khớp về bình thường [1]. Các kỹ thuật giúp thực hiện việc đó được gọi chung là chấn thương chỉnh hình. Tuy nhiên, hậu phẫu thuật có thể làm tăng nguy cơ đối mặt với một số biến chứng đáng lo ngại ở bệnh nhân nằm viện lâu ngày, chẳng hạn như thuyên tắc huyết khối tĩnh mạch.', '<p>Khi hệ cơ xương khớp bị chấn thương, biến dạng, sai lệch vị trí do nhiều nguyên nhân khác nhau như vận động sai tư thế, té ngã, tai nạn hay do bệnh lý nào đó (có thể là bệnh cột sống, thoái hóa khớp, viêm cột sống dính khớp, rối loạn bẩm sinh…), bạn sẽ cần tìm gặp bác sĩ để điều trị, chỉnh sửa lại cấu trúc xương khớp về bình thường [1]. Các kỹ thuật giúp thực hiện việc đó được gọi chung là chấn thương chỉnh hình. Tuy nhiên, hậu phẫu thuật có thể làm tăng nguy cơ đối mặt với một số biến chứng đáng lo ngại ở bệnh nhân nằm viện lâu ngày, chẳng hạn như thuyên tắc huyết khối tĩnh mạch.</p>', 25, 15, 25, 25, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 'Cơ xương khớp', 'Thoái hóa khớp là bệnh lý xương khớp xảy ra khi phần sụn khớp và xương dưới sụn ở khớp bị tổn thương, dẫn đến các phản ứng viêm và tình trạng tràn dịch khớp. Nguyên nhân phổ biến của thoái hóa khớp là tuổi tác và một số yếu tố khác như di truyền, tình trạng béo phì, chấn thương xảy ra thường xuyên tại khớp, tai nạn thể thao, tai nạn lao động, các bệnh lý khớp viêm như viêm khớp dạng thấp, gút hay nhiễm trùng khớp… ', '<p>Thoái hóa khớp là bệnh lý xương khớp xảy ra khi phần sụn khớp và xương dưới sụn ở khớp bị tổn thương, dẫn đến các phản ứng viêm và tình trạng tràn dịch khớp. Nguyên nhân phổ biến của thoái hóa khớp là tuổi tác và một số yếu tố khác như di truyền, tình trạng béo phì, chấn thương xảy ra thường xuyên tại khớp, tai nạn thể thao, tai nạn lao động, các bệnh lý khớp viêm như viêm khớp dạng thấp, gút hay nhiễm trùng khớp… </p>', 13, 2, 13, 13, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 'Cơ xương khớp', 'Viêm khớp dạng thấp là một bệnh xương khớp  viêm nhiều khớp và có thể ảnh hưởng lên các cơ quan ngoài khớp. Bệnh thường xảy ra ở nữ giới hơn nam giới và độ tuổi thường mắc bệnh là tuổi trung niên. Triệu chứng bệnh thường gặp nhất là sưng, nóng, đau và hạn chế vận động các khớp ở bàn tay, thường đối xứng 2 bên. Người bệnh đau liên tục ban ngày lẫn ban đêm.', '<p>Viêm khớp dạng thấp là một bệnh xương khớp  viêm nhiều khớp và có thể ảnh hưởng lên các cơ quan ngoài khớp. Bệnh thường xảy ra ở nữ giới hơn nam giới và độ tuổi thường mắc bệnh là tuổi trung niên. Triệu chứng bệnh thường gặp nhất là sưng, nóng, đau và hạn chế vận động các khớp ở bàn tay, thường đối xứng 2 bên. Người bệnh đau liên tục ban ngày lẫn ban đêm.</p>', 13, 2, 13, 13, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 'Thần kinh', 'Rối loạn tăng động giảm chú ý (ADHD) là một trong những rối loạn phát triển thần kinh phổ biến ở trẻ em. Tình trạng này được chẩn đoán khi trẻ còn nhỏ và thường kéo dài đến tuổi trưởng thành. Trẻ mắc ADHD có thể gặp khó khăn trong việc chú ý, kiểm soát hành vi bốc đồng hoặc hoạt động quá mức. ', '<p>Rối loạn tăng động giảm chú ý (ADHD) là một trong những rối loạn phát triển thần kinh phổ biến ở trẻ em. Tình trạng này được chẩn đoán khi trẻ còn nhỏ và thường kéo dài đến tuổi trưởng thành. Trẻ mắc ADHD có thể gặp khó khăn trong việc chú ý, kiểm soát hành vi bốc đồng hoặc hoạt động quá mức. </p>', 26, 1, 26, 26, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 'Thần kinh', 'Chắc hẳn bạn đã biết, cấu tạo của hệ thần kinh trung ương bao gồm não, tủy sống và hệ thống mạng lưới dây thần kinh phân bố trên khắp cơ thể. Hệ thần kinh trung ương có chức năng điều khiển và kiểm soát mọi hoạt động bao gồm tư duy, suy nghĩ, khả năng lập kế hoạch từ đơn giản đến phức tạp, khả năng vận động, cảm giác và chức năng của các cơ quan trong cơ thể.
Các chuyên gia ước tính có đến 600 loại rối loạn hệ thần kinh trung ương khác nhau, điển hình là những bệnh như: động kinh, viêm màng não, bệnh đa xơ cứng, bệnh Parkinson, đau nửa đầu, đột quỵ,...', '<p>Chắc hẳn bạn đã biết, cấu tạo của hệ thần kinh trung ương bao gồm não, tủy sống và hệ thống mạng lưới dây thần kinh phân bố trên khắp cơ thể. Hệ thần kinh trung ương có chức năng điều khiển và kiểm soát mọi hoạt động bao gồm tư duy, suy nghĩ, khả năng lập kế hoạch từ đơn giản đến phức tạp, khả năng vận động, cảm giác và chức năng của các cơ quan trong cơ thể.</p> <p>Các chuyên gia ước tính có đến 600 loại rối loạn hệ thần kinh trung ương khác nhau, điển hình là những bệnh như: động kinh, viêm màng não, bệnh đa xơ cứng, bệnh Parkinson, đau nửa đầu, đột quỵ,...</p>', 26, 1, 26, 26, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 'Tim mạch', 'Theo thống kê từ Tổ chức Y tế Thế giới (WHO), hàng năm có khoảng 17,9 triệu người tử vong do bệnh tim, trong đó có 85% trường hợp gây ra bởi bệnh nhồi máu cơ tim và đột quỵ. Tại Việt Nam, hàng năm có gần 200.000 người chết vì bệnh tim, con số này cao hơn so với tỷ lệ tử vong do ung thư. Đáng chú ý, các loại bệnh như động mạch não, mạch vành và động mạch ngoại biên đang trở nên phổ biến ở những người trẻ trong khi trước đây, các bệnh trên thường xuất hiện ở người cao tuổi.
Tuy nhiên, nhiều người trẻ thường tỏ ra chủ quan, cho rằng họ không có nguy cơ mắc bệnh tim mạch, do đó họ không thực hiện các biện pháp phòng ngừa hoặc tầm soát sớm. Điều này dẫn đến những biến chứng nghiêm trọng và ảnh hưởng đến năng suất lao động trong xã hội. Hơn nữa, trường hợp bệnh tim mạch bẩm sinh thường không được chẩn đoán và điều trị kịp thời trong những năm đầu sau khi sinh, khiến cho tỷ lệ mắc bệnh tim mạch ở người trẻ gia tăng đáng kinh ngạc.', '<p>Theo thống kê từ Tổ chức Y tế Thế giới (WHO), hàng năm có khoảng 17,9 triệu người tử vong do bệnh tim, trong đó có 85% trường hợp gây ra bởi bệnh nhồi máu cơ tim và đột quỵ. Tại Việt Nam, hàng năm có gần 200.000 người chết vì bệnh tim, con số này cao hơn so với tỷ lệ tử vong do ung thư. Đáng chú ý, các loại bệnh như động mạch não, mạch vành và động mạch ngoại biên đang trở nên phổ biến ở những người trẻ trong khi trước đây, các bệnh trên thường xuất hiện ở người cao tuổi.</p> <p>Tuy nhiên, nhiều người trẻ thường tỏ ra chủ quan, cho rằng họ không có nguy cơ mắc bệnh tim mạch, do đó họ không thực hiện các biện pháp phòng ngừa hoặc tầm soát sớm. Điều này dẫn đến những biến chứng nghiêm trọng và ảnh hưởng đến năng suất lao động trong xã hội. Hơn nữa, trường hợp bệnh tim mạch bẩm sinh thường không được chẩn đoán và điều trị kịp thời trong những năm đầu sau khi sinh, khiến cho tỷ lệ mắc bệnh tim mạch ở người trẻ gia tăng đáng kinh ngạc.</p>', 3, 4, 3, 3, NULL, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 'Sức khỏe tâm thần', 'Theo Tổ chức Y tế Thế giới (WHO) định nghĩa sức khỏe tâm thần là trạng thái hạnh phúc trong đó một cá nhân nhận ra khả năng của chính mình, có thể đối phó với những căng thẳng bình thường của cuộc sống, có thể làm việc hiệu quả và có thể đóng góp cho cộng đồng.', '<p>Theo Tổ chức Y tế Thế giới (WHO) định nghĩa sức khỏe tâm thần là trạng thái hạnh phúc trong đó một cá nhân nhận ra khả năng của chính mình, có thể đối phó với những căng thẳng bình thường của cuộc sống, có thể làm việc hiệu quả và có thể đóng góp cho cộng đồng.</p>', 11, 9, 11, 11, NULL, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 'Sức khỏe tâm thần', 'Sức khỏe tâm thần không chỉ là trạng thái không có rối loạn tâm thần hay bất kỳ vấn đề gì về tinh thần, mà còn bao gồm khả năng suy nghĩ, học hỏi và hiểu được cảm xúc của một người và phản ứng của người khác. Các yếu tố thể chất, tâm lý, xã hội, văn hóa, tinh thần và các yếu tố liên quan khác đều tham gia vào việc tạo ra sự cân bằng này.', '<p>Sức khỏe tâm thần không chỉ là trạng thái không có rối loạn tâm thần hay bất kỳ vấn đề gì về tinh thần, mà còn bao gồm khả năng suy nghĩ, học hỏi và hiểu được cảm xúc của một người và phản ứng của người khác. Các yếu tố thể chất, tâm lý, xã hội, văn hóa, tinh thần và các yếu tố liên quan khác đều tham gia vào việc tạo ra sự cân bằng này.</p>', 11, 9, 11, 11, NULL, 0, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ADMIN', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'DOCTOR', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'USER', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `maxBooking` varchar(255) DEFAULT NULL,
  `sumBooking` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `schedules`
--

INSERT INTO `schedules` (`id`, `doctorId`, `date`, `time`, `maxBooking`, `sumBooking`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 5, '01/04/2024', '1:40 - 1:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 5, '01/04/2024', '2:00 - 2:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 5, '01/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 5, '01/04/2024', '2:40 - 2:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 9, '01/04/2024', '8:00 - 8:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 9, '01/04/2024', '8:20 - 8:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 9, '01/04/2024', '8:40 - 8:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 5, '03/04/2024', '9:40 - 9:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 5, '03/04/2024', '10:00 - 10:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 5, '03/04/2024', '10:20 - 10:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(11, 9, '03/04/2024', '3:40 - 3:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(12, 9, '03/04/2024', '4:00 - 4:15 ', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(13, 9, '03/04/2024', '4:20 - 4:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(14, 5, '05/04/2024', '9:00 - 9:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(15, 5, '05/04/2024', '9:20 - 9:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 5, '05/04/2024', '9:40 - 9:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(17, 9, '05/04/2024', '3:00 - 3:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(18, 9, '05/04/2024', '3:20 - 3:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(19, 9, '05/04/2024', '3:40 - 3:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(20, 5, '07/04/2024', '9:00 - 9:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(21, 5, '07/04/2024', '9:20 - 9:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(22, 5, '07/04/2024', '9:40 - 9:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(23, 13, '07/04/2024', '10:00 - 10:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(24, 13, '07/04/2024', '10:20 - 10:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(25, 13, '07/04/2024', '10:40 - 10:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(26, 6, '09/04/2024', '1:00 - 1:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(27, 6, '09/04/2024', '1:20 - 1:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(28, 6, '09/04/2024', '1:40 - 1:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(29, 13, '09/04/2024', '10:00 - 10:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(30, 13, '09/04/2024', '10:20 - 10:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(31, 13, '09/04/2024', '10:40 - 10:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(32, 6, '11/04/2024', '1:00 - 1:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(33, 6, '11/04/2024', '1:20 - 1:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(34, 6, '11/04/2024', '1:40 - 1:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(35, 6, '11/04/2024', '2:00 - 2:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(36, 6, '11/04/2024', '2:20 - 2:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(37, 6, '11/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(38, 6, '11/04/2024', '3:00 - 3:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(39, 6, '11/04/2024', '3:20 - 3:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(40, 6, '11/04/2024', '3:40 - 3:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(41, 7, '11/04/2024', '10:40 - 10:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(42, 7, '11/04/2024', '1:00 - 1:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(43, 7, '11/04/2024', '1:20 - 1:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(44, 7, '11/04/2024', '1:40 - 1:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(45, 7, '13/04/2024', '8:00 - 8:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(46, 7, '13/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(47, 7, '13/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(48, 7, '13/04/2024', '3:00 - 3:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(49, 8, '13/04/2024', '8:00 - 8:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(50, 8, '13/04/2024', '8:20 - 8:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(51, 8, '13/04/2024', '8:40 - 8:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(52, 8, '13/04/2024', '9:20 - 9:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(53, 8, '13/04/2024', '9:40 - 9:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(54, 8, '13/04/2024', '10:00 - 10:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(55, 8, '13/04/2024', '10:20 - 10:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(56, 11, '15/04/2024', '8:00 - 8:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(57, 11, '15/04/2024', '8:20 - 8:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(58, 11, '15/04/2024', '8:40 - 8:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(59, 11, '15/04/2024', '2:00 - 2:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(60, 11, '15/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(61, 11, '15/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(62, 11, '15/04/2024', '3:00 - 3:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(63, 11, '15/04/2024', '3:20 - 3:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(64, 11, '15/04/2024', '3:40 - 3:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(65, 11, '15/04/2024', '4:00 - 4:15 ', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(66, 11, '15/04/2024', '4:20 - 4:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(67, 12, '15/04/2024', '2:20 - 2:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(68, 12, '15/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(69, 12, '15/04/2024', '4:20 - 4:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(70, 12, '15/04/2024', '4:40 - 4:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(71, 26, '16/04/2024', '10:00 - 10:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(72, 26, '16/04/2024', '10:20 - 10:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(73, 26, '16/04/2024', '10:40 - 10:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(74, 26, '16/04/2024', '1:00 - 1:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(75, 4, '16/04/2024', '10:40 - 10:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(76, 4, '16/04/2024', '1:00 - 1:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(77, 4, '16/04/2024', '1:20 - 1:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(78, 4, '16/04/2024', '1:40 - 1:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(79, 4, '16/04/2024', '2:00 - 2:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(80, 4, '16/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(81, 4, '16/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(82, 4, '16/04/2024', '3:00 - 3:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(83, 4, '16/04/2024', '3:20 - 3:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(84, 4, '16/04/2024', '3:40 - 3:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(85, 11, '17/04/2024', '8:00 - 8:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(86, 11, '17/04/2024', '8:20 - 8:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(87, 11, '17/04/2024', '8:40 - 8:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(88, 11, '17/04/2024', '9:00 - 9:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(89, 11, '17/04/2024', '9:20 - 9:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(90, 13, '17/04/2024', '9:00 - 9:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(91, 13, '17/04/2024', '9:20 - 9:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(92, 13, '17/04/2024', '9:40 - 9:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(93, 10, '17/04/2024', '9:00 - 9:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(94, 10, '17/04/2024', '9:20 - 9:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(95, 10, '17/04/2024', '9:40 - 9:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(96, 10, '17/04/2024', '1:00 - 1:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(97, 10, '17/04/2024', '1:20 - 1:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(98, 10, '17/04/2024', '1:40 - 1:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(99, 10, '17/04/2024', '4:00 - 4:15 ', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(100, 10, '17/04/2024', '4:20 - 4:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(101, 10, '17/04/2024', '4:40 - 4:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(102, 23, '19/04/2024', '2:00 - 2:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(103, 23, '19/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(104, 23, '19/04/2024', '2:40 - 2:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(105, 23, '19/04/2024', '3:00 - 3:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(106, 23, '19/04/2024', '3:20 - 3:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(107, 23, '19/04/2024', '3:40 - 3:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(108, 11, '19/04/2024', '10:00 - 10:15', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(109, 11, '19/04/2024', '10:20 - 10:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(110, 11, '19/04/2024', '10:40 - 10:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(111, 27, '19/04/2024', '8:00 - 8:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(112, 27, '19/04/2024', '8:20 - 8:35', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(113, 27, '19/04/2024', '8:40 - 8:55', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(114, 27, '19/04/2024', '2:00 - 2:15', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(115, 27, '19/04/2024', '2:20 - 2:35', '1', '0', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(116, 27, '19/04/2024', '2:40 - 2:55', '1', '1', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20200311024259-users.js'),
('20200311025445-create-role.js'),
('20200311025538-create-post.js'),
('20200311025604-create-specialization.js'),
('20200311025619-create-schedule.js'),
('20200311025632-create-status.js'),
('20200311025648-create-patient.js'),
('migration-create-adminLog.js'),
('migration-create-allcode.js'),
('migration-create-comment.js'),
('migration-create-doctor-user.js'),
('migration-create-extraInfo.js');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `session`
--

CREATE TABLE `session` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `session`
--

INSERT INTO `session` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('hEzXzB9FtS4HawOwYTMasI5BLxVwsTsl', '2024-05-14 18:43:55', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-05-14T11:43:55.889Z\",\"secure\":false,\"httpOnly\":false,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":80},\"user\":{\"id\":80,\"name\":\"Admin\",\"email\":\"admin@gmail.com\",\"password\":\"$2a$07$Um84EeX1bya3vxYPlA/Sw.t.gSOX9wIZo9IKeALr.msM6J0EZ0CA.\",\"address\":\"Đà Nẵng\",\"birthday\":\"2003-02-26\",\"phone\":\"0382106557\",\"avatar\":\"https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd\",\"gender\":\"O\",\"description\":\"Hello quan \\r\\nupdate lan 1\",\"roleId\":1,\"isActive\":1,\"createdAt\":\"0000-00-00 00:00:00\",\"updatedAt\":\"2024-05-13 16:58:43\",\"deletedAt\":\"0000-00-00 00:00:00\",\"RoleId\":1}}', '2024-05-13 18:40:34', '2024-05-13 18:43:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specializations`
--

CREATE TABLE `specializations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `specializations`
--

INSERT INTO `specializations` (`id`, `name`, `description`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Thần kinh', 'Chuyên khoa Thần kinh thuộc khối Y học lâm sàng, là một lĩnh vực gồm nội khoa và ngoại khoa,  giữ chức năng khám, chẩn đoán, tư vấn, điều trị chuyên sâu và phẫu thuật những bệnh lý có liên quan đến yếu tố thần kinh.
Chuyên khoa Nội Thần kinh chuyên điều trị các bệnh: đau đầu, đau vai gáy, đau thắt lưng hông, rối loạn tiền đình, chóng mặt do thiếu máu não, rối loạn về giấc ngủ, khám thần kinh và điều trị liệt dây 7 ngoại vi, liệt nửa người do đột quỵ não, sa sút trí tuệ, rối loạn vận động như bệnh Parkinson, động kinh, viêm não tủy, viêm đa dây thần kinh, các bệnh gây thoái hoá hệ thần kinh, nhiễm trùng thần kinh, bệnh lý thần kinh ngoại biên, nhiễm độc thần kinh, rối loạn chuyển hóa,…
Các phương pháp điều trị đang được áp dụng tại chuyên khoa Nội Thần kinh:

Xét nghiệm để chẩn đoán chính xác: sàng lọc máu, nước tiểu, di truyền; điện não đồ; điện cơ; EMG (hoạt động điện trong cơ bắp)
Chẩn đoán hình ảnh: chụp cắt lớp vi tính (CT scan); cộng hưởng từ (MRI); chụp cắt lớp phát xạ positron (PET); chụp cắt lớp phát xạ đơn photon (SPECT).
Chuyên khoa Ngoại thần kinh thực hiện các phẫu thuật u não, u dây thần kinh, u cột sống, chấn thương sọ não và cột sống; vi phẫu thuật mạch máu não trong co giật nửa mặt; vi phẫu thuật mạch máu não trong đau dây thần kinh V ...', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fthankinh.png?alt=media&token=3ccc51a0-f534-45e7-bc5d-581ac0ce846c', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 'Cơ xương khớp', 'Khoa Cơ xương khớp chuyên điều trị các bệnh về cơ xương khớp, tư vấn điều trị và theo dõi định kỳ. Bác sỹ chuyên khoa xương khớp thăm khám cho bệnh nhân các lứa tuổi khác nhau.
Chuyên khoa xương khớp điều trị nhiều bệnh lý hay gặp như:
    -  Bệnh gút; bệnh giả gút  (goutte, pseudogoutte)
    -  Viêm khớp nhiễm khuẩn (arthrite infectieuse )
    -  Viêm khớp phản ứng (arthrite resactive)
    -  Viêm khớp dạng thấp ( Polyarthrite rhumatoïde)
    -  Thoái hóa khớp (arthrose )
   - Các bệnh lý về gân cơ: viêm quanh khớp vai (tendinite de l’epaule), viêm lồi cầu xương cánh tay (epicondylite), viêm mỏm châm quay ( syndrome de De Quervain), ngón tay lò xo (doigt a resort ), viêm gân cơ mông nhỡ (tendinite du moyen fessier), hội chứng đường hầm cổ tay, chân ( syndrome du canal carpien, canal tarsien) …
', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fcoxuongkhop.png?alt=media&token=e6ab3c36-cc04-41fc-9d7d-8575a3874ac4', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(3, 'Tiêu hóa', 'Khoa tiêu hoá là một chuyên khoa thuộc nội khoa chuyên điều trị các bệnh về tiêu hoá, rối loạn chức năng tiêu hoá và các cơ quan nội tạng. Ngoài ra, các bác sĩ chuyên khoa Tiêu hoá cố vấn nhiều chuyên khoa ngoài lĩnh vực trong vấn đề điều trị do đặc thù của bệnh lý tiêu hoá, đôi khi là nguồn gốc của nhiều bệnh lý khác có liên quan.
Khám và chữa các bệnh cấp và mạn tính:

- Viêm loét dạ dày - tá tràng

- Trào ngược dạ dày - thực quản

- Hội chứng ruột kích thích Viêm đại tràng

- Nhiễm vi khuẩn HP

- Khám tầm soát ung thư đường tiêu hóa

Ứng dụng các phương tiện kỹ thuật hiện đại trong chẩn đoán và tầm soát bệnh: 

- Nội soi tiêu hóa

- Siêu âm

- X-quang

- CT Scan

- Chụp Cộng hưởng từ', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Ftieuhoa.png?alt=media&token=aa61b841-4570-4fb6-bfb4-44c400ecf95c', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(4, 'Tim mạch', 'Chuyên khoa Tim mạch là một ngành quan trọng thuộc khối Y học lâm sàng, giữ chức năng khám, chẩn đoán, tư vấn và điều trị các bệnh lý liên quan đến hệ thống tim mạch, cơ quan quan trọng giúp duy trì sự sống của con người.
Chức năng và nhiệm vụ: 
Cấp cứu, chẩn đoán và điều trị các bệnh Tim mạch; thực hiện các kỹ thuật chẩn đoán, can thiệp tim mạch và nhịp học; tham gia chuẩn bị bệnh nhân và hội chẩn phẫu thuật tim mạch cho bệnh nhân là bộ đội, chính sách, BHYT và bệnh nhân nhân dân.
Tham gia công tác đào tạo, nghiên cứu khoa học, hợp tác Quốc tế và chỉ đạo tuyến', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Ftimmach.png?alt=media&token=6a8868de-a66c-410e-8415-e3fb010cdcd4', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(5, 'Tai mũi họng', 'Khoa Tai Mũi Họng là chuyên khoa điều trị các bệnh lý liên quan đến tai, mũi và họng cũng như vùng đầu và cổ. Khoa Tai Mũi Họng cung cấp dịch vụ đa dạng, từ khám bệnh đến thực hiện các loại phẫu thuật phức tạp cho cả trẻ em và người lớn.
Để điều trị các bệnh lý phức tạp, các bác sĩ tai mũi họng của chúng tôi phối hợp chặt chẽ với các bác sĩ tại các chuyên khoa khác trong bệnh viện như bác sĩ Ngoại Thần kinh và chuyên gia điều trị ung thư.', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Ftaimuihong.png?alt=media&token=d6385508-ed1f-469c-9cd7-8493472b34a3', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(6, 'Ngoại thần kinh cột sống', 'Khoa ngoại cột sống là chuyên khám, chẩn đoán và điều trị các bệnh lý từ đơn giản đến phức tạp về cột sống như gãy lún đốt sống, hẹp ống sống, thoái hóa cột sống, thoát vị đĩa đệm, trượt đốt sống,..
Nhờ được áp dụng các phương pháp xâm lấn tối thiểu trong phẫu thuật và điều trị như: phẫu thuật nội soi, phẫu thuật qua da... người bệnh sẽ hồi phục nhanh chóng, từ đó rút ngắn thời gian nằm viện, tối ưu chi phí điều trị và giúp người bệnh sớm trở lại với cuộc sống lao động thường ngày.', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fngoaithankinhcotsong.png?alt=media&token=5644d5be-13a5-498b-b383-d48c7315c111', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(7, 'Sản phụ khoa', 'Sản & Phụ khoa là chuyên khoa về sức khoẻ phụ nữ và các vấn đề liên quan tới bộ phận sinh sản nữ từ khi dậy thì cho đến hết cuộc đời.
Khoa có hai lĩnh vực chủ yếu là: Khả năng sinh sản & sản khoa ,Các bệnh phụ khoa
Khám tư vấn về:
Bệnh viêm nhiễm;
Thực hiện các biện pháp phòng tránh thai;
Rối loạn tiền mãn kinh;
Xuất huyết tử cung;
Phát hiện ung thư cổ tử cung và ung thư vú
Ngoại khoa, đặc biệt là phẫu thuật phần phụ và phẫu thuật ít xâm lấn:
U xơ tử cung;
Sa sinh dục;
Són tiểu;
Bệnh lý về vú;
Ung thư cổ tử cung và ung thư tử cung;
Nội soi u nang buồng trứng
Tạo hình tầng sinh môn
Mổ nội soi kiểm tra vòi trứng', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fsanphukhoa.png?alt=media&token=16481ec7-9126-48fc-a014-881e6828dc9e', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(8, 'Da liễu', 'Da liễu là chuyên khoa chuyên điều trị các bệnh về da và những phần phụ của da (lông, tóc, móng), các bệnh lý niêm mạc (lưỡi, môi, miệng), các bệnh lý nội khoa có biểu hiện ngoài da, các bệnh lây qua đường tình dục.
Các vấn đề bệnh lý Da liễu được chẩn đoán, điều trị:
    Mụn trứng cá và thâm sau mụn
    Nám, tàn nhanh, sẹo lồi
    Dị ứng mỹ phẩm
    Mề đay mạn tính tái phát
    Các bệnh da thông thường: vẩy nến, tổ dĩa, lang ben, bệnh da nghề nghiệp
    Các bệnh lý về móng
    Rụng tóc, gàu, ngứa da đầu
    Mụn cóc, nốt ruồi, u lành da
    Sinh thiết da trong chẩn đoán bệnh lý về da và tầm soát ung thư da', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fdalieu.png?alt=media&token=982ea0f4-ae85-48d4-9bc7-0c9b5290893d', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(9, 'Sức khỏe tâm thần', 'Khoa Tâm thần  với các thế mạnh trong lĩnh vực khám, đánh giá, thiết lập chẩn đoán; điều trị và tư vấn cho trẻ em có các vấn đề liên quan tới sức khỏe tâm thần như:
Rối loạn phổ tự kỷ
Rối loạn tăng động giảm chú ý
Chậm phát triển tâm thần
Rối loạn trầm cảm, rối loạn cảm xúc lưỡng cực
Rối loạn lo âu, rối loạn ám ảnh – cưỡng chế, rối loạn liên quan đến stress
Rối loạn hành vi, Rối loạn bướng bỉnh chống đối
Rối loạn học tập
Rối loạn tic
Rối loạn giấc ngủ
Rối loạn ăn uống
Nghiện game, nghiện thuốc lá điện tử, nghiện các chất ma tuý', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fsuckhoetamthan.png?alt=media&token=1440ba6e-7174-4b1e-b7c4-ddce756ed52a', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(10, 'Hô hấp - Phổi', 'Khoa nội hô hấp (hay phổi học) là chuyên khoa lâm sàng để điều trị các bệnh lý liên quan đến đường thở và phổi. Các vấn đề về hô hấp có thể bao gồm các ca bệnh thường quy như hen suyễn, viêm tiểu phế quản và viêm mũi dị ứng đến các bệnh lý phức tạp như ung thư phổi, lao và bệnh phổi tắc nghẽn mạn tính (COPD).', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fhohapphoi.png?alt=media&token=da67da7b-17c4-42ab-9d71-2009bceaf293', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(11, 'Ngoại thần kinh', 'Khoa Ngoại thần kinh còn gọi là khoa phẫu thuật thần kinh, giữ chức năng điều trị các bệnh lý liên quan đến yếu tố thần kinh bằng các phương pháp ngoại khoa, bao gồm phẫu thuật nội soi, vi phẫu thuật, can thiệp nội mạch, phẫu thuật tạo hình, mổ và cấy ghép.', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fngoaithankinh.png?alt=media&token=16c3a5bf-4665-46da-af02-74106bcd0ea2', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(12, 'Chuyên khoa mắt', 'Khám chuyên sâu và điều trị hiệu quả các bệnh lý của mắt.
    Khám phát hiện sớm và điều trị hiệu quả  các trường hợp bệnh lý cườm nước - tăng nhãn áp và cườm khô - đục thể thủy tinh .
    Phối hợp liên chuyên khoa mắt và nội tiết để điều trị hiệu quả bệnh lý võng mạc do tiểu đường.
    Đo khúc xạ - kính chính xác và tư vấn nhiều phương pháp điều trị chuyên sâu các bất thường khúc xạ của mắt.
    Điều trị chảy nước mắt sống hiệu quả.
    Điều trị hiệu quả các bệnh lý bề mặt giác mạc: như bệnh lý khô mắt, viêm kết mạc cấp tính hoặc mãn tính.', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fchuyenkhoamat.png?alt=media&token=114c1957-81be-4a17-b38b-5628852050e4', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(13, 'Răng hàm mặt', 'Chuyên khoa Răng Hàm Mặt cam kết mang đến dịch vụ chăm sóc sức khỏe răng miệng hàng đầu với: 
Đội ngũ bác sĩ được đào tạo chuyên sâu, nhiều năm kinh nghiệm, liên tục cập nhật và ứng dụng những phương pháp, kỹ thuật mới nhất trong lĩnh vực Răng – Hàm – Mặt nhằm nâng cao hiệu quả điều trị cho người bệnh. 
Hệ thống trang thiết bị nhập khẩu chính hãng từ các nước Âu – Mỹ: Đèn quang trùng hợp LED Bluephase N®MC Ivoclar Vivadent, Máy cạo vôi răng siêu âm Piezo với hệ thống 5 đèn LED, Máy nhổ răng không đau bằng sóng siêu âm Piezotome,…', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Franghammat.png?alt=media&token=c834e2b2-39b5-4eda-b961-9b088c34d38d', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(14, 'Ung bướu', 'Khoa ung bướu là một trong những chuyên khoa quan trọng của phân ngành ngoại khoa, có chức năng chẩn đoán, điều trị, tầm soát ung thư và cung cấp đầy đủ các dịch vụ chăm sóc y tế cần thiết cho bệnh nhân ung thư bao gồm: hoá trị, xạ trị, điều trị ngoại khoa, điều trị nội khoa, ghép tế bào gốc...; đồng thời giúp kiểm soát các cơn đau bằng cách vật lý trị liệu, phong bế thần kinh ngoại biên, phong bế giao cảm,...

Các bệnh thường gặp của khoa ung bướu có thể kể đến như: ung thư gan, ung thư phổi, ung thư cổ tử cung, ung thư vú, ung thư buồng trứng, ung thư tuyến giáp, ung thư da, ung thư đại trực tràng, ung thư dạ dày,...', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fungbuu.png?alt=media&token=bdbcd97f-b695-4f73-9bee-8366816db69d', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'), 
(15, 'Chấn thương chỉnh hình', 'Khoa chấn thương chỉnh hình là chuyên khoa chuyên điều trị các chấn thương và tình trạng bệnh liên quan đến hệ thống cơ xương khớp, gồm xương, cơ, khớp và dây chằng. Tuổi tác, chấn thương, tư thế không đúng hoặc các môn thể thao va chạm mạnh có thể gây tổn thương đến những vùng này của cơ thể.', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fchanthuongchinhhinh.png?alt=media&token=b02e9c75-419f-406e-a578-646357b4707c', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 'Nội khoa', 'Nội khoa cung cấp các dịch vụ khám sức khỏe tổng quát cũng như chẩn đoán và điều trị các bệnh như: tim mạch, thần kinh, tiêu hóa, hô hấp…Bác sĩ khoa nội cũng là người thực hiện khám lâm sàng khi bạn có những triệu chứng khó chịu và không rõ nguyên nhân.
Khác với bác sĩ chuyên khoa chỉ tập trung điều trị cho một cơ quan trong cơ thể chẳng hạn như tim mạch, da liễu…Các bác sĩ nội khoa tổng quát có thể điều trị nhiều bệnh khác nhau hoặc có thể ảnh hưởng cùng lúc đến nhiều cơ quan khác nhau như: các bệnh rối loạn miễn nhiễm như: luput ban đỏ, phù cứng bì có thể ảnh hưởng đến thần kinh da, phổi, thận và các bộ phận khác..', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2Fnoikhoa.png?alt=media&token=2db2bd68-82ef-49c0-8cd7-e17e48f293c7', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `statuses`
--

INSERT INTO `statuses` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'SUCCESS', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 'FAILED', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 'PENDING', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 'NEW', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 'DONE', '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `birthday` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT 'male',
  `description` text DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `address`, `phone`, `birthday`, `avatar`, `gender`, `description`, `roleId`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Nguyễn Thanh Liêm', 'thanhliem@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Liên Chiểu, Đà Nẵng', '0978451287 ', '12/02/1990', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthanhliem.png?alt=media&token=4175aeb0-cdff-4227-8aa0-0d47afaf4414', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(2, 'Võ Thành Nhân', 'thanhnhan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0978456123', '15/04/1965', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthanhnhan.png?alt=media&token=8885bc1b-9c34-4495-bf42-452b195b7abf', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(3, 'Phạm Nhật An', 'nhatan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0905678901', '28/07/1972', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fnhatan.png?alt=media&token=7fdd9750-b9f9-45d6-a29d-aaf6c9f150fd', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(4, 'Phan Quỳnh Lan', 'quynhlan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0906789012', '03/11/1978', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fquynhlan.png?alt=media&token=3e97fbeb-3eb2-4281-a6c9-304bfc79d891', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(5, 'Nguyễn Thị Tân Sinh', 'tansinh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0907890123', '12/09/1971', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftansinh.png?alt=media&token=c8ed7437-f333-4384-98ee-a05ca4741450', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(6, 'Quách Thanh Dung', 'thanhdung@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0908901234', '20/06/1976', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthanhdung.png?alt=media&token=36264ae2-361a-4088-8cc3-d5e7042919a1', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(7, 'Tôn Thất Trí Dũng', 'tridung@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đà Nẵng', '0909012345', '09/02/1963', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftridung.png?alt=media&token=357062bc-eead-47f8-bbb9-d2087cbbe86a', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(8, 'Ngô Văn Đoan', 'vandoan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0910123456', '31/08/1968', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fvandoan.png?alt=media&token=4d6ca8c6-b21f-4337-8da8-c1ae03fbf666', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(9, 'Nguyễn Tất Bình', 'tatbinh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0911234567', '14/05/1975', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftatbinh.png?alt=media&token=387697ee-cc2b-4786-9a71-34984d76f47e', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(10, 'Nguyễn Văn Quyết', 'vanquyet@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Tĩnh', '0912345678', '24/10/1970', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fvanquyet.png?alt=media&token=af1f07c6-5e32-4c37-99ed-dac94a238e7b', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(11, 'Đoàn Thị Hồng Hạnh', 'honghanh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0913456789', '05/12/19625', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fhonghanh.png?alt=media&token=ae0a1e09-0181-4823-adac-0824f159ed8c', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(12, 'Nguyễn Thái Trí', 'thaitri@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Tĩnh', '0914567890', '17/03/1974', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthaitri.png?alt=media&token=cbcf2820-410b-4819-94d0-b75b13ea8a2c', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(13, 'Lê Trọng Bình', 'trongbinh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0915678901', '28/01/1967', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftrongbinh.png?alt=media&token=b5fffadd-5137-47f9-ac24-d204acf341d1', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(14, 'Phạm Thị Thùy Nhung', 'thuynhung@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đà Nẵng', '0916789012', '10/06/1979', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthuynhung.png?alt=media&token=029088db-b80a-4837-a192-12d31d7e36c6', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(15, 'Đoàn Thị Trung Hiệp', 'trunghiep@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0917890123', '22/09/1961', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftrunghiep.png?alt=media&token=ebc4b49f-d1e2-4315-acaf-b217a973e7f2', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(16, 'Bùi Tiến Đạt', 'tiendat@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0918901234', '30/11/1977', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftiendat.png?alt=media&token=c3ea8939-3cc5-4585-bc29-7c2595fa4979', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(17, 'Huỳnh Thoại Loan', 'thoailan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0919012345', '09/07/1970', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthoailan.png?alt=media&token=5f9a8be9-74cb-4500-bd7a-3ac857abab3d', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(18, 'Nguyễn Thanh Hưng', 'thanhhung@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đà Nẵng', '0920123456', '22/04/1964', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthanhhung.png?alt=media&token=27e8bb2a-b36a-417a-8873-4680fd0c3586', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(19, 'Nguyễn Thị Hoàn', 'thihoan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0921234567', '15/12/1962', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthihoan.png?alt=media&token=84aa2245-4260-4297-8b03-a586680dacb5', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(20, 'Trần Thị Linh Chi', 'linhchi@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0922345678', '27/05/1973', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Flinhchi.png?alt=media&token=18554034-2070-4291-86e6-91411b841d21', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(21, 'Khổng Trọng Thắng', 'trongthang@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0923456789', '07/08/1966', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftrongthang.png?alt=media&token=00b7579a-4e25-42d6-81ec-2f1f6c21a3ce', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(22, 'Dương Thế Vinh', 'thevinh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0924567890', '18/10/1978', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fthevinh.png?alt=media&token=0932257e-d9de-4be7-8e33-31a47be80d03', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(23, 'Nguyễn Đăng Tuân', 'dangtuan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0925678901', '01/02/1972', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fdangtuan.png?alt=media&token=77ddebb5-60cf-4a39-91b4-383001682bc4', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(24, 'Nguyễn Việt Anh', 'vietanh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0926789012', '14/03/1965', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fvietanh.png?alt=media&token=9e09f168-b226-46a3-8c21-593a356cc0f4', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(25, 'Lê Hữu Đồng', 'huudong@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đà Nẵng', '0927890123', '25/09/1976', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fhuudong.png?alt=media&token=692c3b23-c1de-49fb-a9fd-d1585e268a0c', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(26, 'Lê Viết Cường', 'vietcuong@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0928901234', '05/01/1971', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fvietcuong.png?alt=media&token=c85628b0-14c8-4986-9008-45eacb460f5f', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(27, 'Trần Hữu Tuấn', 'huutuan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Nội', '0929012345', '16/07/1963', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fhuutuan.png?alt=media&token=acabe600-36cb-4dfd-8b49-49e8dc262293', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(28, 'Phan Phi Tuấn', 'phituan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'TP Hồ Chí Minh', '0930123456', '26/11/1974', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fphituan.png?alt=media&token=bbc7d22b-cf09-433e-8db8-ed3a6164a890', 'M', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(29, 'Phùng Tuyết Lan', 'tuyetlan@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đà Nẵng', '0931234567', '08/08/1968', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Ftuyetlan.png?alt=media&token=9d5c7631-bf9f-4f0e-b914-493db4ed56fd', 'F', NULL, 2, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(30, 'Võ Hồng Tiên', 'hongtien003@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quế Sơn, Quảng Nam', '0934978913', '29/10/2003', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(31, 'Nguyễn Thị Hương Giang', 'huonggianghk2003@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hà Tĩnh', '0934456123', '16/08/2003', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(32, 'Nguyễn Thị Ngân Anh', 'nguyenngananh44@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Huế', '0945288715', '04/01/2003', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(33, 'Trần Thị Ngọc Quyên', 'ngocquyen@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Nam', '0913456789', '04/04/2003', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(34, 'Nguyễn Văn A', 'nguyenvana.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Phú Thọ', '0897651432', '25/09/1987', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(35, 'Trần Thị B', 'tranthib.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Khánh Hòa', '0432109876', '12/03/1983', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(36, 'Phạm Thị C', 'phamthic.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hưng Yên', '0789654321', '30/07/1974', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(37, 'Lê Đình', 'ledinh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Lạng Sơn', '0981234567', '18/11/1998', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(38, 'Nguyễn Thị D', 'nguyenthid.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Nghệ An', '0654321098', '03/05/1969', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(39, 'Trần Văn Đức', 'tranduc.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Bình', '0345678912', '22/08/1976', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(40, 'Đinh Thị P', 'dinhthip.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Ngãi', '0876543210', '07/12/1985', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(41, 'Lê Nhật Minh', 'leminh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Trị', '0987654321', '15/01/1994', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(42, 'Phan Trần Đức', 'phanduc.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Phú Thọ', '0567890123', '09/06/1991', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(43, 'Vũ Văn Thanh', 'vuthanh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Nghệ An', '0456789012', '28/04/1980', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(44, 'Đoàn Chí Hạ', 'doanha.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đồng Nai', '0234567890', '19/10/1972', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(45, 'Nguyễn Chính Quân', 'nguyenquan.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Ngãi', '0876543210', '11/02/1988', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(46, 'Bùi Văn Hà', 'buivan.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hưng Yên', '0456789012', '01/09/1999', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(47, 'Trần Trí Nam', 'trinam.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Ngãi', '0765432109', '26/07/1978', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(48, 'Trần Hoàng Thủy', 'hoangthuy.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Nghệ An', '0987654321', '17/03/1996', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(49, 'Vũ Hoàng Việt', 'phamviet.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Trị', '0567890123', '04/12/1966', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(50, 'Lương Như Anh', 'luonganh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hải Phòng', '0543210987', '30/10/1982', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(51, 'Nguyễn Thị Hồng Thủy', 'nguyenthuy.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hải Phòng', '0432109876', '14/08/1965', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(52, 'Nguyễn Hoàng Nam', 'hoangnam.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Lạng Sơn', '0981234567', '23/06/1970', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(53, 'Vũ Thị Thu Thảo', 'vuthao.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Đồng Nai', '0765432109', '02/04/1989', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(54, 'Trần Văn Hùng', 'tranhung.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Kon Tum', '0654321098', '08/01/1975', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(55, 'Nguyễn Xuân Thạnh', 'xuanthanh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Kon Tum', '0876543210', '26/11/1992', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(56, 'Ngô Hoàng Tiến', 'hoangtien.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Ngãi', '0345678912', '20/05/1990', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(57, 'Huỳnh Thị Hoàng Anh', 'hoanganh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Nghệ An', '0234567890', '10/09/1973', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(58, 'Nguyễn Hải Anh', 'haianh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Phú Thọ', '0567890123', '01/07/1997', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(59, 'Phạm Ngô Nguyên Hoàng', 'nguyenhoang.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Phú Thọ', '0456789012', '16/02/1981', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(60, 'Trần Văn Dũng', 'trandung.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Bình', '0987654321', '13/06/1995', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(61, 'Trần Thị Phương Thảo', 'phuongthao.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hải Phòng', '0543210987', '03/04/1967', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(62, 'Hoàng Phúc Minh', 'phucminh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Khánh Hòa', '0432109876', '07/11/1971', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(63, 'Nguyễn Việt Anh', 'vietanh.patient@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Quảng Bình', '0765432109', '25/08/1968', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(64, 'Võ Trung Nguyên', 'trungnguyen@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Lạng Sơn', '0981234567', '05/10/1984', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(65, 'Vũ Thị Hoàng', 'hoangthi@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Nghệ An', '0654321098', '19/12/1993', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'F', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(66, 'Cao Nguyên Minh', 'nguyenminh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Hưng Yên', '0234123890', '28/06/1979', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(67, 'Phạm Hoàng Mai', 'hoangmai@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Khánh Hòa', '0876543781', '09/03/1986', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(68, 'Lê Thanh', 'lethanh@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', 'Kon Tum', '0345456912', '14/09/1977', 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'M', NULL, 3, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00'),
(69, 'Admin', 'admin@gmail.com', '$2a$07$DsOq7iXkUI5T9QKylRoN4ecWNd85BDs4wkpKPovAyxSpjCrUVtOp6', NULL, NULL, NULL, 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd', 'other', NULL, 1, 1, '2024-04-16 23:04:01', '2024-04-16 23:04:01', '0000-00-00 00:00:00');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `adminlogs`
--
ALTER TABLE `adminlogs`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `allcodes`
--
ALTER TABLE `allcodes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `doctor_users`
--
ALTER TABLE `doctor_users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `extrainfos`
--
ALTER TABLE `extrainfos`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`sid`);

--
-- Chỉ mục cho bảng `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `adminlogs`
--
ALTER TABLE `adminlogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `allcodes`
--
ALTER TABLE `allcodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `doctor_users`
--
ALTER TABLE `doctor_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `extrainfos`
--
ALTER TABLE `extrainfos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2475;

--
-- AUTO_INCREMENT cho bảng `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
