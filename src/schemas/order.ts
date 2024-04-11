import z from "zod";

export const CreateOrderDetailSchema = z.object({
    productId: z.number().min(1, { message: "ProductId is required" }),
    quantity: z.number().min(1, { message: "Quantity must be greater than 0" })
});

export const CreateOrderSchema = z.object({
    customerId: z.number().min(1, { message: "CustomerID is required" }),
    purchaseDate: z
    .string()
    .transform((value) => new Date(value))
    .refine(
      (value) => {
        return !isNaN(value.getTime());
      },
      { message: "Invalid birthday format" }
    ),
    status: z.string().min(1, { message: "Type is required" }),
    products: z.array(CreateOrderDetailSchema)
});

export function validateOrder(input: any) {
    return CreateOrderSchema.safeParse(input);
  }
  
  export function validatePartialOrder(input: any) {
    return CreateOrderSchema.partial(input).safeParse(input);
  }
  
  export const validateId = (id: number) => {
    return z.number().int().nonnegative().safeParse(id);
  };
