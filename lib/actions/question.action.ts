"use server"

import Question from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import mongoose from "mongoose"
import Tag from "@/database/tag.model"
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionParams, QuestionVoteParams } from "./shared.types"
import User from "@/database/user.model"
import { PopulatedQuestionType, TagType, UserType } from "@/database/shared.types"
import { revalidatePath } from "next/cache"


export async function getQuestions(params: GetQuestionParams) {
    try {
        await connectToDatabase()
        const questions: PopulatedQuestionType[] = await Question.find({})
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .lean()

        return questions
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase()
        const { title, content, tags, author, path } = params

        const question = await Question.create({ title, content, author })
        const tagDocuments: Array<mongoose.Types.ObjectId> = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: tag },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id)
        }

        await Question.findOneAndUpdate(
            { _id: question._id },
            { $push: { tags: { $each: tagDocuments } } }
        )

        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }

}

type PopulatedTag = {
    tags: Array<Pick<TagType, "id" | "name">>
}

type PopulatedUser = {
    author: Pick<UserType, "id" | "clerkId" | "name" | "picture">
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        await connectToDatabase()

        const question = await Question.findById(params.questionId)
            .populate<PopulatedTag>({ path: "tags", model: Tag, select: "_id name" })
            .populate<PopulatedUser>({ path: "author", model: User, select: "_id clerkId name picture" })

        return question
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, hasupVoted, hasdownVoted, path } = params

        let updateQuery: Record<string, any> = {}

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $addToSet: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const result = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })
        if (!result) throw new Error("question not found")

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, hasupVoted, hasdownVoted, path } = params

        let updateQuery: Record<string, any> = {}

        if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $addToSet: { downvotes: userId }
            }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
            }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const result = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })
        if (!result) throw new Error("question not found")

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}