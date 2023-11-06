import mongoose from "mongoose"

export type UserType = mongoose.Document & {
    clerkId: string
    name: string
    username: string
    email: string
    password?: string
    bio?: string
    picture: string
    location?: string
    portfolioWebsite?: string
    reputation?: number
    saved: mongoose.Schema.Types.ObjectId[]
    joinedAt: Date
}

export type TagType = mongoose.Document & {
    name: string
    description: string
    questions: mongoose.Types.ObjectId[]
    followers: mongoose.Types.ObjectId[]
    createdAt: Date
}

export type QuestionType = Pick<mongoose.Document, "_id"> & {
    title: string
    content: string
    tags: mongoose.Types.ObjectId[]
    views: number
    upvotes: mongoose.Types.ObjectId[]
    downvotes: mongoose.Types.ObjectId[]
    author: mongoose.Types.ObjectId
    answers: mongoose.Types.ObjectId[]
    createdAt: Date
}

export type PopulatedQuestionType = Pick<QuestionType, "title" | "content" | "views" | "createdAt" | "_id"> & {
    tags: TagType[]
    upvotes: UserType[]
    downvotes: UserType[]
    answers: Array<object>
    author: UserType
}