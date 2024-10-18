const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || undefined;

    if (value === undefined) {
        throw new Error(`Missing env var ${key}`);
    }

    return value;
}

export const MONGO_URL = getEnv("MONGO_URL");
export const PORT = getEnv("PORT" , "3000");
export const NODE_ENV = getEnv("NODE_ENV");