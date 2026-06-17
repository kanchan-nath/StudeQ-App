import {z} from "zod"

export const flashcardValidator = z.object({
    topic: z.string().min(2).max(100).optional(),
    subject: z.string().min(2).max(50).optional(),
    flashcardId: z.string().optional(),
});