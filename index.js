// pulled in packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();
// mySQL connection
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password
    password: process.env.password,
    database: "db_work",
  },
  console.log(`Connected to the db_work database.`)
);
// inital prompt of questions
function menu() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do next?",
      name: "action",
      choices: [
        "view departments",
        "view roles",
        "view employees",
        "add department",
        "add role",
        "add employee",
        "update employee role",
      ],
    })
    .then((res) => {
      // if selected departments are displayed
      if (res.action === "view departments") {
        viewDepartments();
        // if selected roles are displayed
      } else if (res.action === "view roles") {
        viewRoles();
        // if selected employees are displayed
      } else if (res.action === "view employees") {
        viewEmployees();
        // if selected add department function runs and presents questions
      } else if (res.action === "add department") {
        addDepartment();
        // if selected add role function runs and presents questions
      } else if (res.action === "add role") {
        addRole();
        // if selected add employee function runs and presents questions
      } else if (res.action === "add employee") {
        addEmployee();
      } else if (res.action === "update employee role") {
      } else {
      }
    });
}
// function for viewing departments
function viewDepartments() {
  db.query("select * FROM department", (err, data) => {
    console.table(data);
    menu();
  });
}
// function for viewing roles
function viewRoles() {
  db.query("select * FROM role", (err, data) => {
    // shows data in a table in the console
    console.table(data);
    menu();
  });
}
// function for viewing employees
function viewEmployees() {
  db.query("select * FROM employee", (err, data) => {
    console.table(data);
    menu();
  });
}
// function for adding departments
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "what is the department name?",
      name: "name",
    })
    .then((res) => {
      db.query(
        "insert into department (department_name) values(?)",
        [res.department_name],
        (err, data) => {
          // shows data in console table
          console.table(data);
          menu();
        }
      );
    });
}
// function for adding role
function addRole() {
  // selects from department data
  db.query("SELECT * FROM DEPARTMENT", (err, data) => {
    if (err) throw err;
    const department = data.map(({ id, department_name }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the role title?",
          name: "role",
        },
        {
          type: "number",
          message: "what is the salary for the role",
          name: "salary",
        },
        {
          type: "list",
          message: "what is the department ID?",
          name: "department_id",
          choices: department,
        },
      ])
      .then((res) => {
        db.query(
          // joins into table with corresponding values
          "insert into role (title, salary, department_id) values(?, ?, ?)",
          [res.role, res.salary, res.department_id],
          (err, data) => {
            console.table(data);
            menu();
          }
        );
      });
  });
}
// function to add employees
function addEmployee() {
  db.query("SELECT * FROM ROLE", (err, data) => {
    if (err) throw err;
    const role = data.map(({ department_id, title }) => ({
      name: department_id,
      value: title,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "what is the last name",
          name: "lastName",
        },
        {
          type: "list",
          message: "what is their managers ID?",
          name: "manager_id",
          choices: manager_id,
        },
      ])
      .then((res) => {
        db.query(
          "insert into employee (first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)",
          [res.first_name, res.last_name, res.role_id, res.manager_id],
          (err, data) => {
            console.table(data);
            menu();
          }
        );
      });
  });
}
menu();
