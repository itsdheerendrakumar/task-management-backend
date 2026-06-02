import type { UserRoles } from "../../utils/types";
import { getProfileRepository, getUserListingRepository, getUserSelectListingRepository } from "./user.repository";

export async function getProfileService(userId: number) {
    const user = await getProfileRepository(userId);
    return user;
}

export async function getUserListingService() {
    const users = await getUserListingRepository();
    return users;
}

export async function getUserSelectListingService(roles: UserRoles[]) {
    const listing = await getUserSelectListingRepository(roles);
    return listing
}