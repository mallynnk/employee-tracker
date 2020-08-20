INSERT INTO department (department_name)
VALUES
  ('Human Resources'),
  ('Sales'),
  ('Engineering'),
  ('Research and Development'),
  ('Finance'),
  ('Operations');
  

INSERT INTO employee_role (title, salary, department_id)
VALUES
 ('Data Analyst', 80000, 4),
 ('FrontEnd Developer', 50000, 3),
 ('Manager', 90000, 4),
 ('Sales Representative', 65000, 2),
 ('Software Engineer', 70000, 3),
 ('HR Manager', 70000, 1),
 ('Operations Manager', 80000, 6),
 ('Accountant', 85000, 5);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Mallory', 'Korpics', 3, null),
  ('Melanie', 'Gilman', 2, 1),
  ('Grant', 'Emerson', 5, 1),
  ('Katherine', 'Mansfield', 6, 3),
  ('Dora', 'Carrington', 7, 3),
  ('Edward', 'Bellamy', 8, 6),
  ('Montague', 'Summers', 1, 6),
  ('Octavia', 'Butler', 4, 2),
  ('Unica', 'Zurn', 6, 1);