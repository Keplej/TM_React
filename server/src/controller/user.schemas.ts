import { z } from "zod"

const usernameSchema = z.string().min(5).max(15);
const passwordSchema = z.string().min(6).max(225);

export const loginSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
    userAgent: z.string().optional()
})

export const registerSchema = loginSchema.extend({ // using helpful zod method in extend from loginSchema. When we use the loginSchema we can add in additional properties like confirmPassword
    confirmPassword: z.string().min(6).max(225),
}).refine(
    (data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
)