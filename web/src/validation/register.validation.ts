import { z } from "zod";

export const registerSchemaFront = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),
  username: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(20)
    .regex(/^[a-zA-Z0-9._]/, "Username can contain only alphabets"),
  email: z.email("Invalid email format"),
  referralCode: z.string().optional(),
  password: z
    .string({ error: "Password is required" })
    .min(5, "Password must be at least 5 characters"),
});

export type RegisterFormType = z.infer<typeof registerSchemaFront>;
