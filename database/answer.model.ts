import mongoose, { Model, model, models } from "mongoose";
import { AnswerType } from "./shared.types";


const answerSchema = new mongoose.Schema<AnswerType>({
    author: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    question: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    content: { required: true, type: String },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
})

const Answer: Model<mongoose.InferSchemaType<typeof answerSchema>> = models.Answer || model("Answer", answerSchema)

export default Answer