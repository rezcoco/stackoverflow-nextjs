import mongoose from "mongoose";
import { QuestionType } from "./shared.types";

const questionSchema = new mongoose.Schema<QuestionType>(
    {
        title: { required: true, type: String },
        content: { required: true, type: String },
        tags: [{ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
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
export type QuestionSchemaType = mongoose.InferSchemaType<typeof questionSchema>
const Question: mongoose.Model<QuestionSchemaType> = mongoose.models.Question || mongoose.model("Question", questionSchema)

export default Question