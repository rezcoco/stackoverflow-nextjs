"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import { Model } from "mongoose";

export async function globalSearch(params: SearchParams): Promise<Array<any>> {
    try {
        await connectToDatabase()

        const { query, type } = params
        const regexQuery = { $regex: query, $options: "i" }

        const results = []
        const types = ["user", "question", "answer", "tag"] as const

        const models: ReadonlyArray<{
            model: Model<any>,
            searchField: "name" | "title" | "content",
            type: typeof types[number]
        }> = [
            { model: User, searchField: "name", type: "user" },
            { model: Question, searchField: "title", type: "question" },
            { model: Answer, searchField: "content", type: "answer" },
            { model: Tag, searchField: "name", type: "tag" }
        ] as const

        const lowerType = type?.toLowerCase()


        if (!lowerType || !types.includes(lowerType as any)) {
            for (const { model, searchField, type: t } of models) {
                const r = await model.find({ [searchField]: regexQuery }).limit(3)

                results.push(...r.map(item => {
                    return {
                        type: t,
                        title: t === "answer" ? `Answers containing ${query}` : item[searchField],
                        id: t === "user" ? item.clerkId : t === "answer" ? item.question : item.id
                    }
                }))
            }
        } else {
            const searchModel = models.find(m => m.type === lowerType)

            if (!searchModel) throw new Error("Unrecognized type")

            const r = await searchModel.model.find({ [searchModel.searchField]: regexQuery }).limit(3)

            results.push(...r.map(item => {
                return {
                    type: searchModel.type,
                    title: searchModel.type === "answer" ? `Answers containing ${query}` : item[searchModel.searchField],
                    id: searchModel.type === "user" ? item.clerkId : searchModel.type === "answer" ? item.question : item.id
                }
            }))
        }

        return JSON.parse(JSON.stringify(results))
    } catch (error) {
        console.log(error)
        throw error
    }
}