CREATE DATABASE IF NOT EXISTS student_portal_db;
USE student_portal_db;

-- Table for storing student information
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    course VARCHAR(50),
    branch VARCHAR(50),
    gender VARCHAR(10),
    age INT,
    status VARCHAR(20) DEFAULT 'active'
);

-- Table for admin credentials
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Insert a default admin account
INSERT INTO admins (username, password) VALUES ('admin', 'admin123')
ON DUPLICATE KEY UPDATE username=username;