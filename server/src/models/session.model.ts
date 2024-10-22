import mongoose from "mongoose";
import { tokenDaysToExpire } from "../utils/date.utils";


export interface SessionDocument extends mongoose.Document {

    userId: mongoose.Types.ObjectId;
    // Optional, when a user signs in from a specific device we will know what session is it
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        index: true, // everytime we query for a user session we will be using the userId
    },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, default: tokenDaysToExpire}
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;