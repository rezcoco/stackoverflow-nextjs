import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase()

        const { userId = 3 } = params

        const user = await User.findById(userId)
        if (!user) throw new Error("user not found")

        return [
            {
                _id: 1,
                name: "NEXT"
            },
            {
                _id: 2,
                name: "REACT"
            }
        ]
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        await connectToDatabase()

        // const { page = 1, pageSize = 10, filter, searchQuery } = params

        const tags = await Tag.find({})

        return tags
    } catch (error) {
        console.log(error)
        throw error
    }
}