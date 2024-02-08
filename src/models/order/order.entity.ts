export interface Order {
  orderId: number;
  employeeId: number;
  purchaseDate: Date;
  status: string;
}

export interface CreateOrderDto {
  employeeId: number;
  purchaseDate: Date;
  status: string;
}
