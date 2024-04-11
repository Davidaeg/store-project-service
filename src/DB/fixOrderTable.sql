use storedb;

DROP TABLE [dbo].[OrderDetail];
DROP TABLE [dbo].[Order];


CREATE TABLE [Order] (
    orderId INT PRIMARY KEY IDENTITY(1,1),
    customerId INT,
    purchaseDate DATETIME,
    status VARCHAR(13),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

CREATE TABLE OrderDetail (
    orderDetailId INT PRIMARY KEY IDENTITY(1,1),
    orderId INT,
    productId INT,
	quantity INT,
    FOREIGN KEY (orderId) REFERENCES [Order](orderId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

-- Insert into Order
INSERT INTO [Order] (customerId, purchaseDate, status)
VALUES (1, GETDATE(), 'InPreparation');

INSERT INTO OrderDetail (orderId, productId, quantity)
VALUES (1, 1, 1);
