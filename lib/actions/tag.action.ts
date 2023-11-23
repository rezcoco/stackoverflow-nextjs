"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { TTagDoc } from "@/database/tag.model";
import { Populated } from "@/database/shared.types";
import Question, { TQuestionDoc } from "@/database/question.model";
import { FilterQuery } from "mongoose";

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

        const { page = 1, pageSize = 10, searchQuery, filter } = params

        const query: FilterQuery<TTagDoc> = searchQuery ? { name: { $regex: new RegExp(searchQuery, "i") } } : {}
        const sortBy: FilterQuery<TTagDoc> = {}
        const skip = pageSize * (page - 1)

        switch (filter) {
            case "popular":
                sortBy.questions = 1
                break
            case "recent":
                sortBy.createdAt = -1
                break
            case "name":
                sortBy.name = 1
                break
            case "old":
                sortBy.createdAt = 1
        }

        const fullDocs = await Tag.countDocuments(query)

        const tags = await Tag.find(query).skip(skip).limit(pageSize).sort(sortBy)

        const isNext = tags.length + skip < fullDocs

        return {
            tags,
            isNext
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

type TPopulatedQuestionsTagById = Omit<TTagDoc, "questions"> & {
    questions: Populated<TQuestionDoc, "author" | "tags">[]
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
    try {
        await connectToDatabase()

        const { tagId, searchQuery, page = 1, pageSize = 1 } = params

        const tagFilter: FilterQuery<TTagDoc> = { _id: tagId }
        const skip = (page - 1) * pageSize
        const fullDocs = await Tag.countDocuments()

        const result = await Tag.findOne(tagFilter).populate<TPopulatedQuestionsTagById>({
            path: "questions",
            match: searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {},
            model: Question,
            options: {
                limit: pageSize,
                skip
            },
            populate: [
                { path: "author", model: User, select: "_id clerkId name picture" },
                { path: "tags", model: Tag, select: "_id name" }
            ]
        })
        if (!result) throw new Error("tag not found")

        const isNext = result.questions.length + skip < fullDocs

        return {
            tagName: result.name,
            questions: result.questions,
            isNext
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getHotTags() {
    try {
        await connectToDatabase()

        const tags = await Tag.aggregate([
            { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
            { $sort: { numberOfQuestions: -1 } },
            { $limit: 5 }
        ])
        return tags
    } catch (error) {
        console.log(error)
        throw error
    }
}