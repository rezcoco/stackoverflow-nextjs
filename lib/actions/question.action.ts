"use server"

import Question, { TQuestionDoc } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import mongoose, { FilterQuery } from "mongoose"
import Tag from "@/database/tag.model"
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionParams, QuestionVoteParams } from "./shared.types"
import User from "@/database/user.model"
import { Populated } from "@/database/shared.types"
import { revalidatePath } from "next/cache"
import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"


export async function getQuestions(params: GetQuestionParams) {
    try {
        await connectToDatabase()

        const { page = 1, pageSize = 1, searchQuery, filter } = params

        const query: FilterQuery<TQuestionDoc> = {}
        const sortOptions: FilterQuery<TQuestionDoc> = {}
        const skip = pageSize * (page - 1)

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
            ]
        }

        const fullDocs = await Question.countDocuments(query)

        switch (filter) {
            case "newest":
                sortOptions.createdAt = -1
                break
            case "frequent":
                sortOptions.views = -1
                break
            case "unanswered":
                query.answers = { $size: 0 }
                break
        }

        const questions = await Question.find(query)
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize) as Populated<TQuestionDoc, "author" | "tags">[];

        return {
            isNext: questions.length + skip < fullDocs,
            questions
        }
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

        await User.findByIdAndUpdate(author, {
            $inc: { reputation: 5 }
        })

        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question.id,
            tags: tagDocuments
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }

}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        await connectToDatabase()

        const question = await Question.findById(params.questionId)
            .populate("author")
            .populate("tags") as Populated<TQuestionDoc, "author" | "tags">

        if (!question) throw new Error("question not found")

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

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -1 : 1 }
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

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasdownVoted ? 1 : -1 }
        })

        await User.findByIdAndUpdate(result.author._id, {
            $inc: { reputation: hasdownVoted ? 2 : -2 }
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        await connectToDatabase()

        const { questionId, path } = params

        await Question.deleteOne({ _id: questionId })
        await Answer.deleteMany({ question: questionId })
        await Interaction.deleteMany({ question: questionId })
        await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        await connectToDatabase()

        const { questionId, title, content, path } = params

        const question = await Question.findById(questionId)
        if (!question) throw new Error("question not found")

        question.title = title
        question.content = content
        await question.save()

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getHotQuestions() {
    try {
        await connectToDatabase()

        const questions = await Question.aggregate([
            {
                $sort: { upvotes: -1, views: -1, anwers: -1 }
            },

        ])
        return questions
    } catch (error) {
        console.log(error)
        throw error
    }
}