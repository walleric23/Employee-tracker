INSERT INTO department (name)
VALUES ("Grocery"), ("Front End"), ("Shipping"), ("Stocking");

INSERT INTO role (title, salary, department_id)
VALUES ("Supervisor", 50000, 1), ("Cashier", 45000, 2), ("Assistant", 40000, 3), ("Cart Pusher", 35000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Eric", "Wall", 1, null), ("Jake", "Burger", 2, 1), ("Maddie", "Holden", 3, 1), ("Angela", "Parker", 4, 1);



       