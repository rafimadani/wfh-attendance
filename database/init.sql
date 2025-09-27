-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wfh_attendance;
USE wfh_attendance;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('employee', 'hr') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table for employee management
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Attendance table for tracking work from home attendance
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_path VARCHAR(500),
    notes TEXT,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Insert default HR user
INSERT INTO users (email, password, role) VALUES 
('hr@company.com', '$2b$10$rQZ8kHWKtGkVQZ8kHWKtGOyQZ8kHWKtGkVQZ8kHWKtGkVQZ8kHWKtG', 'hr');

-- Insert default employee user
INSERT INTO users (email, password, role) VALUES 
('employee@company.com', '$2b$10$rQZ8kHWKtGkVQZ8kHWKtGOyQZ8kHWKtGkVQZ8kHWKtGkVQZ8kHWKtG', 'employee');

-- Insert sample employee data
INSERT INTO employees (user_id, employee_id, first_name, last_name, department, position, phone, hire_date) VALUES 
(2, 'EMP001', 'John', 'Doe', 'IT', 'Software Developer', '+1234567890', '2024-01-15');
