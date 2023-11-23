import mongoose, { Model, model, models } from "mongoose";
import { TQuestionDoc } from "./question.model";

export type TUser = {
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
    saved: mongoose.Types.ObjectId[] | TQuestionDoc[]
}

export type TUserDoc = TUser & mongoose.Document & {
    joinedAt: Date
}

const userSchema = new mongoose.Schema<TUserDoc>(
    {
        clerkId: { type: String, required: true },
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        bio: { type: String },
        picture: { type: String, required: true },
        location: { type: String },
        portfolioWebsite: { type: String },
        reputation: { type: Number, default: 0 },
        saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        joinedAt: { type: Date, default: Date.now }
    }
)

const User: Model<TUserDoc> = models.User || model("User", userSchema)

export default User