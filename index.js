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
        "View Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "View All roles",
        "Add Role",
        "View All departments",
        "Add Department",
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
      case "Add Employee":
        addEmployee();
        break;
      case "Remove Employee":
        removeEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "View All roles":
        viewAllRoles();
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
function viewEmployeesByDepartment() {
  db.findAllDepartments().then(({ rows }) => {
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
function viewEmployeesByManager() {
  db.findAllEmployees().then(({ rows }) => {
    let managers = rows;
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which employee do you want to see direct reports for?",
        choices: managerChoices,
      },
    ])
      .then((res) => db.findAllEmployeesByManager(res.managerId))
      .then(({ rows }) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  });
}
// TODO- Create a function to Add an employee
function addEmployee() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let managers = rows;
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      db.findAllRoles()
        .then(({ rows }) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          prompt([
            {
              name: "first_name",
              description: "Enter first name:",
              required: true,
            },
            {
              name: "last_name",
              description: "Enter last name:",
              required: true,
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices: roleChoices,
              required: true,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the employee's manager? (optional):",
              choices: managerChoices,
            },
          ])
            .then((employeeData) => {
              // Call createEmployee with the provided data
              db.createEmployee(employeeData)
                .then(() => {
                  console.log("Employee Added Successfully.");
                  loadMainPrompts();
                })
                .catch((err) => {
                  console.error("Error Adding Employee", err);
                  loadMainPrompts();
                });
            })
            .catch((err) => {
              console.error("Prompt error:", err);
              loadMainPrompts();
            });
        })
        .catch((err) => {
          console.error("Error retrieving roles:", err);
          loadMainPrompts();
        });
    })
    .catch((err) => {
      console.error("Error retrieving managers:", err);
      loadMainPrompts();
    });
}

// BONUS- Create a function to Delete an employee
function removeEmployee() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    console.log("\n");
    console.table(employees);

    prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the ID of the employee you want to remove:",
        required: true,
      },
    ]).then(({ id }) => {
      db.removeEmployeeById(id)
        .then(() => {
          console.log("Employee Removed Successfully.");
          loadMainPrompts();
        })
        .catch((err) => {
          console.error("Error Removing Employee", err);
          loadMainPrompts();
        });
    });
  });
}
// TODO- Create a function to Update an employee's role
function updateEmployeeRole() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      const employeeChoices = employees.map(
        ({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })
      );
      console.log("\n");
      console.table(employees);

      prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Which Employee's role do you want to update?",
          required: true,
          choices: employeeChoices,
        },
      ]).then(({ employee_id }) => {
        db.findAllRoles().then(({ rows }) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          prompt([
            {
              type: "list",
              name: "role_id",
              message: "Which Role Do You Want To Assign?",
              required: true,
              choices: roleChoices,
            },
          ]).then(({ role_id }) => {
            db.updateEmployeeRole(employee_id, role_id)
              .then(() => {
                console.log("Employee Role Updated.");
                loadMainPrompts();
              })
              .catch((err) => {
                console.error("Error Updating Employee Role", err);
                loadMainPrompts();
              });
          });
        });
      });
    })
    .catch((err) => {
      console.error("Error retrieving employees:", err);
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
function viewUtilizedDepartmentBudget() {
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
