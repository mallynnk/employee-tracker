const fs = require("fs")
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const { query } = require("express");

//create connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
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
    SELECT employee.id AS ID, employee.first_name AS FirstName, 
        employee.last_name AS LastName, 
        employee_role.title AS Role, 
        employee_role.salary AS Salary, 
        department.department_name AS Department,
        manager.last_name AS Manager
    FROM employee
    INNER JOIN department 
    ON department.id = employee.role_id 
    LEFT JOIN employee_role 
    ON employee_role.id = employee.role_id
    INNER JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY employee.id ASC`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start();

    })
};

//function to view all departments -- done
function allDeps() {

    connection.query(
        `SELECT id AS ID, department_name AS "Department Name" FROM department ORDER BY department.id ASC`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};

//function to view all roles -- done
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
        ORDER BY employee_role.id ASC
        `, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};


//function to add employee -- fix manager portion
function addEmployee() {

 let employeeQuery = "SELECT * FROM employee";
 let roleQuery = "SELECT * from employee_role";

 connection.query(employeeQuery, function (err, employees) {
    connection.query(roleQuery, function (err, roles) {
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
                let choiceArray = [];
                for (var i=0; i < roles.length; i++) {
                    choiceArray.push(roles[i].title)
                }
                return choiceArray;
            }

        },
        {
            type: "rawlist",
            name: "manager",
            message: "who is they employee's manager?",
            choices: function() {
                let choiceArray = [];
                for (var i=0; i < employees.length; i++) {
                    choiceArray.push(employees[i].last_name)
                }
                return choiceArray;
            }
        },
    ]) .then(function(response) {
        
        for (var i=0; i < roles.length; i++) {
            if(roles[i].title === response.choice) {
                response.role_id = roles[i].id;
            }
        }
        for (var i=0; i < employees.length; i++) {
            if(employees[i].last_name === response.choice) {
                response.manager_id = employees[i].id;
            }
        }
        var query = "INSERT INTO employee SET ?"

        const values = {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: response.role_id,
            manager_id: response.manager
        }
        connection.query(query, values, function(err) {
            if(err) throw err;
            console.log("Employee added!");
            start();
        })

        });
    })
});
}


//add department -- done
function addDep() {
    inquirer.prompt([ 
        {
            name: "newDep",
            type: "input",
            message: ["what is the name of your new department?"]
        },
    ]).then(function (response){
        var query = "INSERT INTO department SET ?"
        var addDep = connection.query(query, [{department_name: response.newDep}], function(err) {
            if(err) throw err;
            console.table("department created!");
            start()
        })
    })
};

//add role -- done
function addRole() {
    let roleQuery = "SELECT * FROM employee_role;";
    let departmentQuery = "SELECT * FROM department;";

    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, department) {

            if (err) throw err;

            inquirer.prompt([ 
                
                {
                        name: "newRole",
                        type: "input",
                        message: ["what role would you like to add?"]
            
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
            ]).then(function (response) {
                for (var i= 0; i < department.length; i++) {
                    if (department[i].department_name === response.choice) {
                        response.department_id = department[i].id;
                    }
                }
                var query = "INSERT INTO employee_role SET ?"
                const values = {
                    title: response.newRole,
                    salary: response.newSalary,
                    department_id: response.department_id
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


// Update Employee Role
function updateRole() {


    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee_role.id AS "role_id" 
    FROM employee, employee_role, department
    WHERE department.id = employee_role.department_id AND employee_role.id = employee.role_id`;

    connection.query(sql, (error, response) => {
        if(error) throw error;
        let employeeArray = [];
        response.forEach((employee) => {employeeArray.push(`${employee.first_name} ${employee.last_name}`);});

    let sql = `SELECT employee_role.id, employee_role.title FROM employee_role`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let rolesArray = [];
        response.forEach((employee_role) => {rolesArray.push(employee_role.title);});

        inquirer.prompt([ 
            {
                name: "chosenEmployee", 
                type: "list",
                message: "which employee has a new role?",
                choices: employeeArray
            },
            {
                name: "chosenRole", 
                type: "list",
                message: `what is ${response.last_name}'s role?`,
                choices: rolesArray
            },
        ]).then(function (response){
            let newTitleId, employeeId;

            response.forEach((employee_role) => {
                newTitleId = employee_role.id;
            });
            response.forEach((employee) => { 
                if (response.chosenEmployee === `${employee.first_name} ${employee.last_name}`) 
                { employeeId = employee.id; }
            });

            let sqls = `UPDATE employee SET employee.role_id = ? 
            WHERE employee.id = ?`;
            connection.query ( sqls, [newTitleId, employeeId], (error) => {
                if (error) throw err;
                console.log("Employee Role Updated");
                start()
            })
            })
        })

    })

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
                        let arrayOfChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            arrayOfChoices.push(employees[i].last_name);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "which employee would you like to rmemove?",

            }
    ]).then (function(response) {
        connection.query("DELETE FROM employee WHERE ?", 
    {
        last_name: response.removeEmployee
    },
    function(error) { 
        //fix console
        console.log(`${response.last_name} + "has been deleted from your employees"`);
        start();
    }
    );
})
})
}

