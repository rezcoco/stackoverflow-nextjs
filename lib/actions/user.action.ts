"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"

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

        // const { page = 1, pageSize = 20, filter, searchQuery } = params

        const users = await User.find({})

        return { users }
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