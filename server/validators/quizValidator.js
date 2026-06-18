import { z } from "zod";

const QUESTION_TYPES = ["multiple-choice", "true-false", "fill-blank", "short-answer"];

export const quizValidator = z.object({
    subject: z.string().min(2).max(50),
    topic: z.string().min(2).max(100),
    title: z.string().min(3).max(100),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    audience: z.string().min(2).max(50).optional(),

    types: z.array(
        z.object({
            type: z.enum(QUESTION_TYPES),
            count: z.number().int().min(1).max(50),
        })
    ).min(1),

    quizId: z.string().optional(),
});

export const answersValidator = z.object({
    answers: z.array(z.string().min(1)).min(1),
});

export const generateQuizFromFilesValidator = z.object({
    types: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                try { return JSON.parse(val); } catch { return val; }
            }
            return val;
        },
        z.array(
            z.object({
                type: z.enum(QUESTION_TYPES),
                count: z.number().int().min(1).max(50),
            })
        ).min(1)
    ),

    total: z.preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().min(1).max(200)
    ),
});