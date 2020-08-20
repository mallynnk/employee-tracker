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
 ('Data Analyst', 80000, 1),
 ('FrontEnd Developer', 50000, 2),
 ('Manager', 90000, 3),
 ('Sales Representative', 65000, 4),
 ('Software Engineer', 70000, 5),
 ('HR Manager', 70000, 6),
 ('Operations Manager', 80000, 7),
 ('Accountant', 85000, 8);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Mallory', 'Korpics', 1, null),
  ('Melanie', 'Gilman', 2, null),
  ('Grant', 'Emerson', 5, null),
  ('Katherine', 'Mansfield', 6, 3),
  ('Dora', 'Carrington', 7, 3),
  ('Edward', 'Bellamy', 8, null)
  ('Montague', 'Summers', 4, null),
  ('Octavia', 'Butler', 5, null),
  ('Unica', 'Zurn', 8, null);