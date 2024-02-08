export enum Location {
  Shelf1 = "Shelf1",
  Shelf2 = "Shelf2",
  Shelf3 = "Shelf3",
}

export interface Product {
  productId: number;
  name: string;
  image: string;
  stock: number;
  price: number;
  priceWithIva: number;
  location: Location;
}

export interface CreateProduct {
  name: string;
  image: string;
  stock: number;
  price: number;
  priceWithIva: number;
  location: Location;
}
