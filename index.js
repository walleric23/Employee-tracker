const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

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
      if (res.action === "view departments") {
        viewDepartments();
      } else if (res.action === "view roles") {
        viewRoles();
      } else if (res.action === "view employees") {
        viewEmployees();
      } else if (res.action === "add department") {
        addDepartment();
      } else if (res.action === "add role") {
        addRole();
      } else if (res.action === "add employee") {
        addEmployee();
      } else if (res.action === "update employee role") {
      } else {
      }
    });
}

function viewDepartments() {
  db.query("select * FROM department", (err, data) => {
    console.table(data);
    menu();
  });
}

function viewRoles() {
  db.query("select * FROM role", (err, data) => {
    console.table(data);
    menu();
  });
}

function viewEmployees() {
  db.query("select * FROM employee", (err, data) => {
    console.table(data);
    menu();
  });
}

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
          console.table(data);
          menu();
        }
      );
    });
}

function addRole() {
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

function addEmployee() {
  db.query("SELECT * FROM ROLE", (err, data) => {
    if (err) throw err;
    const employee = data.map(({ department_id, title }) => ({
      name: title,
      value: department_id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the first name?",
          name: "firstName",
        },
        {
          type: "number",
          message: "what is the last name",
          name: "lastName",
        },
      ])
      .then((res) => {
        db.query(
          "insert into role (title, salary, department_id) values(?, ?, ?)",
          [res.first_name, res.last_name, res.department_id],
          (err, data) => {
            console.table(data);
            menu();
          }
        );
      });
  });
}
menu();
