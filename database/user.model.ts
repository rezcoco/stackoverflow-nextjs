import mongoose, { Model, model, models } from "mongoose";
import { UserType } from "./shared.types";

const userSchema = new mongoose.Schema<UserType>(
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

const User: Model<mongoose.InferSchemaType<typeof userSchema>> = models.User || model("User", userSchema)

export default User