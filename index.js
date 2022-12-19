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
      } else if (res.action === "add role") {
      } else if (res.action === "add employee") {
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
        "insert into department (name) values(?)",
        [res.name],
        (err, data) => {
          console.table(data);
          menu();
        }
      );
    });
}
menu();
