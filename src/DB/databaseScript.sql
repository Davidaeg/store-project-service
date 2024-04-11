
create database storedb
use storedb

CREATE TABLE Person (
    personId INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50),
    firstLastName VARCHAR(50),
    secondLastName VARCHAR(50),
    birthday DATE,
    email VARCHAR(100) UNIQUE,
    phoneNumber VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE [User] (
    userId INT PRIMARY KEY IDENTITY(1,1),
    personId INT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    FOREIGN KEY (personId) REFERENCES Person(personID)
);

CREATE TABLE Customer (
    customerId INT PRIMARY KEY IDENTITY(1,1),
    personId INT,
    category VARCHAR(4),
    FOREIGN KEY (personId) REFERENCES Person(personID)
);

CREATE TABLE Employee (
    employeeId INT PRIMARY KEY IDENTITY(1,1),
    personId INT,
    FOREIGN KEY (personId) REFERENCES Person(personId)
);

CREATE TABLE [Order] (
    orderId INT PRIMARY KEY IDENTITY(1,1),
    customerId INT,
    purchaseDate DATETIME,
    status VARCHAR(13),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

CREATE TABLE Product (
    productId INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50),
    image VARCHAR(100),
    stock INT,
    price DECIMAL(10, 2),
    priceWithIva DECIMAL(10, 2),
    location VARCHAR(255)
);

CREATE TABLE OrderDetail (
    orderDetailId INT PRIMARY KEY IDENTITY(1,1),
    orderId INT,
    productId INT,
    FOREIGN KEY (orderId) REFERENCES [Order](orderId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

CREATE TABLE Color (
    colorId INT PRIMARY KEY IDENTITY(1, 1),
    color VARCHAR(15)
);

CREATE TABLE ProductColor (
    ProductColorID INT PRIMARY KEY IDENTITY(1, 1),
    productId INT,
    colorId INT,
    FOREIGN KEY (productId) REFERENCES Product(productId),
    FOREIGN KEY (colorId) REFERENCES Color(colorId)
);

ALTER TABLE OrderDetail add quantity INT;
ALTER TABLE [User] ALTER COLUMN password VARCHAR (300) NOT NULL;