import { CookieOptions, Response } from "express";
import { accessTokenExpires, tokenDaysToExpire } from "./date.utils";

const secure = process.env.NODE_ENV !== 'development';

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true, // makes sure the cookies are not avaliabe via any client side js (http protocol)
    secure
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: accessTokenExpires()
})

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: tokenDaysToExpire(),
    path: "/auth/refresh" // which path the refresh token will be sent on, we dont want the refresh token being sent every request, only when refreshed
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