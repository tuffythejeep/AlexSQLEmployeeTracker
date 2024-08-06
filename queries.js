// queries.js

module.exports = {
  viewAllDepartments: `
    SELECT id, name 
    FROM department
  `,

  viewAllRoles: `
    SELECT r.id, r.title, d.name AS department_name, r.salary
    FROM role r
    JOIN department d ON r.department_id = d.id
  `,

  viewAllEmployees: `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, 
           CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `,

  addDepartment: `
    INSERT INTO department (name) VALUES (?)
  `,

  addRole: `
    INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)
  `,

  addEmployee: `
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)
  `,

  updateEmployeeRole: `
    UPDATE employee SET role_id = ? WHERE id = ?
  `,

  // Add more queries as needed...
};