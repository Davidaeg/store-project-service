export interface Order {
  orderId: number;
  customerId: number;
  purchaseDate: Date;
  status: string;
}

export interface CreateOrderDetailsDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: number;
  purchaseDate: Date;
  status: string;
  products: CreateOrderDetailsDto[];
}
