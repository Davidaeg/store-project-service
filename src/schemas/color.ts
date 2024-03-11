import z from "zod";

export const CreateColorDto = z.object({
  color: z.string().min(1, { message: "Color is required" }),
});

export function validateColor(input: any) {
  return CreateColorDto.safeParse(input);
}

export function validatePartialColor(input: any) {
  return CreateColorDto.partial().safeParse(input);
}

export const validateId = (id: number) => {
  return z.number().int().nonnegative().safeParse(id);
};
