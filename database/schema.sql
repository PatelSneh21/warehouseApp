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
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`rack_info` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`rack_info` (
  `rack_id` INT NOT NULL,
  `rack_location` VARCHAR(45) NULL,
  PRIMARY KEY (`rack_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`bin_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`bin_info` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`bin_info` (
  `bin_id` INT NOT NULL,
  `bin_height` INT NULL,
  `bin_location` VARCHAR(45) NULL,
  `rack_info_rack_id` INT NOT NULL,
  PRIMARY KEY (`bin_id`, `rack_info_rack_id`),
  INDEX `fk_bin_info_rack_info_idx` (`rack_info_rack_id` ASC),
  CONSTRAINT `fk_bin_info_rack_info`
    FOREIGN KEY (`rack_info_rack_id`)
    REFERENCES `warehousedb`.`rack_info` (`rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`deposits`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`deposits` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`deposits` (
  `deposit_id` INT NOT NULL,
  `deposit_date` DATETIME NULL,
  `item_id` INT NULL,
  `num_cartons` INT NULL,
  `bin_info_bin_id` INT NOT NULL,
  `bin_info_rack_info_rack_id` INT NOT NULL,
  PRIMARY KEY (`deposit_id`, `bin_info_bin_id`, `bin_info_rack_info_rack_id`),
  INDEX `fk_deposits_bin_info1_idx` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC),
  CONSTRAINT `fk_deposits_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `warehousedb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`items` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`items` (
  `item_id` INT NOT NULL,
  `item_name` VARCHAR(45) NULL,
  `model_number` INT NULL,
  `item_price` DECIMAL(10,2) NULL,
  `quantity` INT NULL,
  `deposits_deposit_id` INT NOT NULL,
  PRIMARY KEY (`item_id`, `deposits_deposit_id`),
  INDEX `fk_items_deposits1_idx` (`deposits_deposit_id` ASC),
  CONSTRAINT `fk_items_deposits1`
    FOREIGN KEY (`deposits_deposit_id`)
    REFERENCES `warehousedb`.`deposits` (`deposit_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`customers` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`customers` (
  `customer_id` INT NOT NULL,
  `customer_name` VARCHAR(45) NULL,
  PRIMARY KEY (`customer_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`users` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`users` (
  `user_id` INT NOT NULL,
  `user_name` VARCHAR(45) NULL,
  `user_type` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`sales`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`sales` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`sales` (
  `transaction_id` INT NOT NULL,
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
  INDEX `fk_sales_items1_idx` (`items_item_id` ASC),
  INDEX `fk_sales_bin_info1_idx` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC),
  INDEX `fk_sales_customers1_idx` (`customers_customer_id` ASC),
  INDEX `fk_sales_users1_idx` (`users_user_id` ASC),
  CONSTRAINT `fk_sales_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `warehousedb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `warehousedb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_customers1`
    FOREIGN KEY (`customers_customer_id`)
    REFERENCES `warehousedb`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `warehousedb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`samples`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`samples` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`samples` (
  `sample_id` INT NOT NULL,
  `withdraw_date` DATETIME NULL,
  `item_amount` INT NULL,
  `items_item_id` INT NOT NULL,
  `bin_info_bin_id` INT NOT NULL,
  `bin_info_rack_info_rack_id` INT NOT NULL,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`sample_id`, `items_item_id`, `bin_info_bin_id`, `bin_info_rack_info_rack_id`, `users_user_id`),
  INDEX `fk_samples_items1_idx` (`items_item_id` ASC),
  INDEX `fk_samples_bin_info1_idx` (`bin_info_bin_id` ASC, `bin_info_rack_info_rack_id` ASC),
  INDEX `fk_samples_users1_idx` (`users_user_id` ASC),
  CONSTRAINT `fk_samples_items1`
    FOREIGN KEY (`items_item_id`)
    REFERENCES `warehousedb`.`items` (`item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_samples_bin_info1`
    FOREIGN KEY (`bin_info_bin_id` , `bin_info_rack_info_rack_id`)
    REFERENCES `warehousedb`.`bin_info` (`bin_id` , `rack_info_rack_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_samples_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `warehousedb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `warehousedb`.`master_cartons`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `warehousedb`.`master_cartons` ;

CREATE TABLE IF NOT EXISTS `warehousedb`.`master_cartons` (
  `carton_id` INT NOT NULL,
  `carton_size` VARCHAR(45) NULL,
  `num_items` VARCHAR(45) NULL,
  `items_item_id` INT NOT NULL,
  `items_deposits_deposit_id` INT NOT NULL,
  PRIMARY KEY (`carton_id`, `items_item_id`, `items_deposits_deposit_id`),
  INDEX `fk_master_cartons_items1_idx` (`items_item_id` ASC, `items_deposits_deposit_id` ASC),
  CONSTRAINT `fk_master_cartons_items1`
    FOREIGN KEY (`items_item_id` , `items_deposits_deposit_id`)
    REFERENCES `warehousedb`.`items` (`item_id` , `deposits_deposit_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
