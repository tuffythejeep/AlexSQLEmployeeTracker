const inquirer = require("inquirer");
const Database = require("./db");
const { ConsoleTable } = require("console-table-printer");
const { queries } = require("./queries.sql"); // Assuming you've parsed SQL queries

const db = new Database();

async function viewAllDepartments() {
  try {
    await db.connect();
    const departments = await db.query(queries.viewAllDepartments);

    const table = new ConsoleTable({
      columns: ["ID", "Name"],
    });

    departments.forEach((department) => {
      table.addRow({
        ID: department.id,
        Name: department.name,
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error(error);
  }
}

async function start() {
  await db.connect();

  const choices = [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee role",
    "Update an employee manager",
    "View employees by manager",
    "View employees by department",
    "Delete department",
    "Delete role",
    "Delete employee",
    "View department budget",
    "Exit",
  ];

  while (true) {
    const { choice } = await inquirer.prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices,
    });

switch (choice) {
  case "View all departments":
    await viewAllDepartments();
    break;
  case "View all roles":
    await viewAllRoles();
    break;
  // ... other cases
  case "Exit":
    console.log("Exiting application...");
    process.exit();
    break;
}

async function viewAllRoles() {
  try {
    await db.connect();
    const roles = await db.query(queries.viewAllRoles);

    const table = new ConsoleTable({
      columns: ["ID", "Title", "Department", "Salary"],
    });

    roles.forEach((role) => {
      table.addRow({
        ID: role.id,
        Title: role.title,
        Department: role.department_name,
        Salary: role.salary,
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error(error);
  }
}

async function viewAllEmployees() {
  try {
    await db.connect();
    const employees = await db.query(queries.viewAllEmployees);

    const table = new ConsoleTable({
      columns: ['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
    });

    employees.forEach(employee => {
      table.addRow({
        ID: employee.id,
        'First Name': employee.first_name,
        'Last Name': employee.last_name,
        'Job Title': employee.title,
        Department: employee.department_name,
        Salary: employee.salary,
        Manager: employee.manager_name || 'None'
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error(error);
  }
}

async function addDepartment() {
  try {
    await db.connect();

    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ]);

    await   
 db.query(queries.addDepartment, [departmentName]);
    console.log('Department added successfully!');
  } catch (error) {
    console.error(error);
  }
}

async function addRole() {
  try {
    await db.connect();

    const departments = await db.query(queries.getAllDepartments);
    const departmentChoices = departments.map(department => ({
      name: department.name,
      value: department.id
    }));

    const   
 { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the role title:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the role salary:',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department:',
        choices: departmentChoices,   

      },
    ]);

    await db.query(queries.addRole, [title, salary, departmentId]);
    console.log('Role added successfully!');
  } catch (error) {
    console.error(error);
  }
}

async function addEmployee() {
  try {
    await db.connect();

    const roles = await db.query(queries.getAllRoles);
    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id
    }));

    const managers = await db.query(queries.getAllEmployees);
    const managerChoices = managers.map(manager => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const   
 { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'lastName',
        message:   
 'Enter the employee\'s last name:',
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the employee\'s role:',
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the employee\'s manager:',
        choices: managerChoices,
      },
    ]);

    await db.query(queries.addEmployee,   
 [firstName, lastName, roleId, managerId]);
    console.log('Employee added successfully!');
  } catch (error) {
    console.error(error);   

  }
}

async function updateEmployeeRole() {
  try {
    await db.connect();

    const employees = await db.query(queries.getAllEmployees);
    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id   

    }));

    const roles = await db.query(queries.getAllRoles);   

    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id
    }));

    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the employee\'s new role:',
        choices: roleChoices,
      },
    ]);

    await db.query(queries.updateEmployeeRole,   
 [roleId, employeeId]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error(error);
  }
}

async function viewEmployeesByManager() {
  try {
    await db.connect();

    const managers = await db.query(queries.getAllManagers);
    const managerChoices = managers.map(manager => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select a manager:',
        choices: managerChoices,
      },
    ]);

    const employees = await db.query(queries.viewEmployeesByManager, [managerId]);

    const table = new ConsoleTable({
      columns: ['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary'],
    });

    employees.forEach(employee => {
      table.addRow({
        ID: employee.id,
        'First Name': employee.first_name,
        'Last Name': employee.last_name,
        'Job Title': employee.title,
        Department: employee.department_name,
        Salary: employee.salary,
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error(error);
  }
}


start();
