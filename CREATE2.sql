-- -----------------------------------------------------
-- Schema gesdi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gesdi` DEFAULT CHARACTER SET utf8mb3 ;
USE `gesdi` ;

-- -----------------------------------------------------
-- Table `gesdi`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `user_email` VARCHAR(45) NOT NULL,
  `user_password` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`user_email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(45) NOT NULL,
  `category_type` VARCHAR(45) NOT NULL,
  `user_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  INDEX `fk_categories_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_categories_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`))
ENGINE = InnoDB;

INSERT INTO `GESDI`.`categories` (`category_name`, `category_type`, `user_id`)
VALUES
('Salario', 'Ingresos', NULL),  -- Categoría predefinida
('Comida', 'Gastos', NULL),   -- Categoría predefinida
('Entretenimiento', 'Gastos', NULL);  -- Categoría predefinida

-- -----------------------------------------------------
-- Table `gesdi`.`goals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`goals` (
  `goal_id` INT NOT NULL AUTO_INCREMENT,
  `goal_name` VARCHAR(45) NOT NULL,
  `goal_target_amount` DECIMAL(10,2) NOT NULL,
  `goal_actual_amount` DECIMAL(10,2) NOT NULL,
  `goal_deadline` DATE NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`goal_id`),
  INDEX `fk_goals_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_goals_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`transactions` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `transaction_amount` DECIMAL(10,2) NOT NULL,
  `transaction_type` VARCHAR(45) NOT NULL,
  `transaction_date` DATE NOT NULL,
  `transaction_description` TEXT NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  `category_id` INT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `fk_transactions_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_transactions_categories1_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `fk_transactions_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `gesdi`.`categories` (`category_id`),
  CONSTRAINT `fk_transactions_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`budgets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`budgets` (
  `budget_id` INT NOT NULL AUTO_INCREMENT,
  `budget_amount` DECIMAL(10,2) NOT NULL,
  `budget_period` VARCHAR(45) NOT NULL,
  `category_id` INT NULL,
  `user_id` INT NULL,
  PRIMARY KEY (`budget_id`),
  INDEX `fk_budgets_categories1_idx` (`category_id` ASC) VISIBLE,
  INDEX `fk_budgets_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_budgets_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `gesdi`.`categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_budgets_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`bank_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`bank_accounts` (
  `bank_account_id` INT NOT NULL AUTO_INCREMENT,
  `bank_account_number` VARCHAR(45) NOT NULL,
  `bank_account_name` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`bank_account_id`),
  INDEX `fk_bank_accounts_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_bank_accounts_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`cards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`cards` (
  `card_id` INT NOT NULL AUTO_INCREMENT,
  `card_number` VARCHAR(45) NOT NULL,
  `card_type` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  `bank_account_id` INT NOT NULL,
  PRIMARY KEY (`card_id`),
  INDEX `fk_cards_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_cards_bank_accounts1_idx` (`bank_account_id` ASC) VISIBLE,
  CONSTRAINT `fk_cards_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cards_bank_accounts1`
    FOREIGN KEY (`bank_account_id`)
    REFERENCES `gesdi`.`bank_accounts` (`bank_account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gesdi`.`reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `report_name` VARCHAR(45) NOT NULL,
  `report_date` TIMESTAMP NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`report_id`),
  INDEX `fk_reports_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_reports_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
