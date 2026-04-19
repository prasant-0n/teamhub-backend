import bcrypt from "bcrypt";
import crypto from "crypto";

import { User } from "./user.model.js";
import { Session } from "./session.model.js";
import { ApiError } from "../../common/errors/apiError.js";

import {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from "./auth.tokens.js";

const SALT_ROUNDS = 10;

export class AuthService {

    // ->  REGISTER

    static async register({ email, password, name }) {
        // normalize email
        email = email.toLowerCase();

        // check existing user
        const existing = await User.findOne({ email });

        if (existing) {
            throw new ApiError(409, "User already exists");
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            email,
            passwordHash,
            name
        });

        return user;
    }

    // =========================
    // LOGIN
    // =========================
    static async login({ email, password, userAgent, ipAddress }) {
        email = email.toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        // generate tokens
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashToken(refreshToken);

        const session = await Session.create({
            userId: user._id,
            refreshTokenHash,
            userAgent,
            ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const accessToken = generateAccessToken({
            userId: user._id,
            sessionId: session._id
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    };

    static async refresh({ refreshToken }) {
        const refreshTokenHash = hashToken(refreshToken);

        const session = await Session.findOne({
            refreshTokenHash,
            isRevoked: false
        });

        if (!session) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (session.expiresAt < new Date()) {
            throw new ApiError(401, "Session expired");
        }

        // 🔁 ROTATION STARTS HERE

        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashToken(newRefreshToken);

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        const accessToken = generateAccessToken({
            userId: session.userId,
            sessionId: session._id
        });

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    };

    static async logout({ sessionId }) {
        await Session.findByIdAndUpdate(sessionId, {
            isRevoked: true
        });
    };

    static async logoutAll({ userId }) {
        await Session.updateMany(
            { userId },
            { isRevoked: true }
        );
    }

}