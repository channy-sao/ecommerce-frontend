import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, 'Product price is required')
    .regex(/^(0*[1-9]\d*)(\.\d{1,2})?$/, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Please select a category for this product'),
  isFeature: z.boolean(), // remove .default()
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Product image is required for user know",
    }),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
