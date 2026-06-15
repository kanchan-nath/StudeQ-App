import z from "zod"

export const registerValidator = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be at most 50 characters" })
        .trim(),
    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password must be at most 100 characters" }),
    grade: z
        .number({ invalid_type_error: "Grade must be a number" })
        .trim()
        .int({ message: "Grade must be a whole number" })
        .min(1, { message: "Grade must be at least 1" })
        .max(12, { message: "Grade must be at most 12" }),
})
export const loginValidator = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password must be at most 100 characters" }),
})