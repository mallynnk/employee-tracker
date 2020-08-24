# Employee Tracker

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Description

An employee tracking application that uses the inquirer dependency in node.js, mysql2, and console table. When the user starts the application, they are presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role, remove an employee, remove a department, remove a role, view all employees by department or by manager, update an employee's manager and/or view the total utilized budget for each department. When the user chooses to view all employees, they are presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to. If the user chooses to view all departments, they are presented with a formatted table showing department names and department ids. When the user chooses to view all roles, they are presented with the job title, role id, the department that role belongs to, and the salary for that role. When the user chooses to add an employee, they are prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database. When the user chooses to add a department, they are prompted to enter the name of the department and that department is added to the database. When the user chooses to add a role, they are prompted to enter the name, salary, and department for the role and that role is added to the database.  When the user chooses to update an employee role, they are prompted to select an employee to update and their new role and this information is updated in the database. If the user chooses to remove an employee, department, or role, they are prompted to select the employee, department or role from a list of all options. Their selection is then removed from the database. If the user chooses to view employees by department, they are prompted to select a department. When the user chooses a department, they are presented with all employees from that department. If the user chooses to view employees by manager, they are prompted to select a manager. When the user chooses a manager, they are presented with all employees that manager manages.  If the user chooses to update an employee's manager, they are prompted to select an employee whose manager they want to change. When the user chooses an employee, they are prompted to select the employee's new manager. The employee's manager is updated in the database. If the user chooses to view the utilized budget of each department, they are prompted to select a department. They are then presented with the total utilized budget of that department.
  

## Built With
* node.js
* inquirer
* mysql2 

## Installation

In order to use this program, the inquirer, console table, and mysql2 dependencies must be installed. 

## Walkthrough Video
https://drive.google.com/file/d/1Llt9LVLoX5ApCDHZGfiVDHhXzJCOLpMz/view


## License
This project is covered by ISC.

## Contribution
Mallory Korpics (https://github.com/mallynnk)

