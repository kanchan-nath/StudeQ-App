import z from "zod"

export const ragQueryValidator = z.object({
    query: z.string()
        .trim()
        .min(1, { message: "Query cannot be empty" })
        .max(5000, { message: "Query must be at most 1000 characters" }),
})