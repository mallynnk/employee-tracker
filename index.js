const fs = require("fs")
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'Bubba1249!',
  database: 'employeeDb'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connection is successful');
    start();
  });

function start() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View all employees', 'View all employees by department', 'View all departments', 'View all roles', 'View all employees by manager', 'add employee', 'remove employee', 'add department', 'add role',  'update employee role', 'update employee manager']
    },
])
.then(function(response) {
    switch(response.options) {
        case "View all employees":
            viewEmployees()
            break;
        case "View all employees by department":
            employeesByDep()
            break;
        case "View all departments":
            allDeps()
            break;
        case "View all roles":
            allRoles()
            break;
        case "add employee":
            addEmployee()
            break;
        case "remove employee":
            removeEmployee()
            break;
        case "add department":
            addDep()
            break;
        case "add role":
            addRole()
            break;
        case "update employee role":
            updateRole()
            break;
        case "update employee manager":
            updateManager()
            break;
    }
});
};

//function to view all employees
function viewEmployees() {
    connection.query(`
    SELECT first_name AS FirstName, last_name AS LastName, employee_role.title AS Role, employee_role.salary AS Salary, department.department_name AS Department 
    FROM employee 
    INNER JOIN department 
    ON department.id = employee.role_id 
    LEFT JOIN employee_role on employee_role.id = employee.role_id`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start();

    })
};


//function to view all departments
function allDeps() {
    connection.query(
        `SELECT department_name AS Departments FROM department`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};


//function to view all roles
function allRoles() {
    connection.query(
        `SELECT title AS Roles FROM employee_role`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};



function addEmployee() {
    connection.query("SELECT * FROM employee_role", function (err, results) {
        if(err) throw err;
    inquirer.prompt([ 
        {
            type: "input",
            name: "firstName",
            message: "enter the employee's first name"
        },
        {
            type: "input",
            name: "lastName",
            message: "enter the employee's last name"
        },
        {
            name: "choice",
            type: "rawlist",
            message: "what is the employee's role?",
            choices: function() {
                var choiceArray = [];
                for (var i=0; i < results.length; i++) {
                    choiceArray.push(results[i].title)
                }
                return choiceArray;
            }

        },
        {
            type: "input",
            name: "manager",
            message: "who is they employee's manager?",
        },
    ]) 
    .then(function(answer) {
        
        for (var i=0; i < results.length; i++) {
            if(results[i].title === answer.choice) {
                answer.role_id = results[i].id;
            }
        }
        var query = "INSERT INTO employee SET ?"

        const values = {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role_id,
            // manager_id: employee(id)
        }
        connection.query(query, values, function(err) {
            if(err) throw err;
            console.log("Employee added!");
            start();
        })

        });
    })
};


//add department
function addDep() {
    inquirer.prompt([ 
        {
            name: "newDep",
            type: "input",
            message: ["what department would you like to add?"]
        },
    ]).then(function (answer){
        var query = "INSERT INTO department SET ?"
        var addDep = connection.query(query, [{department_name: answer.newDep}], function(err) {
            if(err) throw err;
            console.table("department created!");
            start()
        })
    })
};

//add department
function addRole() {
    inquirer.prompt([ 
        {
            name: "newRole",
            type: "input",
            message: ["what role would you like to add?"]
        },
    ]).then(function (answer){
        var query = "INSERT INTO employee_role SET ?"
        var addRole = connection.query(query, [{title: answer.newRole}], function(err) {
            if(err) throw err;
            console.table("role created!");
            start()
        })
    })
};

//update role - but how do i add employee name? 
function updateRole() {
    var roleQuery = "SELECT * FROM employee_role;";
    var departmentQuery = "SELECT * FROM department;";

    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, department) {

            if (err) throw err;

            inquirer.prompt([ 
                
                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "which role would you like to add?",
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the salary you would like to add?"
                },
                { 
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i= 0; i < department.length; i++) {
                            arrayOfChoices.push(department[i].department_name);
                        }

                        return arrayOfChoices;
                    },
                    message: "which department does this role belong to?"
                },
            ]).then(function (answer) {
                for (var i= 0; i < department.length; i++) {
                    if (department[i].department_name === answer.choice) {
                        answer.department_id = department[i].id;
                    }
                }
                var query = "INSERT INTO employee_role SET ?"
                const values = {
                    title: answer.newRole,
                    salary: answer.newSalary,
                    department_id: answer.department_id
                }
                connection.query(query, values, function(err) {
                    if(err) throw err;
                    console.table("role created!");
                    start();
                })
            })
        })
    })
};


























//BONUS FUNCTIONS 

//function to view employees by manager
function employeesByManager() {
    connection.query(
        `SELECT employee.manager_id, employee.last_name
        AS manager_id
        FROM employee 
        LEFT JOIN employee 
        ON employee.last_name = employee.manager_id `, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start();
    })
};
//i have no idea how to do this
// function updateManager() 
    // connection.query("SELECT * FROM employee", function(err, data) { 
    


//function to view employees by department
function employeesByDep() {
    connection.query(
        `SELECT department_name AS Departments 
        FROM department
        LEFT JOIN employee
        ON `, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })

};

//function to delete employee
function removeEmployee() {
    inquirer.prompt([ 
        {
            type: "input",
            name: "employee_id",
            message: "enter the employee's id"
        },
    ]).then (function(answer) {
        connection.query("DELETE FROM employee WHERE ?", 
    {
        id: answer.employee_id
    },
    function(error) { 
        console.log(answer.employee_id + "has been deleted from your employees");
        start();
    }
    );
})
};

//function to update employee managers

//function to delete dep

//function to delete role
// View the total utilized budget of a department—i.e., the combined salaries of all employees in that department.

