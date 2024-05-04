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
        "View All departments",
        "View All roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
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
  db.findAllEmployeesInDepartment(departmentId).then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see employees for",
        choices: departmentChoices,
      },
    ])
      .then((res) => db.findAllEmployeesInDepartment(res.departmentId))
      .then(({ rows }) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  });
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
// TODO- Create a function to Add an employee
function addEmployee(employeeData) {
  db.createEmployee(employeeData)
    .then(() => {
      console.log("Employee Added Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Adding Employee", err);
      loadMainPrompts();
    });
}
// BONUS- Create a function to Delete an employee
function removeEmployee(id) {
  db.removeEmployeeById(id)
    .then(() => {
      console.log("Employee Removed Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Removing Employee", err);
      loadMainPrompts();
    });
}
// TODO- Create a function to Update an employee's role
function updateEmployeeRole(employeeId, roleId) {
  db.updateEmployeeRole(employeeId, roleId)
    .then(() => {
      console.log("Employee Role Updated.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Updating Employee Role", err);
      loadMainPrompts();
    });
}
// BONUS- Create a function to Update an employee's manager
function updateEmployeeManager(employeeId, managerId) {
  db.updateEmployeeManager(employeeId, managerId)
    .then(() => {
      console.log("Employee Manager Updated.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Updating Employee Manager", err);
      loadMainPrompts();
    });
}
// TODO- Create a function to View all roles
function viewAllRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}
// TODO- Create a function to Add a role
function addRole(roleData) {
  db.createRole(roleData)
    .then(() => {
      console.log("Role Added Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Updating Role", err);
      loadMainPrompts();
    });
}
// BONUS- Create a function to Delete a role
function removeRole(id) {
  db.removeRoleById(id)
    .then(() => {
      console.log("Role Removed Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Removing Role", err);
      loadMainPrompts();
    });
}
// TODO- Create a function to View all deparments
function viewAllDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
// TODO- Create a function to Add a department
function addDepartment(departmentData) {
  db.createDepartment(departmentData)
    .then(() => {
      console.log("Department Added Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Updating Department", err);
      loadMainPrompts();
    });
}
// BONUS- Create a function to Delete a department
function removeDepartment(id) {
  db.removeDepartmentById(id)
    .then(() => {
      console.log("Department Removed Successfully.");
      loadMainPrompts();
    })
    .catch((err) => {
      console.error("Error Removing Department", err);
      loadMainPrompts();
    });
}
// BONUS- Create a function to View all departments and show their total utilized department budget
function viewutilizedDepartmentBudget() {
  db.findAllDepartmentsWithBudget()
    .then(({ rows }) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
