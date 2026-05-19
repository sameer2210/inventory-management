CREATE DATABASE IF NOT EXISTS products;
USE products;

CREATE TABLE IF NOT EXISTS item_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  stock_available BOOLEAN NOT NULL DEFAULT FALSE,
  item_type_id INT NOT NULL,
  FOREIGN KEY (item_type_id) REFERENCES item_types(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO item_types (type_name)
VALUES ('Electronics'), ('Furniture'), ('Clothing'), ('Kitchen'), ('Stationery')
ON DUPLICATE KEY UPDATE type_name = VALUES(type_name);