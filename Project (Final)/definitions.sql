-- Data Definiton Queries for my project
-- By Daniel Lindsay
-- May 1, 2018

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `customer_id` int(11)  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `ccnumber` varchar(20),
  `roomnumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `manager_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `style` varchar(100),
  `floor` int(11) NOT NULL,
  `roomlocation` int(11) NOT NULL,
  `roommanager` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
CREATE TABLE `rewards` (
  `rewards_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `discount` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `city` varchar(100)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `customer_rewards`
--

DROP TABLE IF EXISTS `customer_rewards`;
CREATE TABLE `customer_rewards` (
  `customer_id` int(11),
  `rewards_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `customer_rewards`
--

ALTER TABLE `customer_rewards`
 ADD PRIMARY KEY (`customer_id`,`rewards_id`),
 ADD KEY `customer_id` (`customer_id`);

--
-- Constraints for table `customer`
--

ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`roomnumber`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE ON DELETE CASCADE;
COMMIT;

--
-- Constraints for table `room`
--

ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`roomlocation`) REFERENCES `location` (`location_id`) ON UPDATE CASCADE ON DELETE CASCADE,
  ADD CONSTRAINT `room_ibfk_2` FOREIGN KEY (`roommanager`) REFERENCES `manager` (`manager_id`) ON UPDATE CASCADE ON DELETE CASCADE;
COMMIT;

--
-- Constraints for table `customer_rewards`
--

ALTER TABLE `customer_rewards`
  ADD CONSTRAINT `customer_rewards_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON UPDATE CASCADE ON DELETE CASCADE,
  ADD CONSTRAINT `customer_rewards_ibfk_2` FOREIGN KEY (`rewards_id`) REFERENCES `rewards` (`rewards_id`) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`manager_id`, `firstname`, `lastname`) VALUES
(1, 'Louis', 'Sombat'),
(2, 'Alfred', 'Puzio'),
(3, 'Miki', 'Sashimura'),
(4, 'Mitsunori', 'Owada');

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`location_id`, `name`, `city`) VALUES
(1, 'The Luxe', 'Los Angeles'),
(2, 'Silk', 'New York'),
(3, 'Blizzard', 'Chicago'),
(4, 'Fire', 'Miami');

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `style`, `floor`, `roomlocation`, `roommanager`) VALUES
(1, 'Japanese',   3,  1, 1),
(2, 'Art Deco',   4,  2, 1),
(3, 'Modern',     6,  3, 1),
(4, 'French',     22, 4, 1),
(5, 'Beach',      1,  1, 2),
(6, 'Victorian',  5,  2, 2),
(7, 'Monochrome', 6,  3, 2),
(8, 'Campsite',   9,  4, 2);

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `firstname`, `lastname`, `ccnumber`, `roomnumber`) VALUES
(1, 'Daniel', 'Lindsay', '1111111111111111', 2),
(2, 'Evan', 'Tuozzoli', '1111111111111111', 3),
(3, 'Victoria', 'Grillo', '1111111111111111', 4),
(4, 'Francesca', 'Benedetto', '1111111111111111', 5),
(5, 'Talal', 'Alvie', '1111111111111111', 6),
(6, 'James', 'Tai', '1111111111111111', 7),
(7, 'Amanda', 'Sapienza', '1111111111111111', 8),
(8, 'Anthony', 'Telesca', '1111111111111111', 1);

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`rewards_id`, `name`, `discount`) VALUES
(1, 'Bronze', 5),
(2, 'Silver', 10),
(3, 'Gold', 15),
(4, 'Platinum', 20);


--
-- Dumping data for table `customer_rewards`
--

INSERT INTO `customer_rewards` (`customer_id`, `rewards_id`) VALUES
(1, 2),
(2, 3),
(3, 2),
(4, 3),
(5, 4),
(6, 4),
(7, 1),
(8, 1);
