-- Load the configuration.
SET @dbName = 'concert_finder';
SET @adminUser = 'admin';
SET @adminPwd = 'admin_password';

-- Create the database.
CREATE DATABASE IF NOT EXISTS concert_finder;

-- Switch to the database.
USE concert_finder;

-- Create users table.
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL
);

-- Create saved concerts table.
CREATE TABLE IF NOT EXISTS saved_concerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    artist VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create admin user with necessary privileges.
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin_password';
GRANT ALL PRIVILEGES ON concert_finder.* TO 'admin'@'localhost' WITH GRANT OPTION;

-- Create a regular user for application.
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'user_password';
GRANT SELECT, INSERT, UPDATE ON concert_finder.* TO 'app_user'@'localhost';

-- Flush privileges to apply changes.
FLUSH PRIVILEGES;
