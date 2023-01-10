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
        updateEmployee();
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
        "insert into department (name) values(?)",
        [res.name],
        (err, data) => {
          console.log(err);
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
  db.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    const roles = data.map(({ department_id, title }) => ({
      name: title,
      value: department_id,
    }));
    db.query("SELECT * FROM employee", (err, data) => {
      console.log(data);
      const employees = data.map(({ first_name, last_name, id }) => {
        return {
          name: first_name + " " + last_name,
          value: id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "what is the first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "what is the last name",
            name: "last_name",
          },
          {
            type: "list",
            message: "what is their managers ID?",
            name: "manager_id",
            choices: employees,
          },
          {
            type: "list",
            message: "what is the employee's role?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((res) => {
          db.query(
            "insert into employee (first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)",
            [res.first_name, res.last_name, res.role_id, res.manager_id],
            (err, data) => {
              console.log(err);
              console.table(data);
              menu();
            }
          );
        });
    });
  });
}

function updateEmployee() {
  db.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    const roles = data.map(({ department_id, title }) => ({
      name: title,
      value: department_id,
    }));
    db.query("SELECT * FROM employee", (err, data) => {
      console.log(data);
      const employees = data.map(({ first_name, last_name, id }) => {
        return {
          name: first_name + " " + last_name,
          value: id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "who is the employee?",
            name: "employee_id",
            choices: employees,
          },
          {
            type: "list",
            message: "what is the employee's new role",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((res) => {
          db.query(
            "update employee set role_id = ? where id = ?",
            [res.role_id, res.employee_id],
            (err, data) => {
              console.log(err);
              console.table(data);
              menu();
            }
          );
        });
    });
  });
}
menu();
