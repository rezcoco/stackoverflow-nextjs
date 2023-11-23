"use server"

import Answer, { TAnswerDoc } from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User, { TUserDoc } from "@/database/user.model";
import { Populated } from "@/database/shared.types";
import { FilterQuery } from "mongoose";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        await connectToDatabase()

        const answer = await Answer.create(params)
        const question = await Question.findByIdAndUpdate(
            params.question,
            { $push: { answers: answer.id } },
        )

        await Interaction.create({
            user: params.author,
            action: "answer",
            answer: answer.id,
            question: params.question,
            tags: question?.tags
        })

        await User.findByIdAndUpdate(params.author, {
            $inc: { reputation: 10 }
        })

        revalidatePath(params.path)

        return answer
    } catch (error) {
        console.log(error)
        throw error
    }
}

type PopulatedUser = {
    author: Populated<TUserDoc, "id" | "_id" | "clerkId" | "name" | "picture">
}

export async function getAnswers(params: GetAnswersParams) {
    try {
        await connectToDatabase()

        const { sortBy, page = 1, pageSize = 10, questionId } = params

        const sortOptions: FilterQuery<TAnswerDoc> = {}
        const skip = pageSize * (page - 1)
        const fullDocs = await Answer.countDocuments({ question: questionId })

        switch (sortBy) {
            case "highestUpvotes":
                sortOptions.upvotes = -1
                break
            case "lowestUpvotes":
                sortOptions.upvotes = 1
                break
            case "recent":
                sortOptions.createdAt = -1
                break
            case "old":
                sortOptions.createdAt = 1
        }

        const answers = await Answer.find({ question: questionId })
            .populate<PopulatedUser>("author", "_id clerkId name picture")
            .skip(skip).limit(pageSize).sort(sortOptions);

        const isNext = answers.length + skip < fullDocs

        return {
            answers,
            isNext
        }
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

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(result.author._id, {
            $inc: { reputation: hasupVoted ? -10 : 10 }
        })

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

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasdownVoted ? 2 : -2 }
        })

        await User.findByIdAndUpdate(result.author._id, {
            $inc: { reputation: hasdownVoted ? 10 : -10 }
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        await connectToDatabase()

        const { answerId, path } = params

        const answer = await Answer.findById(answerId)
        if (!answer) throw new Error("answer not found")

        await Answer.deleteOne({ _id: answerId })
        await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } })
        await Interaction.deleteMany({ answer: answerId })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}