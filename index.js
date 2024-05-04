const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { default: Prompt } = require("inquirer/lib/prompts/base");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Tracker" }).render();

  console.table(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      // TODO- Create first question user will see- "What would you like to do?"
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees By Department",
        "View all departments",
        "View all roles",
        "Add employee",
        "Add department",
        "Add role",
        "Update employee role",
        "Exit",
      ],
    },
  ]).then((res) => {
    // TODO- Create a variable to store the user's choice
    let userChoice = res.choice;
    // TODO- Create a switch statement to call the appropriate function depending on what the user chose
    console.log(userChoice);
    switch (userChoice) {
      case "View All Employees":
        viewEmployees();
        break;
      case "View Employees By Department":
        viewEmployeesByDepartment();
        break;
      case "View Employees By Manager":
        viewEmployeesByManager();
        break;

      default:
        quit();
    }
  });
}

// TODO- Create a function to View all employees
function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}

// BONUS- Create a function to View all employees that belong to a department
function viewEmployeesByDepartment(departmentId) {
  db.findAllEmployeesInDepartment(departmentId)
    .then(({ rows }) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}
// BONUS- Create a function to View all employees that report to a specific manager
function viewEmployeesByManager(managerId) {
  db.findAllEmployeesByManager(managerId)
    .then(({ rows }) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}
// BONUS- Create a function to Delete an employee

// TODO- Create a function to Update an employee's role

// BONUS- Create a function to Update an employee's manager

// TODO- Create a function to View all roles

// TODO- Create a function to Add a role

// BONUS- Create a function to Delete a role

// TODO- Create a function to View all deparments

// TODO- Create a function to Add a department

// BONUS- Create a function to Delete a department

// BONUS- Create a function to View all departments and show their total utilized department budget

// TODO- Create a function to Add an employee

// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
