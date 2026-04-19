import bcrypt from "bcrypt";
import crypto from "crypto";

import { User } from "./user.model.js";
import { Session } from "./session.model.js";
import { ApiError } from "../../common/errors/apiError.js";

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

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // generate refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // hash token before storing
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // create session
    const session = await Session.create({
      userId: user._id,
      refreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    });

    return {
      user,
      refreshToken,
      sessionId: session._id
    };
  }
}