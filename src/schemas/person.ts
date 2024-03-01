import z from "zod";

export const CreatePersonSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  firstLastName: z.string().min(1, { message: "First last name is required" }),
  secondLastName: z
    .string()
    .min(1, { message: "Second last name is required" }),
  birthday: z
    .string()
    .transform((value) => new Date(value))
    .refine(
      (value) => {
        return !isNaN(value.getTime());
      },
      { message: "Invalid birthday format" }
    ),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function validatePerson(input: any) {
  return CreatePersonSchema.safeParse(input);
}

export function validatePartialPerson(input: any) {
  return CreatePersonSchema.partial(input).safeParse(input);
}

export const validateId = (id: number) => {
  return z.number().int().nonnegative().safeParse(id);
};
