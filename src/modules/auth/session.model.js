import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true
    },

    userAgent: String,
    ipAddress: String,

    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },

    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// TTL index
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for user session queries
sessionSchema.index({ userId: 1, isRevoked: 1 });

export const Session = mongoose.model("Session", sessionSchema);