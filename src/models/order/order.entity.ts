export interface Order {
  orderId: number;
  customerName: string;
  purchaseDate: Date;
  status: string;
}
export enum Category{
  Category0 = 'STD',
  Category1 = 'Cat1',
  Category2 = 'Cat2',
  Category3 = 'Cat3',
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

