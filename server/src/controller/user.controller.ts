import catchErrors from "../utils/catch-errors.utils";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies.utils";
import { loginSchema, registerSchema } from "./user.schemas";


export const registerHandler = catchErrors(
    async (req, res) => {
        // validate request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        })
        // call service
        const {
            // return users and tokens
            user,
            accessToken,
            refreshToken

        } = await createAccount(request);
        

        // return response
        return setAuthCookies({res, accessToken, refreshToken})
        .status(CREATED).json(user)
    }
)

export const loginHandler = catchErrors(async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"], // requires a useragent
    });
    const {
        accessToken, refreshToken,
    } = await loginUser(request);

    return setAuthCookies({res, accessToken, refreshToken}).status(OK).json({
        message: "Login successful",
    })
});