DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;


CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
);

CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  department_id INTEGER UNSIGNED NOT NULL,
  role_title VARCHAR(30) NOT NULL,
  role_salary //decimal 
  CONSTRAINT uc_department UNIQUE (department_id),
  CONSTRAINT fk_department UNIQUE (department_id) REFERENCES department(id) ON DELETE CASCADE,
    //ADD FOREIGN KEY HERE TO CONNECT TO DEPARTMENT
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INTEGER UNSIGNED, 
  role_id INTEGER UNSIGNED NOT NULL, 
);