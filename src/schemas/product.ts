import { Location } from "../models/product/product.entity";
import z from "zod";

export const CreateProductDto = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().min(1, { message: "Image is required" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
  price: z
    .number()
    .nonnegative({ message: "Price must be a non-negative number" }),
  priceWithIva: z
    .number()
    .nonnegative({ message: "Price with IVA must be a non-negative number" }),
  location: z.nativeEnum(Location),
});

export function validateProduct(input: any) {
  return CreateProductDto.safeParse(input);
}

export function validatePartialProduct(input: any) {
  return CreateProductDto.partial().safeParse(input);
}
