module.exports = {
  viewAllDepartments: "SELECT * FROM department;",

  viewAllRoles: `
    SELECT role.id, role.title, department.name AS department_name, role.salary
    FROM role
    JOIN department ON role.department_id = department.id;
  `,

  viewAllEmployees: `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, 
           department.name AS department_name, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;
  `,

  addDepartment: "INSERT INTO department (name) VALUES ($1)",

  addRole:
    "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",

  addEmployee:
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",

  updateEmployeeRole: "UPDATE employee SET role_id = $1 WHERE id = $2",

  updateEmployeeManager: "UPDATE employee SET manager_id = $1 WHERE id = $2",

  viewEmployeesByManager: `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, 
           department.name AS department_name, role.salary
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    WHERE employee.manager_id = $1
  `,

  viewEmployeesByDepartment: `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    WHERE department.id = $1
  `,

  deleteDepartment: "DELETE FROM department WHERE id = $1",

  deleteRole: "DELETE FROM role WHERE id = $1",

  deleteEmployee: "DELETE FROM employee WHERE id = $1",

  viewDepartmentBudget: `
    SELECT department.id, department.name, SUM(role.salary) AS total_budget
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    WHERE department.id = $1
    GROUP BY department.id, department.name
  `,

  getAllRoles: "SELECT * FROM role",
  getAllEmployees: "SELECT * FROM employee",
};
