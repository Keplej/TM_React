import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import User from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert.utils";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import {RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken} from "../utils/jwt.utils";
import {ONE_DAY_MS, thirtyDaysFromNow} from "../utils/date.utils";

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

export const refreshUserAccessToken = async (refreshToken: string) => {
    const {
        payload
    } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    })
    // validate payload
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    // get session
    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    // if session was found it's not expired
    appAssert(session
        && session.expiresAt.getTime() > now
        , UNAUTHORIZED, "Session expired");

    // Check if the session is expiring soon, improves user experience in the frontend
    // Prevent random logout on random request
    // refresh the session if it expires in the next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh ? signToken({
        sessionId: session._id},
        refreshTokenSignOptions
    ) : undefined;

    // Sign tokens
    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id,
    })

    return {
        accessToken,
        newRefreshToken,
    }
}