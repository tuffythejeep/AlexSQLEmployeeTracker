DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) UNIQUE,
    salary INT,
    department_id INT REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INT REFERENCES role(id),
    manager_id INT REFERENCES employee(id),
    UNIQUE (first_name, last_name)
);

SELECT
  e.first_name,
  e.last_name,
  r.title AS role_title,
  r.salary,
  d.name AS department_name
FROM
  employee e
  JOIN role r ON e.role_id = r.id
  JOIN department d ON r.department_id = d.id;

SELECT
  e.first_name AS employee_first_name,
  e.last_name AS employee_last_name,
  m.first_name AS manager_first_name,
  m.last_name AS manager_last_name
FROM
  employee e
  LEFT JOIN employee m ON e.manager_id = m.id;

SELECT
  r.title AS role_title,
  r.salary,
  d.name AS department_name
FROM
  role r
  JOIN department d ON r.department_id = d.id;

SELECT
  e.first_name AS employee_first_name,
  e.last_name AS employee_last_name,
  r.title AS role_title,
  r.salary,
  d.name AS department_name,
  m.first_name AS manager_first_name,
  m.last_name AS manager_last_name
FROM
  employee e
  JOIN role r ON e.role_id = r.id
  JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;

SELECT
  d.name AS department_name,
  COUNT(e.id) AS employee_count
FROM
  department d
  LEFT JOIN role r ON d.id = r.department_id
  LEFT JOIN employee e ON r.id = e.role_id
GROUP BY
  d.name;

\i seeds.sql;