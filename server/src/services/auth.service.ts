import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import User from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert.utils";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { refreshTokenSignOptions, signToken } from "../utils/jwt.utils";

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

    const userId = user._id
    
    // create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent
    })

    // sign access token & refresh token
    const refreshToken = signToken(
        { 
            sessionId: session._id 
        },
        refreshTokenSignOptions
    )

    // return user & token
    const accessToken = signToken(
        { 
            userId,
            sessionId: session._id 
        },
    );
    return {
        user: user.omitPassword(), 
        accessToken, 
        refreshToken
    };
}

export type LoginParams = {
    username: string;
    password: string;
    userAgent?: string;
}

export const loginUser = async ({username, password, userAgent}:LoginParams) => {
    // get user by user
    const user = await User.findOne({ username })
    appAssert(user, UNAUTHORIZED, "Invalid username or password");

    // validate password from the request
    const isValid = await user.comparePassword(password); // await the promise that will return a boolean
    appAssert(isValid, UNAUTHORIZED, "Invalid username or password");

    const userId = user._id;

    // create a session
    const session = await SessionModel.create({
        userId,
        userAgent,
    })

    const sessionInfo = {
        sessionId: session._id,
    }

    // sign access token & refresh token
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)

    const accessToken = signToken({
        ...sessionInfo, 
        userId: user._id,
    });

    // return user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
}