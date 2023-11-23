import mongoose, { Model, model, models, Types, Document } from "mongoose";
import { TUserDoc } from "./user.model";
import { TQuestionDoc } from "./question.model";

export type TAnswer = {
    author: Types.ObjectId | TUserDoc
    question: Types.ObjectId | TQuestionDoc
    content: string
    upvotes: Types.ObjectId[] | TUserDoc[]
    downvotes: Types.ObjectId[] | TUserDoc[]
}

export type TAnswerDoc = TAnswer & Document & {
    createdAt: Date
}

const answerSchema = new mongoose.Schema<TAnswerDoc>({
    author: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    question: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    content: { required: true, type: String },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
})

const Answer: Model<TAnswerDoc> = models.Answer || model("Answer", answerSchema)

export default Answer