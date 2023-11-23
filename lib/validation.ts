import * as z from "zod";

export const QuestionSchemaValidation = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(20),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3)
});

export const AnswerSchemaValidation = z.object({
    answer: z.string().min(100)
})

export type AnswerSchemaType = z.infer<typeof AnswerSchemaValidation>

export const ProfileSchemaValidation = z.object({
    name: z.string().min(3).max(30),
    username: z.string().min(5).max(10),
    portfolioLink: z.optional(z.string().regex(/(https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})/)),
    location: z.optional(z.string().min(5).max(30)),
    bio: z.optional(z.string().min(12).max(100))
})

export type ProfileSchemaType = z.infer<typeof ProfileSchemaValidation>