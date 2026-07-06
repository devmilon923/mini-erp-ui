import z from "zod";
const loginValidation = z.object({
  email: z.string().min(10, "Email is required"),
  password: z.string().min(8, "Password is required"),
  role: z.enum(["admin", "manager", "employee"]),
});

export type TLogin = z.infer<typeof loginValidation>;
