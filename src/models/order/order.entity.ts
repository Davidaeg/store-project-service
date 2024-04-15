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

export enum Category{
  Category0 = 'STD',
  Category1 = 'Cat1',
  Category2 = 'Cat2',
  Category3 = 'Cat3',
}
