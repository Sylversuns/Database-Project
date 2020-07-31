-- These are some Database Manipulation queries for a partially implemented Project Website using my Hotel Database.

-- POPULATING DROPDOWNS

-- get all Room IDs to populate the Room dropdown
SELECT `room_id` FROM `room`;

-- get all Location IDs and names to populate the Location dropdown
SELECT `location_id`, `name` FROM `location`;

-- get all Manager IDs and last names to populate the Manager dropdown
SELECT `manager_id`, `lastname` FROM `manager`;

-- get all Customer IDs and last names to populate the Customer dropdown
SELECT `customer_id`, `lastname` FROM `customer`;

-- get all Rewards IDs and names to populate the Rewards dropdown
SELECT `rewards_id`, `name` FROM `rewards`;



-- SELECTING ALL

-- get all customers for the List Customers page
SELECT `customer_id`, `firstname`,`lastname`,`ccnumber`,`roomnumber` FROM `customer`;

-- get all managers for the List Managers page
SELECT `manager_id`,`firstname`,`lastname` FROM `manager`;

-- get all rooms for the List Rooms page
SELECT `room_id`,`style`,`floor`,`location_id`,`manager_id` FROM `room`;

-- get all rewards programs for the List Rewards Programs page
SELECT `rewards_id`,`name`,`discount` FROM `rewards`;

-- get all locations for the List Locations page
SELECT `location_id`,`name`,`city` FROM `location`;

-- get all customers with their current associated rewards programs to list
SELECT `customer_id` AS pid, `rewards_id` AS cid, CONCAT(`firstname`,' ',`lastname`) AS fullname, `name`
FROM `customer`
INNER JOIN `customer_rewards` ON `customer`.`customer_id` = `customer_rewards`.`customer_id`
INNER JOIN `rewards` ON `customer_rewards`.`rewards_id` = `rewards`.`rewards_id`
ORDER BY fullname, `name`;



-- SELECTING SINGLE

-- get a single customer's data for the Update Customer form
SELECT `customer_id`, `firstname`,`lastname`,`ccnumber`,`roomnumber` FROM `customer` WHERE `customer_id` = [customer_ID_selected_from_list_customer_page];

-- get a single manager's data for the Update Manager form
SELECT `manager_id`, `firstname`,`lastname` FROM `manager` WHERE `manager_id` = [manager_ID_selected_from_list_manager_page];

-- get a single room's data for the Update Room form
SELECT `room_id`, `style`,`floor`,`location_id`,`manager_id` FROM `room` WHERE `room_id` = [room_ID_selected_from_list_room_page];

-- get a single rewards program's data for the Update Rewards Program form
SELECT `rewards_id`,`name`,`discount` FROM `rewards` WHERE `rewards_id` = [rewards_ID_selected_from_list_rewards_page];

-- get a single location's data for the Update Location form
SELECT `location_id`,`name`,`city` FROM `location` WHERE `location_id` = [location_ID_selected_from_list_location_page];

-- get a single customer/rewards program relationship's data for the Update Relationship form
SELECT `customer_id`,`rewards_id` FROM `customer_rewards` WHERE `customer_id` = [customer_ID_selected_from_list_customer_rewards_page] AND `rewards_id` = [rewards_ID_selected_from_list_customer_rewards_page];



-- ADDING NEW

-- add a new customer
INSERT INTO `customer` (`firstname`,`lastname`,`ccnumber`,`roomnumber`) VALUES ([firstnameinput],[lastnameinput],[ccnumberinput],[room_id_from_dropdown_input]);

-- add a new manager
INSERT INTO `manager` (`firstname`,`lastname`) VALUES ([firstnameinput],[lastnameinput]);

-- add a new room
INSERT INTO `room` (`style`,`floor`,`location_id`,`manager_id`) VALUES ([styleinput],[floorinput],[location_id_dropdown_input],[manager_id_dropdown_input]);

-- add a new rewards program
INSERT INTO `rewards` (`name`,`discount`) VALUES ([nameinput],[discountinput]);

-- add a new location
INSERT INTO `location` (`name`,`city`) VALUES ([nameinput],[cityinput]);

-- associate a customer with a rewards program
INSERT INTO `customer_rewards` (`customer_id`,`rewards_id`) VALUES ([customer_id_from_dropdown],[rewards_id_from_dropdown]);



-- UPDATING

-- update a customer's data based on submission of the Update Customer form
UPDATE `customer` SET `firstname`=[firstnameinput], `lastname`=[lastnameinput],`ccnumber`=[ccnumberinput],`roomnumber`=[roomnumber_from_dropdown] WHERE `customer_id`=[customer_id_from_update_form];

-- update a manager's data
UPDATE `manager` SET `firstname`=[firstnameinput],`lastname`=[lastnameinput];

-- update a room's data
UPDATE `room` SET `style`=[styleinput],`floor`=[floorinput],`location_id`=[location_id_dropdown_input],`manager_id`=[manager_id_dropdown_input];

-- update a rewards program's data
UPDATE `rewards` SET `name`=[nameinput],`discount`=[discountinput];

-- update a location's data
UPDATE `location` SET `name`=[nameinput],`city`=[cityinput];

-- update a customer/rewards program relationship's data
UPDATE `customer_rewards` SET `customer_id`=[customer_id_from_dropdown],`rewards_id`=[rewards_id_from_dropdown];



-- DELETING

-- delete a customer
DELETE FROM `customer` WHERE `customer_id` = [customer_ID_selected_from_list_customer_page];

-- delete a manager
DELETE FROM `manager` WHERE `manager_id` = [manager_ID_selected_from_list_manager_page];

-- delete a room
DELETE FROM `room` WHERE `room_id` = [room_ID_selected_from_list_room_page];

-- delete a rewards program
DELETE FROM `rewards` WHERE `rewards_id` = [rewards_ID_selected_from_list_rewards_page];

-- delete a location
DELETE FROM `location` WHERE `location_id` = [location_ID_selected_from_list_location_page];

-- delete a customer/rewards program relationship
DELETE FROM `customer_rewards` WHERE `customer_id` = [customer_ID_selected_from_customer_and_rewards_page] AND `rewards_id` = [rewards_ID_selected_from_customer_and_rewards_page];



-- EXTRA FUNCTIONS

-- search customers by name
SELECT `customer_id`, `firstname`,`lastname`,`ccnumber`,`roomnumber` FROM `customer` WHERE `firstname` = [firstnameinput] AND `lastname` = [lastnameinput];

-- filter customers by rewards program
SELECT `firstname`, `lastname` FROM `customer`
INNER JOIN `customer_rewards` ON `customer_rewards`.`customer_id` = `customer`.`customer_id`
INNER JOIN `rewards` ON `rewards`.`rewards_id` = `customer_rewards`.`rewards_id`
WHERE `name`=[nameinput]
ORDER BY `name`;
