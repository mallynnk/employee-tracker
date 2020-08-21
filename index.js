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
        choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role',  'Update Employee Role', 'Remove Employee', 'Remove Department', 'Remove Role', 'View All Employees by Department', 'View all Employees by Manager', 'Update Employee Manager']
    },
])
.then(function(response) {
    switch(response.options) {
        case "View All Employees":
            viewEmployees()
            break;
        case "View All Departments":
            allDeps()
            break;
        case "View All Roles":
            allRoles()
            break;
        case "Add Employee":
            addEmployee()
            break;
        case "Add Department":
            addDep()
            break;
        case "Add Role":
            addRole()
            break;
        case "Update Employee Role":
            updateRole()
            break;
        case "Remove Employee":
            removeEmployee()
            break;
        case "Remove Department":
            removeDept()
            break;
        case "Remove Role":
            removeRole()
            break;
        case "View All Employees by Department":
            employeesByDep()
            break;
        case "View All Employees by Manager":
            employeesByMan()
            break;
        case "Update Employee Manager":
            updateManager()
            break;
    }
});
};

//function to view all employees -- ADD MANAGER
function viewEmployees() {
    connection.query(`
    SELECT first_name AS FirstName, 
        last_name AS LastName, 
        employee_role.title AS Role, 
        employee_role.salary AS Salary, 
        department.department_name AS Department 
    FROM employee 
    INNER JOIN department 
    ON department.id = employee.role_id 
    LEFT JOIN employee_role 
    ON employee_role.id = employee.role_id`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start();

    })
};

//function to view all departments -- working
function allDeps() {
    connection.query(
        `SELECT id AS ID, department_name AS "Department Name" FROM department`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};

//function to view all roles -- working
function allRoles() {
    connection.query(
        `SELECT employee_role.id AS ID, 
            title AS "Employee Role", 
            employee_role.salary as Salary, 
            department_id AS "Dept #", 
            department_name AS "Department" 
        FROM employee_role
        INNER JOIN department
        ON department.id = department_id
        `, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};


//function to add employee -- working
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


//add department -- working
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

//add role -- working, but prob want to add salary, department too 
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

//function to delete employee -- working but want to show more employee info
function removeEmployee() {
    var employeeQuery = "SELECT * FROM employee;";

    connection.query(employeeQuery, function (err, employees) {
            if (err) throw err;

            inquirer.prompt([ 
                
                {
                    name: "removeEmployee",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            arrayOfChoices.push(employees[i].last_name);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "which employee would you like to rmemove?",

            }
    ]).then (function(answer) {
        connection.query("DELETE FROM employee WHERE ?", 
    {
        last_name: answer.removeEmployee
    },
    function(error) { 
        //fix console
        console.log(answer.last_name + "has been deleted from your employees");
        start();
    }
    );
})
})
}


//function to delete dept -- working :) 
function removeDept() {
var depQuery = "SELECT * FROM department;";

    connection.query(depQuery, function (err, departments) {
            if (err) throw err;

            inquirer.prompt([ 
                
                {
                    name: "removeDep",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].department_name);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "which department would you like to rmemove?",

            }
    ]).then (function(answer) {
        connection.query("DELETE FROM department WHERE ?", 
    {
        department_name: answer.removeDep
    },
    function(error) { 
        //fix console
        console.log(answer.department_name + "has been deleted from available departments");
        start();
    }
    );
})
})
}


// function to delete role
function removeRole() {
    var roleQuery = "SELECT * FROM employee_role;";
    
        connection.query(roleQuery, function (err, roles) {
                if (err) throw err;
    
                inquirer.prompt([ 
                    
                    {
                        name: "removeRole",
                        type: "rawlist",
                        choices: function() {
                            var arrayOfChoices = [];
                            for (var i = 0; i < roles.length; i++) {
                                arrayOfChoices.push(roles[i].title);
                            }
                            
                            return arrayOfChoices;
                    },
                        message: "which role would you like to rmemove?",
    
                }
        ]).then (function(answer) {
            connection.query("DELETE FROM role WHERE ?", 
        {
            title: answer.removeRole
        },
        function(error) { 
            //this is broken
            console.log(answer + "has been deleted from available roles");
            start();
        }
        );
    })
    })
    }

//function to view employees by dep

//function to view employees by manager

// function to update employee manager

//function to view employees by manager
