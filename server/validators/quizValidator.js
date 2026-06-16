import { z } from "zod";

export const quizValidator = z.object({
    title: z.string().min(3).max(100),
    subject: z.string().min(2).max(50),
    topic: z.string().min(2).max(100),
    types: z.enum(["mcq", "true_false", "fill_blank", "short_answer"]),
    difficulty: z.enum(["easy", "medium", "hard"]),
});