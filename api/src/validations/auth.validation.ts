import { z } from "zod";
import { RoleType } from "../generated/client.js";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be more than 20 characters")
    .regex(/(^[a-zA-Z0-9._])/, "Username cant contain symbols"),
  email: z.email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  referralCode: z.string().optional(),
  role: z.enum(RoleType).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.email("Invalid email format"),
});

export const resetPasswordConfirmSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });
