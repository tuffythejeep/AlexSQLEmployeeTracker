INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 80000, 1),
  ('Salesperson', 50000, 1),
  ('Software Engineer', 120000, 2),
  ('Accountant', 75000, 3),
  ('HR Representative', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, NULL),
  ('Emily', 'Brown', 4, NULL),
  ('David', 'Lee', 2, 1);
