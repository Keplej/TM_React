import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import User from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert.utils";
import { CONFLICT } from "../constants/http";

export type CreateAccountParams = {
    username: string;
    password: string;
    userAgent?: string;
}
export const createAccount = async (data:CreateAccountParams) => {
    // verify existing user doesn't exist
    const existingUser = await User.exists({
        username: data.username
    })
    // if (existingUser) {
    //     throw new Error("User already exists");
    // }
    appAssert(!existingUser, CONFLICT, "Username already in use")
    // create the user
    const user = await User.create({
        username: data.username,
        password: data.password,
    })
    // create session
    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent
    })

    // sign access token & refresh token
    const refreshToken = jwt.sign(
        { sessionId: session._id },
        JWT_REFRESH_SECRET, {
            audience: ['user'], // telling us who the user is being assigned to 
            expiresIn: "30d",
        }

    )

    // return user & token
    const accessToken = jwt.sign(
        { 
            userId: user._id,
            sessionId: session._id },
        JWT_SECRET, {
            audience: ['user'], // telling us who the user is being assigned to 
            expiresIn: "15m",
        }
    );
    return {
        user: user.omitPassword(), 
        accessToken, 
        refreshToken
    };
}