// Form validation schema
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' }),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(50, { message: 'First name cannot exceed 50 characters.' })
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(50, { message: 'Last name cannot exceed 50 characters.' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  profile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB.',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type), {
      message: 'Only JPEG, PNG, GIF, and WebP images are allowed.',
    })
    .optional()
    .or(z.undefined()),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .optional()
    .or(z.literal('')),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(50, { message: 'First name cannot exceed 50 characters.' })
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(50, { message: 'Last name cannot exceed 50 characters.' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  profile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB.',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type), {
      message: 'Only JPEG, PNG, GIF, and WebP images are allowed.',
    })
    .optional()
    .or(z.undefined()),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
