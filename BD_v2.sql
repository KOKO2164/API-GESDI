CREATE DATABASE gesdi;

-- -----------------------------------------------------
-- Schema gesdi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gesdi` DEFAULT CHARACTER SET utf8mb4 ;
USE `gesdi` ;

-- -----------------------------------------------------
-- Table `gesdi`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `user_password` VARCHAR(64) NOT NULL, -- SHA-256
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`user_email` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `gesdi`.`types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`types` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`type_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `gesdi`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(45) NOT NULL,
  `user_id` INT NULL DEFAULT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`category_id`),
  INDEX `fk_categories_users_idx` (`user_id` ASC),
  INDEX `fk_categories_types1_idx` (`type_id` ASC),
  CONSTRAINT `fk_categories_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`),
  CONSTRAINT `fk_categories_types1`
    FOREIGN KEY (`type_id`)
    REFERENCES `gesdi`.`types` (`type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

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
  INDEX `fk_goals_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_goals_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `gesdi`.`transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`transactions` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `transaction_amount` DECIMAL(10,2) NOT NULL,
  `transaction_date` DATE NOT NULL,
  `transaction_description` TEXT NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  `category_id` INT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `fk_transactions_users1_idx` (`user_id` ASC),
  INDEX `fk_transactions_categories1_idx` (`category_id` ASC),
  INDEX `fk_transactions_types1_idx` (`type_id` ASC),
  CONSTRAINT `fk_transactions_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `gesdi`.`categories` (`category_id`),
  CONSTRAINT `fk_transactions_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gesdi`.`users` (`user_id`),
  CONSTRAINT `fk_transactions_types1`
    FOREIGN KEY (`type_id`)
    REFERENCES `gesdi`.`types` (`type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `gesdi`.`budgets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gesdi`.`budgets` (
  `budget_id` INT NOT NULL AUTO_INCREMENT,
  `budget_name` VARCHAR(60) NOT NULL,
  `budget_amount` DECIMAL(10,2) NOT NULL,
  `budget_month` INT NULL,
  `budget_year` INT NOT NULL,
  `budget_is_total` BOOLEAN NOT NULL DEFAULT FALSE,
  `category_id` INT NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`budget_id`),
  INDEX `fk_budgets_categories1_idx` (`category_id` ASC),
  INDEX `fk_budgets_users1_idx` (`user_id` ASC),
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
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

INSERT INTO `GESDI`.`types` (`type_name`)
VALUES
('Ingreso'),
('Gasto');

INSERT INTO `GESDI`.`categories` (`category_name`, `user_id`, `type_id`)
VALUES
('Salario', NULL, 1),  -- Categoría predefinida
('Comida', NULL, 2),   -- Categoría predefinida
('Entretenimiento', NULL, 2);  -- Categoría predefinida