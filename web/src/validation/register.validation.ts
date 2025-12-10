import { z } from "zod";

export const registerSchemaFront = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").default(""),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20)
    .regex(/^[a-zA-Z0-9._]/, "Username can contain only alphabets")
    .default(""),
  email: z.email("Invalid email format").default(""),
  referralCode: z.string().optional().default(""),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .default(""),
});

export type RegisterFormType = z.infer<typeof registerSchemaFront>;
