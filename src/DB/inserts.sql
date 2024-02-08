use storedb
-- Insert into Person
INSERT INTO Person (name, firstLastName, secondLastName, birthday, email, phoneNumber, address)
VALUES ('John', 'Doe', 'Smith', '1980-01-01', 'john.doe@example.com', '1234567890', '123 Main St');

INSERT INTO Person (name, firstLastName, secondLastName, birthday, email, phoneNumber, address)
VALUES ('David', 'Alvarado', 'Elizondo', '1997-10-21', 'davidaeg90@gmail.com', '84846089', 'Cartago');

-- Insert into User
INSERT INTO [User] (personId, username, password)
VALUES (1, 'johndoe', '12345');

-- Insert into Customer
INSERT INTO Customer (personId, category)
VALUES (1, 'Cat1');

-- Insert into Employee
INSERT INTO Employee (personId)
VALUES (1);

-- Insert into Order
INSERT INTO [Order] (employeeId, purchaseDate, status)
VALUES (1, GETDATE(), 'InPreparation');

-- Insert into Product
INSERT INTO Product (name, image, stock, price, priceWithIva, location)
VALUES ('Product 1', 'prod1.webp', 10, 9.99, 11.99, 'Shelf1'), 
('Product 2', 'prod2.webp', 10, 10.99, 12.99, 'Shelf2'), (
    'Product 3', 'prod3.webp', 10, 11.99, 13.99, 'Shelf3');

-- Insert into OrderDetail
INSERT INTO OrderDetail (orderId, productId)
VALUES (1, 1);

-- Insert into Color
INSERT INTO Color (color)
VALUES ('Red');

-- Insert into ProductColor
INSERT INTO ProductColor (productId, colorId)
VALUES (1, 1);

-- Update OrderDetail 07/02/2022
UPDATE OrderDetail set quantity = 1 where orderDetailId = 1;