//function to delete dept -- done
function removeDept() {
var depQuery = "SELECT * FROM department;";

    connection.query(depQuery, function (err, departments) {
            if (err) throw err;

            inquirer.prompt([ 
                
                {
                    name: "removeDep",
                    type: "rawlist",
                    choices: function() {
                        let arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].department_name);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "which department would you like to rmemove?",

            }
    ]).then (function(response) {
        connection.query("DELETE FROM department WHERE ?", 
    {
        department_name: response.removeDep
    },
    function(error) { 
        //fix console
        console.log(response.department_name + "has been deleted from available departments");
        start();
    }
    );
})
})
}


// function to delete role -- done
function removeRole() {
    var roleQuery = "SELECT * FROM employee_role;";
    
        connection.query(roleQuery, function (err, roles) {
                if (err) throw err;
    
                inquirer.prompt([ 
                    
                    {
                        name: "removeRole",
                        type: "rawlist",
                        choices: function() {
                            let arrayOfChoices = [];
                            for (var i = 0; i < roles.length; i++) {
                                arrayOfChoices.push(roles[i].title);
                            }
                            
                            return arrayOfChoices;
                    },
                        message: "which role would you like to rmemove?",
    
                }
        ]).then (function(response) {
            connection.query("DELETE FROM role WHERE ?", 
        {
            title: response.removeRole
        },
        function(error) { 
            //this is broken
            console.log(response + "has been deleted from available roles");
            start();
        })
    })
    })
}
}
//function to view employees by dep
// function employeesByDep() {
//         var departmentQuery = "SELECT * FROM department;";
//         var employeeQuery = "SELECT last_name AS 'Last Name', first_name AS 'First Name' FROM employee WHERE department_id = ?"
    
//         connection.query(departmentQuery, function (err, department) {
    
//                 if (err) throw err;
    
//                 inquirer.prompt([ 
                    
//                     {
//                         name: "depChoice",
//                         type: "rawlist",
//                         choices: function() {
//                             var arrayOfChoices = [];
//                             for (var i = 0; i < department.length; i++) {
//                                 arrayOfChoices.push(department[i].department_name);
//                             }
                            
//                             return arrayOfChoices;
//                     },
//                         message: "which department would you like to view employees from?",
//                     },
//                 ]).then(function (answer) {
//                     connection.query(employeeQuery, function (err, employee) {

//                     })
//                     for (var i= 0; i < department.length; i++) {
//                         if (department[i].department_name === answer.choice) {
//                             answer.department_id = department[i].id;
//                         }
//                     }
//                     var query = "INSERT INTO employee_role SET ?"
//                     const values = {
//                         title: answer.newRole,
//                         salary: answer.newSalary,
//                         department_id: answer.department_id
//                     }
//                     connection.query(query, values, function(err) {
//                         if(err) throw err;
//                         console.table("role created!");
//                         start();
//                     })
//                 })
//             })
//         })
//     };

//function to view employees by manager

//function to update employee manager


