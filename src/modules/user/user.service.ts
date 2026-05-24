import { getProfileRepository } from "./user.repository";

export async function getProfileService(userId: number) {
    const user = await getProfileRepository(userId);
    return user;
}