import bcrypt from "bcryptjs";
export function comparePassword(password: string, hash: string): boolean {
    const isMatched = bcrypt.compareSync(password, hash);
    return isMatched;
}