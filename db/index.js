const pool = require("./connection");

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  // TODO- Create a query to Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    const sql = `SELECT employee.*, 
    department.name AS department_name,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name 
    FROM employee
    JOIN role ON employee.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;
    return this.query(sql);
  }

  // TODO- Create a query to Find all employees except the given employee id
  findAllEmployeesExcept(id) {
    const sql = `SELECT * FROM employee WHERE employee_id != $1`;
    return this.query(sql, [id]);
  }
  // TODO- Create a query to Create a new employee
  createEmployee(employeeData) {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    return this.query(sql, [
      employeeData.first_name,
      employeeData.last_name,
      employeeData.role_id,
      employeeData.manager_id,
    ]);
  }
  // BONUS- Create a query to Remove an employee with the given id
  removeEmployeeById(id) {
    const sql = `DELETE FROM employee WHERE employee_id = $1`;
    return this.query(sql, [id]);
  }
  // TODO- Create a query to Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    const sql = `UPDATE employee SET role_id = $1 WHERE employee_id = $2`;
    return this.query(sql, [roleId, employeeId]);
  }
  // BONUS- Create a query to Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    const sql = `UPDATE employee SET manager_id = $1 WHERE employee_id =$2`;
    return this.query(sql, [managerId, employeeId]);
  }
  // TODO- Create a query to Find all roles, join with departments to display the department name
  findAllRoles() {
    const sql = `SELECT role.*,
   department.name as department_name
   FROM role
   JOIN department ON role.department_id as department.id`;
    return this.query(sql);
  }
  // TODO- Create a query to Create a new role
  createRole(roleData) {
    const sql = `INSERT INTO role(title, salary, department_id)
  VALUES($1,$2,$3)`;
    return this.query(sql, [
      roleData.title,
      roleData.salary,
      roleData.department_id,
    ]);
  }
  // BONUS- Create a query to Remove a role from the db
  removeRoleById(id) {
    const sql = `DELETE FROM role WHERE role_id = $1`;
    return this.query(sql, [id]);
  }
  // TODO- Create a query to Find all departments
  findAllDepartments() {
    const sql = `Select * FROM department`;
    return this.query(sql);
  }
  // BONUS- Create a query to Find all departments, join with employees and roles and sum up utilized department budget
  // BONUS
  findAllDepartmentsWithBudget() {
    const sql = `SELECT department.*,
   SUM(role.salary)
   AS utilized_budget
   FROM department 
   JOIN role ON department.id = role.department_id 
   JOIN employee ON role.role_id = employee.role_id 
   GROUP BY department.id`;
    return this.query(sql);
  }

  // TODO- Create a query to Create a new department
  createDepartment(departmentData) {
    const sql = `INSERT INTO department(name) VALUES($1)`;
    return this.query(sql, [departmentData.name]);
  }
  // BONUS- Create a query to Remove a department
  removeDepartmentById(id) {
    const sql = `DELETE FROM department WHERE department_id = $1`;
    return this.query(sql, [id]);
  }
  // BONUS- Create a query to Find all employees in a given department, join with roles to display role titles
  // BONUS
  findAllEmployeesInDepartment(departmentId) {
    const sql = `SELECT employee.*,
    role.title AS role_title 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    WHERE role.department_id = $1`;
    return this.query(sql, [departmentId]);
  }

  // BONUS- Create a query to Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    const sql = `SELECT employee.*, 
    role.title AS role_title,
    department.name AS department_name
    FROM employee 
    JOIN role ON employee.role_id = role_id
    JOIN department ON role.department_id = department.department_id
    WHERE employee.manager_id = $1`;
    return this.query(sql, [managerId]);
  }
}

module.exports = new DB();
