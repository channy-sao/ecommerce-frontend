import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters"),
    description: z.string().max(500, "Description must be less than 500 characters")
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
