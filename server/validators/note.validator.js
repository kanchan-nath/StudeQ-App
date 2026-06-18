import { z } from "zod";

export const noteValidator = z.object({
    content: z.string().min(2).max(10000),
});