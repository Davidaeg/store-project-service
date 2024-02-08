export interface Product {
  productId: number;
  name: string;
  image: string;
  stock: number;
  price: number;
  priceWithIva: number;
  location: string;
}

export interface CreateProduct {
  name: string;
  image: string;
  stock: number;
  price: number;
  priceWithIva: number;
  location: string;
}
