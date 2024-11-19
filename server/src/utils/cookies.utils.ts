import { CookieOptions, Response } from "express";
import { accessTokenExpires, tokenDaysToExpire } from "./date.utils";

const secure = process.env.NODE_ENV !== 'development';

export const REFRESH_PATH = "/auth/refresh"

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true, // makes sure the cookies are not avaliabe via any client side js (http protocol)
    secure
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: accessTokenExpires()
})

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: tokenDaysToExpire(),
    path: REFRESH_PATH // which path the refresh token will be sent on, we dont want the refresh token being sent every request, only when refreshed
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
}

export const setAuthCookies = ({res, accessToken, refreshToken}:Params ) =>
    res
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions()); // creating a seperate function for cookieOptions since we will be using cookieOptions in multiple places


    export const clearAuthCookies = (res: Response) => 
        res.clearCookie("accessToken").clearCookie("refreshToken", {
            path: REFRESH_PATH, // matching paths
        });