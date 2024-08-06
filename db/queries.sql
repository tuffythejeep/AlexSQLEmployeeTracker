-- View all departments
SELECT * FROM department;

-- Add a department
INSERT INTO department (name) VALUES ($1);

-- View all roles with department names
SELECT r.id, r.title, d.name AS department_name, r.salary
FROM role r
INNER JOIN department d ON r.department_id = d.id;

-- View all employees with roles, departments, and managers
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e
INNER JOIN role r ON e.role_id = r.id
INNER JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;

-- Add a department
INSERT INTO department (name) VALUES ($1);

-- Add a role to a department
INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);

-- Add an employee to a role
UPDATE employee SET role_id = $1 WHERE id = $2;