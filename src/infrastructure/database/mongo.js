import mongoose from "mongoose";
import { config } from "../../config/index.js";
import { logger } from "../../common/utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error({ err: error }, "MongoDB connection failed");
    process.exit(1);
  }
};