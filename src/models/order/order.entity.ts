export interface Order {
  orderId: number;
  customerName: string;
  purchaseDate: Date;
  status: string;
}

export interface CreateOrderDetailsDto {
  orderId?: number;
  productName?: string; 
  productPrice?: number; 
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: number;
  purchaseDate: Date;
  status: string;
  products: CreateOrderDetailsDto[];
}


