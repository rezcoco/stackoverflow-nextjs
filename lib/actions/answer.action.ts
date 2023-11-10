"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { UserType } from "@/database/shared.types";


export async function createAnswer(params: CreateAnswerParams) {
    try {
        await connectToDatabase()

        const answer = await Answer.create(params)
        await Question.findByIdAndUpdate(
            params.question,
            { $push: { answers: answer.id } },
        )

        revalidatePath(params.path)

        return answer
    } catch (error) {
        console.log(error)
        throw error
    }
}

type PopulatedUser = {
    author: Pick<UserType, "id" | "_id" | "clerkId" | "name" | "picture">
}

export async function getAnswers(params: GetAnswersParams) {
    try {
        await connectToDatabase()

        const answers = await Answer.find({ question: params.questionId })
            .populate<PopulatedUser>("author", "_id clerkId name picture")
            .sort({ createdAt: -1 })

        return answers
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase()

        const { userId, answerId, hasupVoted, hasdownVoted, path } = params
        let updateQuery: Record<string, any> = {}

        if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId }
            }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $addToSet: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const result = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })
        if (!result) throw new Error("answer not found")

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase()

        const { userId, answerId, hasupVoted, hasdownVoted, path } = params
        let updateQuery: Record<string, any> = {}

        if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $addToSet: { downvotes: userId }
            }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const result = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })
        if (!result) throw new Error("answer not found")

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}