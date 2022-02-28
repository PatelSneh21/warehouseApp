-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema warehousedb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `warehousedb` ;

-- -----------------------------------------------------
-- Schema warehousedb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `warehousedb` DEFAULT CHARACTER SET utf8 ;
USE `warehousedb` ;

-- -----------------------------------------------------
-- Table `warehousedb`.`rack_info`
-- stores data on the rack types and locations in the warehouse
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`rack_info` ;

CREATE TABLE IF NOT EXISTS `mydb`.`rack_info` (
  `rack_id` INT NOT NULL,
  `rack_location` VARCHAR(45) NULL,
  PRIMARY KEY (`rack_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`bin_info`
-- data on bin location and size
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`bin_info` ;

CREATE TABLE IF NOT EXISTS `mydb`.`bin_info` (
  `bin_id` INT NOT NULL,
  `bin_height` INT NULL,
  `bin_location` VARCHAR(45) NULL,
  `rack_info_rack_id` INT NOT NULL,
  PRIMARY KEY (`bin_id`, `rack_info_rack_id`),
  CONSTRAINT `fk_bin_info_rack_info`
    FOREIGN KEY (`rack_info_rack_id`)
    REFERENCES `mydb`.`rack_info` (`rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_bin_info_rack_info_idx` ON `mydb`.`bin_info` (`rack_info_rack_id` ASC);


-- -----------------------------------------------------
-- Table `warehousedb`.`deposits`
-- data for new incoming shipments
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`deposits` ;

CREATE TABLE IF NOT EXISTS `mydb`.`deposits` (
  `deposit_id` INT NOT NULL AUTO_INCREMENT,
  `deposit_date` DATETIME NULL,
  `item_id` INT NULL,
  `num_cartons` INT NULL,
  `bin_info_bin_id` INT NOT NULL,
  `bin_info_rack_info_rack_id` INT NOT NULL,
  `items_item_id` INT NOT NULL,
  PRIMARY KEY (`deposit_id`, `bin_info_bin_id`, `bin_info_rack_info_rack_id`, `items_item_id`),
  CONSTRAINT `fk_deposits_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `mydb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_deposits_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `mydb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_deposits_bin_info1_idx` ON `mydb`.`deposits` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC);

CREATE INDEX `fk_deposits_items1_idx` ON `mydb`.`deposits` (`items_item_id` ASC);


-- -----------------------------------------------------
-- Table `warehousedb`.`items`
-- data for individual item models
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`items` ;

CREATE TABLE IF NOT EXISTS `mydb`.`items` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `item_name` VARCHAR(45) NULL,
  `model_number` INT NULL,
  `item_price` DECIMAL(10,2) NULL,
  `quantity` INT NULL,
  PRIMARY KEY (`item_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`customers`
-- data on customers
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`customers` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`customers` (
  `customer_id` INT NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(45) NULL,
  PRIMARY KEY (`customer_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`users`
-- identifies users with their permissions
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`users` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NULL,
  `user_type` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`sales`
-- data for sales information
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`sales` ;

CREATE TABLE IF NOT EXISTS `mydb`.`sales` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `transaction_date` DATETIME NULL,
  `item_amount` INT NULL,
  `tax_collected` DECIMAL(10,2) NULL,
  `revenue` DECIMAL(10,2) NULL,
  `items_item_id` INT NOT NULL,
  `bin_info_bin_id` INT NOT NULL,
  `bin_info_rack_info_rack_id` INT NOT NULL,
  `customers_customer_id` INT NOT NULL,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`transaction_id`, `items_item_id`, `bin_info_bin_id`, `bin_info_rack_info_rack_id`, `customers_customer_id`, `users_user_id`),
  CONSTRAINT `fk_sales_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `mydb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `mydb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_customers1`
    FOREIGN KEY (`customers_customer_id`)
    REFERENCES `mydb`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_sales_items1_idx` ON `mydb`.`sales` (`items_item_id` ASC);

CREATE INDEX `fk_sales_bin_info1_idx` ON `mydb`.`sales` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC);

CREATE INDEX `fk_sales_customers1_idx` ON `mydb`.`sales` (`customers_customer_id` ASC);

CREATE INDEX `fk_sales_users1_idx` ON `mydb`.`sales` (`users_user_id` ASC);


-- -----------------------------------------------------
-- Table `warehousedb`.`samples`
-- free samples taken out of the warehouse for marketing
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`samples` ;

CREATE TABLE IF NOT EXISTS `mydb`.`samples` (
  `sample_id` INT NOT NULL AUTO_INCREMENT,
  `withdraw_date` DATETIME NULL,
  `item_amount` INT NULL,
  `items_item_id` INT NOT NULL,
  `bin_info_bin_id` INT NOT NULL,
  `bin_info_rack_info_rack_id` INT NOT NULL,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`sample_id`, `items_item_id`, `bin_info_bin_id`, `bin_info_rack_info_rack_id`, `users_user_id`),
  CONSTRAINT `fk_samples_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `mydb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_samples_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `mydb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_samples_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_samples_items1_idx` ON `mydb`.`samples` (`items_item_id` ASC);

CREATE INDEX `fk_samples_bin_info1_idx` ON `mydb`.`samples` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC);

CREATE INDEX `fk_samples_users1_idx` ON `mydb`.`samples` (`users_user_id` ASC);


-- -----------------------------------------------------
-- Table `warehousedb`.`master_cartons`
-- information on master cartons for each item
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`master_cartons` ;

CREATE TABLE IF NOT EXISTS `mydb`.`master_cartons` (
  `carton_id` INT NOT NULL AUTO_INCREMENT,
  `carton_size` VARCHAR(45) NULL,
  `num_items` VARCHAR(45) NULL,
  `items_item_id` INT NOT NULL,
  PRIMARY KEY (`carton_id`, `items_item_id`),
  CONSTRAINT `fk_master_cartons_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `mydb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_master_cartons_items1_idx` ON `mydb`.`master_cartons` (`items_item_id` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
