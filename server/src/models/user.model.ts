import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    username: string,
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(val:string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
    username: { 
        type: String, 
        required: true,  
        unique: true 
    },
    password: { 
        type: String, 
        required: true
    },
},{
    timestamps: true,
})

userSchema.pre("save", async function (next) {
    // Built in function from mongodb
    // if is modified go to has the password
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await hashValue(this.password)
    next();
})

// This will be the hashed value comparing
userSchema.methods.comparePassword = async function (val: string) {
    return compareValue(val, this.password);
}

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;