import User from "../models/user.model";

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
    if (existingUser) {
        throw new Error("User already exists");
    }
    // create the user
    const user = await User.create({
        username: data.username,
        password: data.password,
    })
    // create session
    // sign access token & refresh token
    // return user & token
}