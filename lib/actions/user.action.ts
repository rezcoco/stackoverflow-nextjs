"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"

export async function getUserById(params: any) {
    try {
        await connectToDatabase()

        const { userId } = params

        const user = await User.findOne({ _id: userId })
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