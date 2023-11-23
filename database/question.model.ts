import mongoose, { Types, Model } from "mongoose";
import { TTagDoc } from "./tag.model";
import { TUserDoc } from "./user.model";

export type TQuestion = {
    title: string
    content: string
    tags: Types.ObjectId[] | TTagDoc[]
    views: number
    upvotes: Types.ObjectId[] | TUserDoc[]
    downvotes: Types.ObjectId[] | TUserDoc[]
    author: Types.ObjectId | TUserDoc
    answers: Types.ObjectId[]
}

export type TQuestionDoc = TQuestion & mongoose.Document & {
    createdAt: Date
}

const questionSchema = new mongoose.Schema<TQuestionDoc>(
    {
        title: { required: true, type: String },
        content: { required: true, type: String },
        tags: [{ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
        views: { type: Number, default: 0 },
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Question: Model<TQuestionDoc> = mongoose.models.Question || mongoose.model("Question", questionSchema)

export default Question