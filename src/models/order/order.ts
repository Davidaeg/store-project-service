import sql, { ConnectionPool } from "mssql";
import { CreateOrderDto, CreateOrderDetailsDto, Order} from "./order.entity";
import { Database } from "@DB/DataBase";
import ServerError from "@errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum";


export class OrdersModel {
    private pool!: ConnectionPool;
    constructor() {
        this.initDB();
    }

    async initDB() {
        this.pool = Database.getInstace().getPool();
    }

    async getById({ id }: { id: number }) {
      const order = await this.pool
        .request()
        .input("input_parameter", sql.Int, id)
        .query("SELECT * FROM [Order] WHERE orderId = @input_parameter");
      return order.recordset[0];
    }

    async getAll() {
      const query = `
          SELECT 
              o.orderId, 
              CONCAT(p.name, ' ', p.firstLastName, ' ', p.secondLastName) AS customerName, 
              o.purchaseDate, 
              o.status
          FROM 
              [Order] o
          JOIN 
              Customer c ON o.customerId = c.customerId
          JOIN 
              Person p ON c.personId = p.personId;
      `;
      const result = await this.pool.request().query(query);
      return result.recordset as Order[];
  }
    
  async getOrderDetailsByOrderId(orderId: number) {
    const query = `
      SELECT 
          od.orderId, 
          p.name AS productName, 
          p.price AS productPrice, 
          od.quantity
      FROM 
          OrderDetail od
      JOIN 
          Product p ON od.productId = p.productId
      WHERE
          od.orderId = @orderId; -- Filtrar por el ID de pedido
    `;
  
    const result = await this.pool
      .request()
      .input('orderId', orderId) // Pasar el ID de pedido como parámetro
      .query(query);
  
    return result.recordset as CreateOrderDetailsDto[];
  }
  


    async create(order: CreateOrderDto){
      try {
        //Check if there is a Customer with a specific UserID
        const checkCustomer = await this.pool
        .request()
        .input("userId", sql.Int, order.userId)
        .query(
          `SELECT customerId 
            FROM Customer 
            WHERE personID = (SELECT personID FROM [User] WHERE userId = @userId)`
        )
        if (checkCustomer.recordset.length === 0){
          return undefined;
        }

        //Check if there is enough stock to create the order
        for (const product of order.products){
          const isValidStock = await this.validateStock(product);
          if (!isValidStock) {
            return undefined;    
          }
        }

        //Create the order in the Order Table
        const createOrder = await this.pool
          .request()
          .input("customerId", sql.Int, checkCustomer.recordset[0].customerId)
          .input("purchaseDate", sql.Date, order.purchaseDate)
          .input("status", sql.VarChar, order.status)
          .query(
            `INSERT INTO [Order] (customerId, purchaseDate, status)
                OUTPUT inserted.orderId
                VALUES (@customerId, @purchaseDate, @status)`
          );

          const newOrder = createOrder.recordset[0];
          
          // For each product update the stock and then create the OrderDetail
          for (const product of order.products){
            await this.pool
              .request()
              .input("productId", sql.Int, product.productId)
              .input("requested_quantity", sql.Int, product.quantity)
              .query(`UPDATE Product 
                      SET stock = (SELECT stock - @requested_quantity FROM Product WHERE productId = @productId)
                      WHERE productId = @productId`);

            await this.pool
              .request()
              .input("orderId", sql.Int, newOrder.orderId)
              .input("productId", sql.Int, product.productId)
              .input("quantity", sql.Int, product.quantity)
              .query(
                `INSERT INTO OrderDetail (orderId, productId, quantity)
                    VALUES (@orderId, @productId, @quantity)`);
          }
          
          return newOrder;

      } catch (error) {
        console.error("Error creating order:", error);
        throw new ServerError({
          name: ErrorsName.InternalServerError,
          code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: "Error creating order",
          logging: true,
          context: { error },
        });
      }
    }

    async validateStock(product: CreateOrderDetailsDto){
      const result = await this.pool
        .request()
        .input("requested_quantity", sql.Int, product.quantity)
        .input("productId", sql.Int, product.productId)
        .query(`SELECT
                  CASE 
                    WHEN stock >= @requested_quantity THEN 'true' ELSE 'false' 
                  END AS hasEnoughStock
                FROM Product
                WHERE productId = @productId`);

      return result.recordset[0].hasEnoughStock === 'true';
    }

    async findByCustomerId({ customerId }: { customerId: number }) {
        const order = await this.pool
          .request()
          .query(`SELECT * FROM [Order] WHERE customerId = ${customerId}`);
        return order.recordset[0] as Order;
    }

    async updateStatus(input: Partial<Order>) {
      try {
          console.log("Updating order status. Input:", input);
  
          const updatedOrder = await this.pool
              .request()
              .input("orderId", sql.Int, input.orderId)
              .input("Status", sql.VarChar, input.status)
              .query(
                  `UPDATE [Order] SET "status" = @Status WHERE orderId = @orderId`
              );
          return updatedOrder;
      } catch (error) {
          console.error("Error updating State:", error);
      }
  }
  
}