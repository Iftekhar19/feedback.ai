import { email, z } from "zod";
export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "username should not be more than 20 characters")
  .regex(/^[a-zA-Z0-9._]+$/, "username must not contains special characters");

export const SignUpValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "password must be atleast 8 characters")
    .max(15, "password should be more than 15 characters"),
});
