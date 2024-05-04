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
      FROM employee,
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
    const sql = `UPDATE employee SET managerId = $1 WHERE employee_id =$2`;
    return this.query(sql, [managerId, employeeId]);
  }
  // TODO- Create a query to Find all roles, join with departments to display the department name

  // TODO- Create a query to Create a new role

  // BONUS- Create a query to Remove a role from the db

  // TODO- Create a query to Find all departments

  // BONUS- Create a query to Find all departments, join with employees and roles and sum up utilized department budget

  // TODO- Create a query to Create a new department

  // BONUS- Create a query to Remove a department

  // BONUS- Create a query to Find all employees in a given department, join with roles to display role titles

  // BONUS- Create a query to Find all employees by manager, join with departments and roles to display titles and department names
}

module.exports = new DB();
