"use server"

import User, { TUserDoc } from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetAnswersByUserId, GetQuestionsByUserId, GetSavedQuestionsParams, GetUserByIdParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question, { TQuestionDoc } from "@/database/question.model"
import Tag from "@/database/tag.model"
import { Populated } from "@/database/shared.types"
import { FilterQuery } from "mongoose"
import Answer, { TAnswerDoc } from "@/database/answer.model"
import { BadgeCriteriaType } from "@/types"
import { getBadges } from "../utils"

export async function getUserById(params: GetUserByIdParams) {
    try {
        await connectToDatabase()

        const { userId } = params

        const user = await User.findOne({ clerkId: userId })
        return user
    } catch (error) {
        console.log(error)
    }
}

export async function createUser(params: CreateUserParams) {
    try {
        await connectToDatabase()

        const user = await User.create(params)

        return user
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        await connectToDatabase()

        await User.findOneAndUpdate(
            { clerkId: params.clerkId },
            params.updateData,
            { new: true }
        )

        revalidatePath(params.path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        await connectToDatabase()

        const user = await User.findOneAndDelete({ clerkId: params.clerkId })
        if (!user) {
            throw new Error("user not found")
        }

        // const userQuestionIds = await Question.find({ author: user._id }).distinct("_id")

        await Question.deleteMany({ author: user._id })

        const deletedUser = await User.findByIdAndDelete(user._id)

        return deletedUser
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        await connectToDatabase()

        const { page = 1, pageSize = 10, searchQuery, filter } = params

        const query: FilterQuery<TUserDoc> = {}
        const sortBy: FilterQuery<TUserDoc> = {}
        const skip = pageSize * (page - 1)

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        const fullDocs = await User.countDocuments(query)

        switch (filter) {
            case "new_users":
                sortBy.joinedAt = -1
                break
            case "old_users":
                sortBy.joinedAt = 1
                break
            case "top_contributors":
                sortBy.reputation = -1
        }

        const users = await User.find(query).sort(sortBy).skip(skip).limit(pageSize)
        const isNext = users.length + skip < fullDocs

        return { users, isNext }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, path, hasSaved } = params

        const user = await User.findById(userId)
        if (!user) throw new Error("user not found")

        let updateQuery: Record<string, any> = {}

        if (hasSaved) {
            updateQuery = { $pull: { saved: questionId } }
        } else {
            updateQuery = { $addToSet: { saved: questionId } }
        }

        const result = await User.findByIdAndUpdate(userId, updateQuery, { new: true })
        if (!result) throw new Error("user not found")

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

type PopulatedSavedQuestions = {
    saved: Populated<TQuestionDoc, "author" | "tags">[]
}

export async function savedQustions(params: GetSavedQuestionsParams) {
    try {
        await connectToDatabase()
        const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params

        const query: FilterQuery<TQuestionDoc> = searchQuery ? { title: { $regex: new RegExp(searchQuery, 'i') } } : {}
        const sortBy: FilterQuery<TQuestionDoc> = {}
        const skip = pageSize * (page - 1)

        switch (filter) {
            case "most_recent":
                sortBy.createdAt = -1
                break
            case "oldest":
                sortBy.createdAt = 1
                break
            case "most_voted":
                sortBy.upvotes = -1
                break
            case "most_viewed":
                sortBy.views = -1
                break
            case "most_answered":
                sortBy.answers = -1
        }
        const fullDocs = await User.countDocuments(query)

        const result = await User.findOne({ clerkId }).populate({
            path: "saved",
            match: query,
            options: {
                sort: sortBy,
                limit: pageSize,
                skip
            },
            populate: [
                { path: "tags", model: Tag, select: "_id name" },
                { path: "author", model: User, select: "_id clerkId name picture" }
            ]
        }) as PopulatedSavedQuestions;

        const isNext = result.saved.length + skip < fullDocs

        if (!result) throw new Error("user not found")

        return {
            saved: result.saved,
            isNext
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        await connectToDatabase()

        const user = await User.findOne({ clerkId: params.userId })
        if (!user) throw new Error("user not found")

        const totalQuestions = await Question.countDocuments({ author: user.id })
        const totalAnswers = await Answer.countDocuments({ author: user.id })

        const [questionUpvotes] = await Question.aggregate([
            { $match: { author: user._id } },
            {
                $project: {
                    _id: 0,
                    upvotes: { $size: "$upvotes" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalUpvotes: { $sum: "$upvotes" }
                }
            }
        ]);

        const [answerUpvotes] = await Answer.aggregate([
            { $match: { author: user._id } },
            { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
            { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } }
        ])

        const [questionViews] = await Question.aggregate([
            { $match: { author: user._id } },
            { $group: { _id: null, totalViews: { $sum: "views" } } }
        ])

        const criteria: Array<{
            type: BadgeCriteriaType,
            count: number
        }> = [
                { type: "QUESTION_COUNT", count: totalQuestions },
                { type: "ANSWER_COUNT", count: totalAnswers },
                { type: "QUESTION_UPVOTES", count: questionUpvotes?.totalUpvotes || 0 },
                { type: "ANSWER_UPVOTES", count: answerUpvotes?.totalUpvotes || 0 },
                { type: "TOTAL_VIEWS", count: questionViews?.totalViews || 0 }
            ]

        const userBadges = getBadges(criteria)

        return {
            user,
            totalQuestions,
            totalAnswers,
            badges: userBadges,
            reputaion: user.reputation
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function getQuestionsByUserId(params: GetQuestionsByUserId) {
    try {
        await connectToDatabase()

        const { userId, page = 1, pageSize = 10 } = params

        const totalQuestions = await Question.countDocuments({ author: userId })
        const skip = (page - 1) * pageSize

        const questions = await Question.find({ author: userId })
            .populate("author")
            .populate("tags")
            .sort({ views: -1, upvotes: -1 }).skip(skip).limit(pageSize) as Populated<TQuestionDoc, "author" | "tags">[];

        if (!questions) throw new Error("question not found")

        const isNext = questions.length + skip < totalQuestions

        return {
            totalQuestions,
            questions,
            isNext
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

type PopulatedAnswerByUserId = Populated<TAnswerDoc, "author" | "question">[]

export async function getAnswersByUserId(params: GetAnswersByUserId) {
    try {
        await connectToDatabase()

        const { userId, page = 1, pageSize = 10 } = params

        const fullDocs = await Answer.countDocuments({ author: userId })
        const skip = (page - 1) * pageSize

        const answers = await Answer.find({ author: userId })
            .populate("author")
            .populate("question")
            .sort({ views: -1, upvotes: - 1 }).skip(skip).limit(pageSize) as PopulatedAnswerByUserId;

        if (!answers) throw new Error("answer not found")

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