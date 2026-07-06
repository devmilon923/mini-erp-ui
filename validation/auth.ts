import z from "zod";
export const loginValidation = z.object({
  email: z.string().min(10, "Email is required"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}_\-+=|\\:;"'<>,./~`]).{8,}$/,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    ),
  role: z.enum(["admin", "manager", "employee"]).optional(),
});

export type TLogin = z.infer<typeof loginValidation>;
