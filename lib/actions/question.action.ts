"use server"

import Question from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import mongoose from "mongoose"
import Tag from "@/database/tag.model"
import { CreateQuestionParams, GetQuestionParams } from "./shared.types"
import User from "@/database/user.model"
import { PopulatedQuestionType } from "@/database/shared.types"
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