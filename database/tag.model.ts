import mongoose, { Schema, model, models, Model } from "mongoose";
import { TagType } from "./shared.types";

const tagSchema = new Schema<TagType>({
    name: { required: true, unique: true, type: String },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
})

const Tag: Model<mongoose.InferSchemaType<typeof tagSchema>> = models.Tag || model("Tag", tagSchema)

export default Tag