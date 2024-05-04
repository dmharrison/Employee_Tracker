-- Drop the database if it exists
DROP DATABASE IF EXISTS employees;

-- Create the new database
CREATE DATABASE employees;

-- Connect to the database
\c employees

-- TODO- write an SQL command to Create the department table
CREATE TABLE department (
     id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
);

-- TODO- write an SQL command to Create the role table
CREATE TABLE role (
     id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department INTEGER,
);

-- TODO- write an SQL command to Create the employee table
CREATE TABLE employee (
     id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
);


