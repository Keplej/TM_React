import bcrypt from "bcrypt";

// If no salt rounds then we have a default value of 10
export const hashValue = async (value: string, saltRounds?: number) => 
    bcrypt.hash(value, saltRounds || 10);

// compares the passwords from hash
export const compareValue = async (value: string, hashedValue: string) =>
    bcrypt.compare(value, hashedValue).catch(() => false);