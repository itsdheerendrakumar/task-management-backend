import bcrypt from "bcryptjs";
export function hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);
    return hashedPassword;
}