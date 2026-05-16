import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  fullname: z.string().min(1, 'Full name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits').optional(),
  token: z.string().min(10, 'Invalid verification token').optional(),
}).refine((data) => data.code || data.token, {
  message: 'Provide verification code or token',
});

export const updateProfileSchema = z.object({
  username: z.string().min(1, 'Full name is required').optional(),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine((data) => data.username || data.phone_number || data.email, {
  message: 'Provide at least one field to update',
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
