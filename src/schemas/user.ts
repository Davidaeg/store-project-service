import z from "zod";

export const CreateUserDto = z.object({
  username: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function validateUser(input: any) {
  return CreateUserDto.safeParse(input);
}

export function validatePartialUser(input: any) {
  return CreateUserDto.partial().safeParse(input);
}
