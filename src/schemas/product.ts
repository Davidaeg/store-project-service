import z from "zod";

const productSchema = z.object({
  id: z.number().int().min(0),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
});

export function validateProduct(input: any) {
  return productSchema.safeParse(input);
}

export function validatePartialProduct(input: any) {
  return productSchema.partial().safeParse(input);
}
