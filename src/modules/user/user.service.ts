import { getProfileRepository, getUserListingRepository } from "./user.repository";

export async function getProfileService(userId: number) {
    const user = await getProfileRepository(userId);
    return user;
}

export async function getUserListingService() {
    const users = await getUserListingRepository();
    return users;
}