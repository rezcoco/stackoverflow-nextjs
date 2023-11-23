import { Schema, model, Model, models, Types, Document } from "mongoose";
import { TUserDoc } from "./user.model";
import { TQuestionDoc } from "./question.model";
import { TAnswerDoc } from "./answer.model";
import { TTagDoc } from "./tag.model";

export type TInteraction = {
    user: Types.ObjectId | TUserDoc,
    action: string,
    question: Types.ObjectId | TQuestionDoc
    answer: Types.ObjectId | TAnswerDoc
    tags: Types.ObjectId[] | TTagDoc[]
}

export type TInteractionDoc = TInteraction & Document & {
    createdDate: Date
}

const interactionSchema = new Schema<TInteractionDoc>({
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    action: { required: true, type: String },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    answer: { type: Schema.Types.ObjectId, ref: "Answer" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    createdDate: { type: Date, default: Date.now }
})

const Interaction: Model<TInteractionDoc> = models.Interaction || model("Interaction", interactionSchema)

export default Interaction