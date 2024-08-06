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
      // ... other cases will be added here
      case "Exit":
        console.log("Exiting application...");
        process.exit();
    }
  }
}

start();
