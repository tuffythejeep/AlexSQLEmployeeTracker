const inquirer = require("inquirer");
const db = require("./db");
const { ConsoleTable } = require("console-table-printer");
const queries = require("./queries");

async function viewAllDepartments() {
  try {
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
    console.error("Error viewing departments:", error);
  }
}

async function viewAllRoles() {
  try {
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
    console.error("Error viewing roles:", error);
  }
}

async function viewAllEmployees() {
  try {
    const employees = await db.query(queries.viewAllEmployees);
    const table = new ConsoleTable({
      columns: [
        "ID",
        "First Name",
        "Last Name",
        "Job Title",
        "Department",
        "Salary",
        "Manager",
      ],
    });
    employees.forEach((employee) => {
      table.addRow({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        "Job Title": employee.title,
        Department: employee.department_name,
        Salary: employee.salary,
        Manager: employee.manager_name || "None",
      });
    });
    console.log(table.toString());
  } catch (error) {
    console.error("Error viewing employees:", error);
  }
}

async function addDepartment() {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
        validate: (input) =>
          input.trim() !== "" || "Department name cannot be empty",
      },
    ]);
    await db.query(queries.addDepartment, [departmentName]);
    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error);
  }
}

async function addRole() {
  try {
    const departments = await db.query(queries.getAllDepartments);
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title:",
        validate: (input) =>
          input.trim() !== "" || "Role title cannot be empty",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role salary:",
        validate: (input) =>
          (!isNaN(input) && input > 0) || "Please enter a valid salary",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select the department:",
        choices: departmentChoices,
      },
    ]);

    await db.query(queries.addRole, [title, salary, departmentId]);
    console.log("Role added successfully!");
  } catch (error) {
    console.error("Error adding role:", error);
  }
}

async function addEmployee() {
  try {
    const roles = await db.query(queries.getAllRoles);
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const managers = await db.query(queries.getAllEmployees);
    const managerChoices = managers.map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));
    managerChoices.unshift({ name: "None", value: null });

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
        validate: (input) =>
          input.trim() !== "" || "First name cannot be empty",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
        validate: (input) => input.trim() !== "" || "Last name cannot be empty",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ]);

    await db.query(queries.addEmployee, [
      firstName,
      lastName,
      roleId,
      managerId,
    ]);
    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

async function updateEmployeeRole() {
  try {
    const employees = await db.query(queries.getAllEmployees);
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const roles = await db.query(queries.getAllRoles);
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select the employee to update:",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee's new role:",
        choices: roleChoices,
      },
    ]);

    await db.query(queries.updateEmployeeRole, [roleId, employeeId]);
    console.log("Employee role updated successfully!");
  } catch (error) {
    console.error("Error updating employee role:", error);
  }
}

async function updateEmployeeManager() {
  try {
    const employees = await db.query(queries.getAllEmployees);
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const { employeeId, managerId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select the employee to update:",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee's new manager:",
        choices: [{ name: "None", value: null }, ...employeeChoices],
      },
    ]);

    await db.query(queries.updateEmployeeManager, [managerId, employeeId]);
    console.log("Employee manager updated successfully!");
  } catch (error) {
    console.error("Error updating employee manager:", error);
  }
}

async function viewEmployeesByManager() {
  try {
    const managers = await db.query(queries.getAllManagers);
    const managerChoices = managers.map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));

    const { managerId } = await inquirer.prompt([
      {
        type: "list",
        name: "managerId",
        message: "Select a manager:",
        choices: managerChoices,
      },
    ]);

    const employees = await db.query(queries.viewEmployeesByManager, [
      managerId,
    ]);

    const table = new ConsoleTable({
      columns: [
        "ID",
        "First Name",
        "Last Name",
        "Job Title",
        "Department",
        "Salary",
      ],
    });

    employees.forEach((employee) => {
      table.addRow({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        "Job Title": employee.title,
        Department: employee.department_name,
        Salary: employee.salary,
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error("Error viewing employees by manager:", error);
  }
}

async function viewEmployeesByDepartment() {
  try {
    const departments = await db.query(queries.getAllDepartments);
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const { departmentId } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Select a department:",
        choices: departmentChoices,
      },
    ]);

    const employees = await db.query(queries.viewEmployeesByDepartment, [
      departmentId,
    ]);

    const table = new ConsoleTable({
      columns: [
        "ID",
        "First Name",
        "Last Name",
        "Job Title",
        "Salary",
        "Manager",
      ],
    });

    employees.forEach((employee) => {
      table.addRow({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        "Job Title": employee.title,
        Salary: employee.salary,
        Manager: employee.manager_name || "None",
      });
    });

    console.log(table.toString());
  } catch (error) {
    console.error("Error viewing employees by department:", error);
  }
}

async function deleteDepartment() {
  try {
    const departments = await db.query(queries.getAllDepartments);
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const { departmentId } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Select the department to delete:",
        choices: departmentChoices,
      },
    ]);

    await db.query(queries.deleteDepartment, [departmentId]);
    console.log("Department deleted successfully!");
  } catch (error) {
    console.error("Error deleting department:", error);
  }
}

async function deleteRole() {
  try {
    const roles = await db.query(queries.getAllRoles);
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const { roleId } = await inquirer.prompt([
      {
        type: "list",
        name: "roleId",
        message: "Select the role to delete:",
        choices: roleChoices,
      },
    ]);

    await db.query(queries.deleteRole, [roleId]);
    console.log("Role deleted successfully!");
  } catch (error) {
    console.error("Error deleting role:", error);
  }
}

async function deleteEmployee() {
  try {
    const employees = await db.query(queries.getAllEmployees);
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const { employeeId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select the employee to delete:",
        choices: employeeChoices,
      },
    ]);

    await db.query(queries.deleteEmployee, [employeeId]);
    console.log("Employee deleted successfully!");
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
}

async function viewDepartmentBudget() {
  try {
    const departments = await db.query(queries.getAllDepartments);
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const { departmentId } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Select a department to view its budget:",
        choices: departmentChoices,
      },
    ]);

    const [budget] = await db.query(queries.viewDepartmentBudget, [
      departmentId,
    ]);
    console.log(
      `The total budget for the selected department is: $${budget.total_budget}`
    );
  } catch (error) {
    console.error("Error viewing department budget:", error);
  }
}

async function start() {
  try {
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
        case "View all employees":
          await viewAllEmployees();
          break;
        case "Add a department":
          await addDepartment();
          break;
        case "Add a role":
          await addRole();
          break;
        case "Add an employee":
          await addEmployee();
          break;
        case "Update an employee role":
          await updateEmployeeRole();
          break;
        case "Update an employee manager":
          await updateEmployeeManager();
          break;
        case "View employees by manager":
          await viewEmployeesByManager();
          break;
        case "View employees by department":
          await viewEmployeesByDepartment();
          break;
        case "Delete department":
          await deleteDepartment();
          break;
        case "Delete role":
          await deleteRole();
          break;
        case "Delete employee":
          await deleteEmployee();
          break;
        case "View department budget":
          await viewDepartmentBudget();
          break;
        case "Exit":
          console.log("Exiting application...");
          await db.end();
          process.exit(0);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await db.end();
    process.exit(1);
  }
}

async function start() {
  try {
    await db.connect();

    const choices = [
      // ... your choices ...
    ];

    while (true) {
      const { choice } = await inquirer.prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices,
      });

      switch (choice) {
        // ... your switch cases ...
        case "Exit":
          console.log("Exiting application...");
          await db.end();
          process.exit(0);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await db.end();
    process.exit(1);
  }
}

start();
