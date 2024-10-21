import { z } from "zod";
import catchErrors from "../utils/catch-errors.utils";

const registerSchema = z.object({
    username: z.string().min(5).max(15),
    password: z.string().min(6).max(225),
    confirmPassword: z.string().min(6).max(225),
    userAgent: z.string().optional(),
}).refine(
    (data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
)


export const registerHandler = catchErrors(
    async (req, res) => {
        // validate request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        })
        // call service

        

        // return response
    }
)