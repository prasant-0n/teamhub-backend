import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../../config/index.js";

// -> ACCESS TOKEN
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "15m"
  });
};


//-> REFRESH TOKEN

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};