import { z } from "zod";

export const loginSchemaFront = z.object({
  username: z.string().min(1, "Username is required").default(""),
  password: z.string().min(1, "Password is required").default(""),
});

export type LoginFormType = z.infer<typeof loginSchemaFront>;
