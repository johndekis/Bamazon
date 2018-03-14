DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    id int NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(11,2),
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY(id) 
);

SELECT * FROM products;

-- filler seeds
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
    ('Keyblade', 'Weapons', 100000.00, 100),
    ('Dragonball', 'Magical', 100000000.00, 14),
    ('Phoenix Down', 'Magical', 1000.00, 500),
    ('Master Sword', 'Weapons', 150000.00, 300),
    ('One Ring', 'Magical', 999999999.00, 1),
    ('Lightsaber', 'Weapon', 500000.00, 500),
    ('Sword of Omens', 'Weapon', 95000.00, 500),
    ('Master Ball', 'Magical', 9995.00, 2000),
    ('Megazord', 'Weapon', 100000000.00, 10000),
    ('Modafinil','Magical', 500000.00, 50000);