import { z } from "zod";
export const welcomeSchema = z.object({
  email: z
    .string()
    .min(1, "Email username is required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Only letters, numbers, dots, underscores, and hyphens are allowed",
    ),
});

export type WelcomeSchema = z.infer<typeof welcomeSchema>;
