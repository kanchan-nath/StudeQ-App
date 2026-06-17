import { z } from "zod";

export const quizValidator = z.object({
    subject: z.string().min(2).max(50),
    topic: z.string().min(2).max(100),
    types: z.enum(["mcq", "true_false", "fill_blank", "short_answer"]),

    quizId: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    title: z.string().min(3).max(100).optional(),
});



export const answersValidator = z.object({
    answers: z.array(
        z.object({
            questionId: z.string().min(1),
            answer: z.string().min(1),
        })
    ).min(1),
});

export const generateQuizFromFilesValidetor = z.object({
    types: z.array(z.enum(["mcq", "true_false", "fill_blank", "short_answer"])).min(1),

})