// 30 days for tokens to expire utils const
export const tokenDaysToExpire = () =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const accessTokenExpires = () =>
    new Date(Date.now() + 15 * 60 * 1000);