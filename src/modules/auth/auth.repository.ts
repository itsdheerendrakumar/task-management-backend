import { User } from "../../models/User.js";
import { Session } from "../../models/Session.js";
import { type NewUser } from "./auth.dtos.js";

export async function findUserByEmail(email: string) {
    const user = await User.findOne({ email });
    return user;
}

export async function storeSession(userId: string, token: string, id: string) {
    await Session.create({
        _id: id,
        user_id: userId,
        refresh_token: token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
}

export async function findSessionById(id: string) {
    const session = await Session.findOne({ _id: id }).populate('user_id', 'role name');
    if (!session) return null;
    
    const sessionObj = session.toObject() as any;
    const userObj = sessionObj.user_id;
    
    return {
        id: sessionObj.id || sessionObj._id,
        refresh_token: sessionObj.refresh_token,
        expires_at: sessionObj.expires_at,
        user: {
            id: userObj?._id?.toString() || userObj?.id,
            role: userObj?.role,
            name: userObj?.name
        }
    };
}

export async function deleteSessionById(id: string) {
    await Session.deleteOne({ _id: id });
}

export async function updateSession(id: string, refreshToken: string, remainingDuration: number) {
    await Session.updateOne(
        { _id: id },
        {
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + remainingDuration)
        }
    );
}

export async function creeateNewUser(body: NewUser) {
    const user = await User.create(body);
    const userObj = user.toJSON();
    delete userObj.password;
    return userObj;
}